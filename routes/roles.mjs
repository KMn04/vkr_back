import express from "express";
import { Roles } from "../models/Roles.mjs";

const router = express.Router();

// получить все возможные значения
router.get("/roles", async (req, res) => {
    const allRoles = await Roles.findAll();
    res.send(allRoles).status(200);
});

export default router