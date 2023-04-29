import express from "express";
import { Sprints } from "../models/Sprints.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const allSprints = await Sprints.findAll();
    res.send(allSprints).status(200);
});

export default router