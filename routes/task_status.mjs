import express from "express";
import { Task_status } from "../models/Task_status.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const allTask_stats = await Task_status.findAll();
    res.send(allTask_stats).status(200);
});

export default router