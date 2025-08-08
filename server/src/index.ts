// server/src/index.ts

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from './lib/prisma';
import { protect, AuthRequest } from './middleware/authMiddleware';
import { JWT_SECRET } from './config';

const app = express();

app.use(cors());
app.use(express.json());

// --- AUTH ROUTES ---

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
      select: { id: true, email: true },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error during registration' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error during login' });
  }
});


// --- SECURE APPLICATION ROUTES ---

// All routes below this point are now protected by the 'protect' middleware.
// A valid JWT is required to access them.

app.get('/api/applications', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    // IMPORTANT: We now only find applications where the userId matches the logged-in user's ID.
    const applications = await prisma.application.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Error Fetching Applications' });
  }
});

app.post("/api/applications", protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { company, role, url, status } = req.body;

    const newApplication = await prisma.application.create({
      data: {
        company,
        role,
        url,
        status,
        // FIX: This is the more explicit and reliable way to create a relation.
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.status(201).json(newApplication);
  } catch (error) {
    // Make the log more specific so we can see it easily
    console.error("ERROR in POST /api/applications:", error); 
    res.status(500).json({ error: "Error Creating Application" });
  }
});

app.patch('/api/applications/:id', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { company, role, url, status } = req.body;

    // This is a crucial security step. We use `updateMany` with a `where` clause
    // that checks both the application ID and the userId. This ensures a user
    // can ONLY modify their own applications.
    const updatedApplication = await prisma.application.updateMany({
      where: { id: id, userId: userId },
      data: { company, role, url, status },
    });

    if (updatedApplication.count === 0) {
      return res.status(404).json({ error: 'Application not found or user not authorized' });
    }

    res.json({ message: 'Application updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error Updating Application' });
  }
});

app.delete('/api/applications/:id', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Similar to PATCH, we use `deleteMany` to ensure a user can only delete their own applications.
    const deleteResult = await prisma.application.deleteMany({
      where: { id: id, userId: userId },
    });

    if (deleteResult.count === 0) {
      return res.status(404).json({ error: 'Application not found or user not authorized' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error Deleting Application' });
  }
});


// --- Start Server ---
const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Server Running on http://localhost:${PORT}`)
);