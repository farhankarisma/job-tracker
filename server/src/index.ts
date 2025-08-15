import express from "express";
import cors from "cors";
import path from "path";
import prisma from "./lib/prisma";
import { protect, AuthRequest } from "./middleware/authMiddleware";
import { uploadSingle, uploadMultiple } from "./middleware/uploadMiddleware";
import fileService from "./services/fileService";
import "dotenv/config";
import { startReminderCronJob } from "./jobs/cron";
import { checkReminders } from "./jobs/cron";
import { sendReminderEmail } from "./services/emailService";
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- SECURE JOB ROUTES ---

app.get("/api/jobs", protect, async (req: AuthRequest, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching jobs" });
  }
});

// POST a new job for the logged-in user
app.post("/api/jobs", protect, async (req: AuthRequest, res) => {
  try {
    const {
      company,
      position,
      status,
      notes,
      jobUrl,
      type,
      color,
      reminderAt,
    } = req.body;
    const dataToCreate: any = {
      company,
      position,
      status,
      notes,
      jobUrl,
      type,
      color,
      userId: req.user.id,
    };

    if (reminderAt) {
      dataToCreate.reminderAt = new Date(reminderAt);
    }
    const newJob = await prisma.job.create({
      data: dataToCreate,
    });

    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: "Error creating job" });
  }
});

// PATCH (update) a job for the logged-in user
app.patch("/api/jobs/:id", protect, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      company,
      position,
      status,
      notes,
      jobUrl,
      type,
      color,
      reminderAt,
    } = req.body;

    const dataToUpdate: any = {
      company,
      position,
      status,
      notes,
      jobUrl,
      type,
      color,
    };

    // Handle the date field carefully
    if (reminderAt) {
      dataToUpdate.reminderAt = new Date(reminderAt);
    } else {
      dataToUpdate.reminderAt = null; // Allow clearing the date
    }

    const updatedJob = await prisma.job.updateMany({
      where: { id: id, userId: req.user.id },
      data: dataToUpdate,
    });

    if (updatedJob.count === 0) {
      return res.status(404).json({ error: "Job not found or not authorized" });
    }

    const job = await prisma.job.findUnique({ where: { id } });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Error updating job" });
  }
});

