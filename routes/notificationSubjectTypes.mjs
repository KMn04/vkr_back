import express from "express";
import { NotificationSubjectType } from "../models/NotificationSubjectType.mjs";

const router = express.Router();

// получить все возможные значения
router.get("/notification_subject_type", async (req, res) => {
    const allNotificationSubjectTypes = await NotificationSubjectType.findAll();
    res.send(allNotificationSubjectTypes).status(200);
});

export default router