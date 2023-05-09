import express from "express";
import { ProjectStatus } from "../models/ProjectStatus.mjs";

const router = express.Router();

// получить все статусы
router.get("/project_status", async (req, res) => {
    const allProjectStatuses = await ProjectStatus.findAll();
    res.send(allProjectStatuses).status(200);
});

export default router