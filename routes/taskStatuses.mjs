import express from "express";
import { TaskStatus } from "../models/TaskStatus.mjs";

const router = express.Router();

// получить все возможные значения
router.get("/", async (req, res) => {
    const allTaskStats = await TaskStatus.findAll();
    res.send(allTaskStats).status(200);
});

export default router