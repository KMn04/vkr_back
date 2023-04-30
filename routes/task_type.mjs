import express from "express";
import { TaskType } from "../models/TaskType.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const allTask_types = await TaskType.findAll();
    res.send(allTask_types).status(200);
});

export default router