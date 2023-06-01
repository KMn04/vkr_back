import express from "express";
import { TaskPriority } from "../models/TaskPriority.mjs";

const router = express.Router();

// получить все возможные значения
router.get("/", async (req, res) => {
    const allTaskPriors = await TaskPriority.findAll();
    res.send(allTaskPriors).status(200);
});

export default router