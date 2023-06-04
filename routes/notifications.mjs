import express from "express";
import {Notification} from "../models/Notification.mjs";
import {ProjectTeamMember} from "../models/ProjectTeamMember.mjs";
import {User} from "../models/User.mjs";
import {Role} from "../models/Role.mjs";

const router = express.Router();

// получение списка уведомлений на проекте
router.get("/:projectId/notifications", async (req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole) {
        const projectId = req.params.projectId;
        let results = await Notification.find({id: projectId});
        const preparedResult = results.map((notification) => {
            return {
                receiverId: notification.dataValues.receiverId,
                receiver: notification.dataValues.receiver,
                type: notification.dataValues.type
            }
        })
        res.send(preparedResult).status(200);
    } else {
        const err = new Error("У вас нет доступа для просмотра уведомлений");
        res.status(400);
        res.send(err).status(400);
    }
});

// настройка уведомлений
router.post("/:projectId/notifications", async (req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole < 4) {
        const projectId = req.params.projectId;
        const user = await User.findOne({userId: req.body.userId});
        let results = await Notification.find({id: projectId, receiverId: user.userId});
        if (results) {
            results.forEach((notification) => {

            });
        } else {

        }
        res.send().status(200);
    } else {
        const err = new Error("У вас нет доступа для настройки уведомлений");
        res.status(400);
        res.send(err).status(400);
    }
});



export default router