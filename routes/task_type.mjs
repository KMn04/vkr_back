import express from "express";
import { Task_type } from "../models/Task_type.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const allTask_types = await Task_type.findAll();
    res.send(allTask_types).status(200);
});

export default router