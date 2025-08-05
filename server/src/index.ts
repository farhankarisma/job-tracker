import express from "express";
import cors from "cors";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/applications", async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Error Fetching Applications" });
  }
});

app.post("/api/applications", async (req, res) => {
  try {
    const { company, role, url, status } = req.body;
    const newApplications = await prisma.application.create({
      data: { company, role, url, status },
    });
    res.status(201).json(newApplications);
  } catch (error) {
    res.status(500).json({ error: "Error Creating Application" });
  }
});

app.patch("/api/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { company, role, url, status } = req.body;
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { company, role, url, status },
    });
    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ error: "Error Updating Application" });
  }
});

app.delete("/api/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.application.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error Deleting Application" });
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Server Running on http://localhost:${PORT}`)
);
