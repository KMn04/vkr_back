import express from "express";
import { Tasks } from "../models/Task.mjs";
import {ProjectTeamMembers} from "../models/ProjectTeamMembers.mjs";

const router = express.Router();

// получить все задачи на проекте
router.get("/:projectId/tasks", async (req, res) => {
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole) {
        const allProjectTasks = await Tasks.findAll({
            where: {
                projectId: req.params.projectId,
                deletedAt: null,
            },
            order: [
                ['statusCode', 'ASC'],
                ['priorityCode', 'ASC'],
            ],
        });
        res.send(allProjectTasks).status(200);
    }
    else {
        const err = new Error("У вас нет доступа к задачам этого проекта");
        res.status(400);
        res.send(err).status(400);
    }
});

// получить задачу
router.get("/:projectId/tasks/:taskId", async (req, res) => {
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole) {
        const task = await Tasks.findOne(
            {
                where: {
                    taskId: req.params.taskId,
                    deletedAt: null},
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
        })
        res.send(task).status(200);
    }
    else {
        const err = new Error("У вас нет доступа к этой задаче");
        res.status(400);
        res.send(err).status(400);
    }
});

// создать задачу
router.post("/:projectId/tasks", async (req, res) => {
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole.roleCode < 4) {
        const newTask = await Tasks.create({
            name: req.body.name,
            description: req.body.description,
            typeCode: req.body.typeCode,
            priorityCode: req.body.priorityCode,
            assigneeId: req.body.assigneeId,
            projectId: req.params.projectId,
            authorId: req.body.user.userId,
            supervisorId: req.body.supervisorId,
            statusCode: 1,
            sumHoursFact: 0,
        });
        res.send(newTask).status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на создание задач");
        res.status(400);
        res.send(err).status(400);
    }
});

// изменить информацию о задаче
router.put("/:projectId/tasks/:taskId", async(req, res) => {
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole.roleCode < 4) {
        const tempTask = await Tasks.findOne(
            {
                where: {
                    taskId: req.params.taskId,
                    deletedAt: null},
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
        });
        const {projectId, authorId, typeCode, ...newBody} = req.body;
        await tempTask.update(newBody);
        res.send(tempTask).status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на изменение этой задачи");
        res.status(400);
        res.send(err).status(400);
    }
});

// изменить статус задачи
router.put("/:projectId/tasks/:taskId/changeStatus", async(req, res) => {
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    const thisTask = await Tasks.findOne(
        {
            where: {
                taskId: req.params.taskId,
                deletedAt: null},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
    });
    if (actualRole.roleCode < 4 || thisTask.assigneeId === req.body.user.userId || thisTask.supervisorId === req.body.user.userId) {
        await thisTask.update({ statusCode: req.body.statusCode });
        res.send(thisTask).status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на изменение статуса этой задачи");
        res.status(400);
        res.send(err).status(400);
    }
});

// вписать часы по задаче
router.put("/:projectId/tasks/:taskId/reportTime", async(req, res) => {
    const thisTask = await Tasks.findOne(
        {
            where: {
                taskId: req.params.taskId,
                deletedAt: null},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
    });
    if (thisTask.assigneeId === req.body.user.userId) {
        const sumTime = +thisTask.sumHoursFact + +req.body.sumHoursFact;
        await thisTask.update({ sumHoursFact: sumTime });
        res.send(thisTask).status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на списание времени по этой задаче");
        res.status(400);
        res.send(err).status(400);
    }
});

// удалить задачу
router.delete("/:projectId/tasks/:taskId", async(req, res) => {
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole.roleCode < 4) {
        const thisTask = await Tasks.findOne(
            {
                where: {
                    taskId: req.params.taskId,
                    deletedAt: null},
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
        });
        await thisTask.update({ deletedAt: Date.now() });
        res.send().status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на удаление этой задачи");
        res.status(400);
        res.send(err).status(400);
    }
});

export default router