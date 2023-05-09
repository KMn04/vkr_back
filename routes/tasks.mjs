import express from "express";
import { Task } from "../models/Task.mjs";
import { ProjectTeamMember } from "../models/ProjectTeamMember.mjs";
import {Op} from "sequelize";

const router = express.Router();


// получить все задачи пользователя с учётом фильтрации его роли на задаче
router.get("/", async (req, res) => {
    const whereRequest = {
        deletedAt: null,
    };
    const showAssigned = req.query.showAssigned;
    const showSupervised = req.query.showSupervised;
    const showAuthored = req.query.showAuthored;
    const tempOr = {};
    if(showAssigned){
        tempOr.assigneeId = req.body.user.userId
    }
    if(showSupervised){
        tempOr.supervisorId = req.body.user.userId
    }
    if(showAuthored){
        tempOr.authorId = req.body.user.userId
    }
    if (showAssigned || showSupervised || showAuthored){

        whereRequest[Op.or] = tempOr
    }
    else {
        whereRequest[Op.or] = {
            assigneeId: req.body.user.userId,
            supervisorId: req.body.user.userId,
            authorId: req.body.user.userId
        }
    }
    const allUserTasks = await Task.findAll({
        where: whereRequest,
        attributes: {
                exclude: ['updatedAt', 'createdAt']
            }
    });
    res.send(allUserTasks).status(200);
});

// получить задачу
router.get('/:taskId', async (req, res) => {
    const thisTask = await Task.findOne(
        {
            where: {
                taskId: req.params.taskId,
                deletedAt: null},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
    });
    if (thisTask){
        const actualRole = await ProjectTeamMember.findOne({
            where: {
                projectId: thisTask.projectId,
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
    }
    else {
        const err = new Error("Такой задачи не существует");
        res.status(400);
        res.send(err).status(400);
    }
});

// создать задачу
router.post("/", async (req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.body.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole.roleCode < 4) {
        const newTask = await Task.create({
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
router.put('/:taskId', async(req, res) => {
    const thisTask = await Task.findOne(
        {
            where: {
                taskId: req.params.taskId,
                deletedAt: null},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
    if (thisTask){
        const actualRole = await ProjectTeamMember.findOne({
            where: {
                projectId: thisTask.projectId,
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
    }
    else {
        const err = new Error("Такой задачи не существует");
        res.status(400);
        res.send(err).status(400);
    }
});

// изменить статус задачи
router.put('/:taskId/changeStatus', async(req, res) => {
    const thisTask = await Task.findOne(
        {
            where: {
                taskId: req.params.taskId,
                deletedAt: null},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
    if (thisTask){
        const actualRole = await ProjectTeamMember.findOne({
            where: {
                projectId: thisTask.projectId,
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
    }
    else {
        const err = new Error("Такой задачи не существует");
        res.status(400);
        res.send(err).status(400);
    }
});

// вписать часы по задаче
router.put('/:taskId/reportTime', async(req, res) => {
    const thisTask = await Task.findOne(
        {
            where: {
                taskId: req.params.taskId,
                deletedAt: null},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
    if (thisTask){
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
    }
    else {
        const err = new Error("Такой задачи не существует");
        res.status(400);
        res.send(err).status(400);
    }
});

// удалить задачу
router.delete('/:taskId', async(req, res) => {
    const thisTask = await Task.findOne(
        {
            where: {
                taskId: req.params.taskId,
                deletedAt: null},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
    if (thisTask){
        const actualRole = await ProjectTeamMember.findOne({
            where: {
                projectId: thisTask.projectId,
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
    }
    else {
        const err = new Error("Такой задачи не существует");
        res.status(400);
        res.send(err).status(400);
    }
});

export default router