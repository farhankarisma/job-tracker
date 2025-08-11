import express from "express";
import cors from "cors";
import prisma from "./lib/prisma";
import { protect, AuthRequest } from "./middleware/authMiddleware";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- SECURE JOB ROUTES ---

app.get('/api/jobs', protect, async (req: AuthRequest, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});

// POST a new job for the logged-in user
app.post('/api/jobs', protect, async (req: AuthRequest, res) => {
  try {
    const { company, position, status, notes, jobUrl } = req.body;
    const newJob = await prisma.job.create({
      data: {
        company,
        position,
        status,
        notes,
        jobUrl,
        userId: req.user.id,
      },
    });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: 'Error creating job' });
  }
});

// PATCH (update) a job for the logged-in user
app.patch('/api/jobs/:id', protect, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { company, position, status, notes, jobUrl } = req.body;

    const updatedJob = await prisma.job.updateMany({
      where: { id: id, userId: req.user.id }, // Security check
      data: { company, position, status, notes, jobUrl },
    });

    if (updatedJob.count === 0) {
      return res.status(404).json({ error: 'Job not found or not authorized' });
    }
    
    // Fetch and return the updated job object
    const job = await prisma.job.findUnique({ where: { id } });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Error updating job' });
  }
});

// DELETE a job for the logged-in user
app.delete("/api/jobs/:id", protect, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const deleteResult = await prisma.job.deleteMany({
      where: {
        id: id,
        userId: req.user.id, // Security check: only allow user to delete their own job
      },
    });

    if (deleteResult.count === 0) {
      return res.status(404).json({ error: "Job not found or not authorized" });
    }

    res.status(204).send(); // 204 No Content is a standard success response for DELETE
  } catch (error) {
    res.status(500).json({ error: "Error deleting job" });
  }
});

// --- SECURE CONTACT ROUTES ---

app.get("/api/contacts", protect, async (req: AuthRequest, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching contacts" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
