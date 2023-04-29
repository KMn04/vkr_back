import express from "express";
import { Tasks } from "../models/Task.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const allTasks = await Tasks.findAll();
    res.send(allTasks).status(200);
});

export default router