app.patch("/api/jobs/:id/status", protect, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedJob = await prisma.job.updateMany({
      where: {
        id: id,
        userId: req.user.id,
      },
      data: {
        status: status,
      },
    });

    if (updatedJob.count === 0) {
      return res.status(404).json({ error: "Job not found or not authorized" });
    }

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating job status" });
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

app.get("/api/test-reminders", async (req, res) => {
  console.log("Manually triggering reminder check...");
  try {
    await checkReminders(); // Run the function immediately
    res.json({ 
      success: true, 
      message: "Reminder check completed. Check your server logs and email." 
    });
  } catch (error) {
    console.error("Error in manual reminder check:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error occurred during reminder check",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Test endpoint to send email for a specific job
app.post("/api/test-email/:jobId", protect, async (req: AuthRequest, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await prisma.job.findFirst({
      where: { 
        id: jobId, 
        userId: req.user.id 
      }
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Get user email from Supabase
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(req.user.id);
    
    if (userError || !user?.user?.email) {
      return res.status(404).json({ error: "User email not found" });
    }

    const emailSent = await sendReminderEmail(user.user.email, job);
    
    if (emailSent) {
      res.json({ 
        success: true, 
        message: `Test email sent to ${user.user.email} for job: ${job.company} - ${job.position}` 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: "Failed to send test email" 
      });
    }
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error occurred while sending test email",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// --- FILE MANAGEMENT ROUTES ---

// Get all files for the authenticated user
app.get("/api/files", protect, async (req: AuthRequest, res) => {
  try {
    const { category, search } = req.query;
    
    const whereClause: any = {
      userId: req.user.id
    };

    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { originalName: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const files = await prisma.file.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    // Add download URLs to each file
    const filesWithUrls = files.map(file => ({
      ...file,
      downloadUrl: fileService.getFileUrl(file.filename)
    }));

    res.json(filesWithUrls);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Error fetching files" });
  }
});

// Upload a single file
app.post("/api/files/upload", protect, uploadSingle, async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Validate file
    const validation = fileService.validateFile(req.file);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    // Save file to disk
    const fileResult = await fileService.saveFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      req.user.id
    );

    // Save file metadata to database
    const { category = 'OTHER', description = '', tags = '' } = req.body;

    const savedFile = await prisma.file.create({
      data: {
        filename: fileResult.filename,
        originalName: fileResult.originalName,
        mimeType: fileResult.mimeType,
        size: fileResult.size,
        path: fileResult.path,
        category: category,
        description: description || '',
        tags: tags || '',
        userId: req.user.id,
      },
    });

    res.status(201).json({
      ...savedFile,
      downloadUrl: fileService.getFileUrl(savedFile.filename)
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Error uploading file" });
  }
});

// Upload multiple files
app.post("/api/files/upload-multiple", protect, uploadMultiple, async (req: AuthRequest, res) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const files = req.files as Express.Multer.File[];
    const uploadedFiles = [];

    for (const file of files) {
      // Validate each file
      const validation = fileService.validateFile(file);
      if (!validation.isValid) {
        continue; // Skip invalid files
      }

      try {
        // Save file to disk
        const fileResult = await fileService.saveFile(
          file.buffer,
          file.originalname,
          file.mimetype,
          req.user.id
        );

        // Save file metadata to database
        const savedFile = await prisma.file.create({
          data: {
            filename: fileResult.filename,
            originalName: fileResult.originalName,
            mimeType: fileResult.mimeType,
            size: fileResult.size,
            path: fileResult.path,
            category: 'OTHER', // Default category for bulk upload
            userId: req.user.id,
          },
        });

        uploadedFiles.push({
          ...savedFile,
          downloadUrl: fileService.getFileUrl(savedFile.filename)
        });
      } catch (error) {
        console.error(`Error uploading file ${file.originalname}:`, error);
      }
    }

    res.status(201).json({
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ error: "Error uploading files" });
  }
});

// Download a file
app.get("/api/files/download/:filename", protect, async (req: AuthRequest, res) => {
  try {
    const { filename } = req.params;
    
    // Verify file belongs to user
    const file = await prisma.file.findFirst({
      where: {
        filename: filename,
        userId: req.user.id
      }
    });

    if (!file) {
      return res.status(404).json({ error: "File not found or not authorized" });
    }

    const fullPath = path.join(process.cwd(), 'uploads', file.path);
    
    if (!require('fs').existsSync(fullPath)) {
      return res.status(404).json({ error: "File not found on disk" });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    
    // Send file
    res.sendFile(fullPath);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Error downloading file" });
  }
});

// Update file metadata
app.patch("/api/files/:id", protect, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { category, description, tags } = req.body;

    const updatedFile = await prisma.file.updateMany({
      where: {
        id: id,
        userId: req.user.id
      },
      data: {
        category,
        description: description || '',
        tags: tags || ''
      },
    });

    if (updatedFile.count === 0) {
      return res.status(404).json({ error: "File not found or not authorized" });
    }

    const file = await prisma.file.findUnique({ where: { id } });
    res.json({
      ...file,
      downloadUrl: fileService.getFileUrl(file!.filename)
    });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ error: "Error updating file" });
  }
});

// Delete a file
app.delete("/api/files/:id", protect, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Get file info before deletion
    const file = await prisma.file.findFirst({
      where: {
        id: id,
        userId: req.user.id
      }
    });

    if (!file) {
      return res.status(404).json({ error: "File not found or not authorized" });
    }

    // Delete from database
    await prisma.file.delete({
      where: { id: id }
    });

    // Delete physical file
    await fileService.deleteFile(file.path);

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Error deleting file" });
  }
});

// Get file statistics
app.get("/api/files/stats", protect, async (req: AuthRequest, res) => {
  try {
    const totalFiles = await prisma.file.count({
      where: { userId: req.user.id }
    });

    const totalSize = await prisma.file.aggregate({
      where: { userId: req.user.id },
      _sum: { size: true }
    });

    const filesByCategory = await prisma.file.groupBy({
      by: ['category'],
      where: { userId: req.user.id },
      _count: { category: true }
    });

    res.json({
      totalFiles,
      totalSize: totalSize._sum.size || 0,
      filesByCategory: filesByCategory.map(item => ({
        category: item.category,
        count: item._count.category
      }))
    });
  } catch (error) {
    console.error("Error fetching file stats:", error);
    res.status(500).json({ error: "Error fetching file statistics" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startReminderCronJob();
});
