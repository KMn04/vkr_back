import express from "express";
import { TaskType } from "../models/TaskType.mjs";

const router = express.Router();

// получить все возможные значения
router.get("/task_type", async (req, res) => {
    const allTaskTypes = await TaskType.findAll();
    res.send(allTaskTypes).status(200);
});

export default router