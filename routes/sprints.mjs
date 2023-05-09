import express from "express";
import { Sprint } from "../models/Sprint.mjs";

const router = express.Router();

// получить все возможные значения
router.get("/sprints", async (req, res) => {
    const allSprints = await Sprint.findAll();
    res.send(allSprints).status(200);
});

export default router