import express from "express";
import { Task_priority } from "../models/Task_priority.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const allTask_priors = await Task_priority.findAll();
    res.send(allTask_priors).status(200);
});

export default router