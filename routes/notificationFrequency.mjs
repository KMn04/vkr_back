import express from "express";
import { NotificationFrequency } from "../models/NotificationFrequency.mjs";

const router = express.Router();

// получить все возможные значения
router.get("/notification_frequency", async (req, res) => {
    const allNotificationFrequencies = await NotificationFrequency.findAll();
    res.send(allNotificationFrequencies).status(200);
});

export default router