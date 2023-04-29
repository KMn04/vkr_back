import express from "express";
import { Projects } from "../models/Projects.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const allProjects = await Projects.findAll();
    res.send(allProjects).status(200);
});

export default router