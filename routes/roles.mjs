import express from "express";
import { Role } from "../models/Role.mjs";

const router = express.Router();

// получить все возможные значения
router.get("/", async (req, res) => {
    const allRoles = await Role.findAll();
    res.send(allRoles).status(200);
});

export default router