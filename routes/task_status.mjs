import express from "express";
import { TaskStatus } from "../models/TaskStatus.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const allTask_stats = await TaskStatus.findAll();
    res.send(allTask_stats).status(200);
});

export default router