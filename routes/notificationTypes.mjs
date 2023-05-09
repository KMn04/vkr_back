import express from "express";
import { NotificationType } from "../models/NotificationType.mjs";

const router = express.Router();

// получить все возможные значения
router.get("/notification_type", async (req, res) => {
    const allNotificationTypes = await NotificationType.findAll();
    res.send(allNotificationTypes).status(200);
});

export default router