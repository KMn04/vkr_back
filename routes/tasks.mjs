import express from "express";
import { Tasks } from "../models/Task.mjs";
import {ProjectTeamMembers} from "../models/ProjectTeamMembers.mjs";
import {Op} from "sequelize";
import {Projects} from "../models/Projects.mjs";

const router = express.Router();


// получить все задачи, назначенные на пользователя
router.get("/assignee", async (req, res) => {
    const allUserTasks = await Tasks.findAll({
        where: {
            assigneeId: req.body.user.userId,
            deletedAt: null,
        }
    })
    res.send(allUserTasks).status(200);
});

// получить все задачи, назначенные на пользователя для проверки
router.get("/supervisor", async (req, res) => {
    const allSuperviseTasks = await Tasks.findAll({
        where: {
            supervisorId: req.body.user.userId,
            deletedAt: null,
        }
    })
    res.send(allSuperviseTasks).status(200);
});

// получить все задачи, созданные пользователем
router.get("/author", async (req, res) => {
    const allAuthorTasks = await Tasks.findAll({
        where: {
            authorId: req.body.user.userId,
            deletedAt: null,
        }
    })
    res.send(allAuthorTasks).status(200);
});

// получить все задачи
router.get("/", async (req, res) => {
    const allUserTasks = await Tasks.findAll({
        where: {
            [Op.or]: {
                assigneeId: req.body.user.userId,
                supervisorId: req.body.user.userId,
                authorId: req.body.user.userId,
            },
            deletedAt: null,
        }
    })
    res.send(allUserTasks).status(200);
});

// получить задачу
router.get(/^(\/(assignee|author|supervisor))?\/:taskId$/, async (req, res) => {
    const thisTask = await Tasks.findByPk(
        req.params.taskId,
        {
            where: {deletedAt: null},
            attributes: {
                exclude: ['createdAt', 'deletedAt', 'updatedAt']
            }
    });
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.body.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole) {
        res.send(thisTask).status(200);
    }
    else {
        const err = new Error("У вас нет доступа к этой задаче");
        res.status(400);
        res.send(err).status(400);
    }
});

// создать задачу
router.post("/", async (req, res) => {
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.body.projectId,
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
            projectId: req.body.projectId,
            authorId: req.body.user.userId,
            supervisorId: req.body.supervisorId,
            statusCode: 1,
            sumHoursFact: 0,
        });
        res.send().status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на создание задач");
        res.status(400);
        res.send(err).status(400);
    }
});

// изменить информацию о задаче
router.put(/^(\/(assignee|author|supervisor))?\/:taskId$/, async(req, res) => {
    const thisTask = await Tasks.findByPk(
        req.params.taskId,
        {
            where: {deletedAt: null},
            attributes: {
                exclude: ['createdAt', 'deletedAt', 'updatedAt']
            }
        });
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.body.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole.roleCode < 4) {
        const {projectId, authorId, typeCode, ...newBody} = req.body;
        await thisTask.update(newBody);
        res.send(thisTask).status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на изменение этой задачи");
        res.status(400);
        res.send(err).status(400);
    }
});

// изменить статус задачи
router.put(/^(\/(assignee|author|supervisor))?\/:taskId\/changeStatus$/, async(req, res) => {
    const thisTask = await Tasks.findByPk(
        req.params.taskId,
        {
            where: {deletedAt: null},
            attributes: {
                exclude: ['createdAt', 'deletedAt', 'updatedAt']
            }
        });
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.body.projectId,
            userId: req.body.user.userId,
            finishedAt: null
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
router.put(/^(\/(assignee|author|supervisor))?\/:taskId\/reportTime$/, async(req, res) => {
    const thisTask = await Tasks.findByPk(
        req.params.taskId,
        {
            where: {deletedAt: null},
            attributes: {
                exclude: ['createdAt', 'deletedAt', 'updatedAt']
            }
        });
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.body.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (thisTask.assigneeId === req.body.user.userId) {
        const sumTime = +thisTask.sumHoursFact + +req.body.sumHoursFact;
        await thisTask.update({ sumHoursFact: sumTime });
        res.send(thisTask).status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на изменение статуса этой задачи");
        res.status(400);
        res.send(err).status(400);
    }
});

// удалить задачу
router.delete(/^(\/(assignee|author|supervisor))?\/:taskId$/, async(req, res) => {
    const thisTask = await Tasks.findByPk(
        req.params.taskId,
        {
            where: {deletedAt: null},
            attributes: {
                exclude: ['createdAt', 'deletedAt', 'updatedAt']
            }
        });
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.body.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole.roleCode < 4) {
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