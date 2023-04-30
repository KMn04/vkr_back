import express from "express";
import { TaskPriority } from "../models/TaskPriority.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const allTask_priors = await TaskPriority.findAll();
    res.send(allTask_priors).status(200);
});

export default router