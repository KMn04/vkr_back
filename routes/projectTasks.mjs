import express from "express";
import { Task } from "../models/Task.mjs";
import { ProjectTeamMember } from "../models/ProjectTeamMember.mjs";
import {Role} from "../models/Role.mjs";
import {TaskType} from "../models/TaskType.mjs";
import {Project} from "../models/Project.mjs";
import {User} from "../models/User.mjs";
import {TaskStatus} from "../models/TaskStatus.mjs";
import {TaskPriority} from "../models/TaskPriority.mjs";
import {Op} from 'sequelize'

const router = express.Router();


// получить все задачи на проекте
router.get("/:projectId/tasks", async (req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole) {
        const allProjectTasks = await Task.findAll({
            where: {
                projectId: req.params.projectId,
                deletedAt: null,
            },
            order: [
                ['statusCode', 'ASC'],
                ['priorityCode', 'ASC'],
            ],
            include: [
                {
                    model: TaskStatus,
                    attributes: ['name']
                },
                {
                    model: TaskPriority,
                    attributes: ['name']
                }
            ]
        });
        const preparedResult = allProjectTasks.map((taskModel) => {
            return {
                taskId: taskModel.dataValues.taskId,
                name: taskModel.dataValues.name,
                description: taskModel.dataValues.description,
                statusCode: taskModel.dataValues.statusCode,
                status: taskModel.taskStatus.name,
                priorityCode: taskModel.dataValues.priorityCode,
                priority: taskModel.taskPriority.name
            }
        })
        res.send(preparedResult).status(200);
    }
    else {
        const err = new Error("У вас нет доступа к задачам этого проекта");
        res.status(400);
        res.send(err).status(400);
    }
});

// получить задачу
router.get("/:projectId/tasks/:taskId", async (req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole) {
        const task = await Task.findOne(
            {
                where: {
                    taskId: req.params.taskId,
                    deletedAt: null
                },
                include: [
                    {
                        model: TaskStatus,
                        attributes: ['name']
                    },
                    {
                        model: TaskPriority,
                        attributes: ['name']
                    },
                    {
                        model: TaskType,
                        attributes: ['name']
                    },
                    {
                        model: Project,
                        attributes: ['name']
                    }
                ]
        })
        const author = await User.findOne({
            where: {userId: task.dataValues.authorId},
            attributes: ['firstName', 'secondName']
        });
        const assignee = await User.findOne({
            where: {userId: task.dataValues.assigneeId},
            attributes: ['firstName', 'secondName']
        });
        const supervisor = await User.findOne({
            where: {userId: task.dataValues.supervisorId},
            attributes: ['firstName', 'secondName']
        });

        const assigneeName = assignee 
            ? assignee.dataValues.firstName + " " + assignee.dataValues.secondName 
            : ''

        const supervizorName = supervisor 
            ? supervisor.dataValues.firstName + " " + supervisor.dataValues.secondName 
            : ''

        const authorName = author 
            ? author.dataValues.firstName + " " + author.dataValues.secondName 
            : ''

        const preparedResult = {
            taskId: task.dataValues.taskId,
            name: task.dataValues.name,
            description: task.dataValues.description,
            typeCode: task.dataValues.typeCode,
            type: task.taskType.name,
            statusCode: task.dataValues.statusCode,
            status: task.taskStatus.name,
            priorityCode: task.dataValues.priorityCode,
            priority: task.taskPriority.name,
            projectId: task.dataValues.projectId,
            project: task.project.name,
            dateStartPlan: task.dataValues.dateStartPlan,
            dateStartFact: task.dataValues.dateStartFact,
            dateFinishPlan: task.dataValues.dateFinishPlan,
            dateFinishFact: task.dataValues.dateFinishFact,
            sumHoursPlan: task.dataValues.sumHoursPlan,
            sumHoursFact: task.dataValues.sumHoursFact,
            assigneeId: task.dataValues.assigneeId,
            assignee: assigneeName,
            supervisorId: task.dataValues.supervisorId,
            supervisor: supervizorName,
            authorId: task.dataValues.authorId,
            author: authorName,
            roleCode: actualRole.roleCode
        }
        res.send(preparedResult).status(200);
    }
    else {
        const err = new Error("У вас нет доступа к этой задаче");
        res.status(400);
        res.send(err).status(400);
    }
});

// создать задачу
router.post("/:projectId/tasks", async (req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
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
            projectId: req.params.projectId,
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
router.put("/:projectId/tasks/:taskId", async(req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole.roleCode < 4) {
        const tempTask = await Task.findOne(
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
        const task = await Task.findOne(
            {
                where: {
                    taskId: tempTask.dataValues.taskId,
                    deletedAt: null
                },
                include: [
                    {
                        model: TaskStatus,
                        attributes: ['name']
                    },
                    {
                        model: TaskPriority,
                        attributes: ['name']
                    },
                    {
                        model: TaskType,
                        attributes: ['name']
                    },
                    {
                        model: Project,
                        attributes: ['name']
                    }
                ]
            })
        const author = await User.findOne({
            where: {userId: task.dataValues.authorId},
            attributes: ['firstName', 'secondName']
        });
        const assignee = await User.findOne({
            where: {userId: task.dataValues.assigneeId},
            attributes: ['firstName', 'secondName']
        });
        const supervisor = await User.findOne({
            where: {userId: task.dataValues.supervisorId},
            attributes: ['firstName', 'secondName']
        });
        const preparedResult = {
            taskId: task.dataValues.taskId,
            name: task.dataValues.name,
            description: task.dataValues.description,
            typeCode: task.dataValues.typeCode,
            type: task.taskType.name,
            statusCode: task.dataValues.statusCode,
            status: task.taskStatus.name,
            priorityCode: task.dataValues.priorityCode,
            priority: task.taskPriority.name,
            projectId: task.dataValues.projectId,
            project: task.project.name,
            dateStartPlan: task.dataValues.dateStartPlan,
            dateStartFact: task.dataValues.dateStartFact,
            dateFinishPlan: task.dataValues.dateFinishPlan,
            dateFinishFact: task.dataValues.dateFinishFact,
            sumHoursPlan: task.dataValues.sumHoursPlan,
            sumHoursFact: task.dataValues.sumHoursFact,
            assigneeId: task.dataValues.assigneeId,
            assignee: assignee.dataValues.firstName + " " + assignee.dataValues.secondName,
            supervisorId: task.dataValues.supervisorId,
            supervisor: supervisor.dataValues.firstName + " " + supervisor.dataValues.secondName,
            authorId: task.dataValues.authorId,
            author: author.dataValues.firstName + " " + author.dataValues.secondName,
            roleCode: actualRole.roleCode
        }
        res.send(preparedResult).status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на изменение этой задачи");
        res.status(400);
        res.send(err).status(400);
    }
});

// изменить статус задачи
router.put("/:projectId/tasks/:taskId/changeStatus", async(req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    const thisTask = await Task.findOne(
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
        const task = await Task.findOne(
            {
                where: {
                    taskId: thisTask.dataValues.taskId,
                    deletedAt: null
                },
                include: [
                    {
                        model: TaskStatus,
                        attributes: ['name']
                    },
                    {
                        model: TaskPriority,
                        attributes: ['name']
                    },
                    {
                        model: TaskType,
                        attributes: ['name']
                    },
                    {
                        model: Project,
                        attributes: ['name']
                    }
                ]
            })
        const author = await User.findOne({
            where: {userId: task.dataValues.authorId},
            attributes: ['firstName', 'secondName']
        });
        const assignee = await User.findOne({
            where: {userId: task.dataValues.assigneeId},
            attributes: ['firstName', 'secondName']
        });
        const supervisor = await User.findOne({
            where: {userId: task.dataValues.supervisorId},
            attributes: ['firstName', 'secondName']
        });
        const preparedResult = {
            taskId: task.dataValues.taskId,
            name: task.dataValues.name,
            description: task.dataValues.description,
            typeCode: task.dataValues.typeCode,
            type: task.taskType.name,
            statusCode: task.dataValues.statusCode,
            status: task.taskStatus.name,
            priorityCode: task.dataValues.priorityCode,
            priority: task.taskPriority.name,
            projectId: task.dataValues.projectId,
            project: task.project.name,
            dateStartPlan: task.dataValues.dateStartPlan,
            dateStartFact: task.dataValues.dateStartFact,
            dateFinishPlan: task.dataValues.dateFinishPlan,
            dateFinishFact: task.dataValues.dateFinishFact,
            sumHoursPlan: task.dataValues.sumHoursPlan,
            sumHoursFact: task.dataValues.sumHoursFact,
            assigneeId: task.dataValues.assigneeId,
            assignee: assignee.dataValues.firstName + " " + assignee.dataValues.secondName,
            supervisorId: task.dataValues.supervisorId,
            supervisor: supervisor.dataValues.firstName + " " + supervisor.dataValues.secondName,
            authorId: task.dataValues.authorId,
            author: author.dataValues.firstName + " " + author.dataValues.secondName,
            roleCode: actualRole.roleCode
        }
        res.send(preparedResult).status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на изменение статуса этой задачи");
        res.status(400);
        res.send(err).status(400);
    }
});

// вписать часы по задаче
router.put("/:projectId/tasks/:taskId/reportTime", async(req, res) => {
    const thisTask = await Task.findOne(
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
        const task = await Task.findOne(
            {
                where: {
                    taskId: thisTask.dataValues.taskId,
                    deletedAt: null
                },
                include: [
                    {
                        model: TaskStatus,
                        attributes: ['name']
                    },
                    {
                        model: TaskPriority,
                        attributes: ['name']
                    },
                    {
                        model: TaskType,
                        attributes: ['name']
                    },
                    {
                        model: Project,
                        attributes: ['name']
                    }
                ]
            })
        const author = await User.findOne({
            where: {userId: task.dataValues.authorId},
            attributes: ['firstName', 'secondName']
        });
        const assignee = await User.findOne({
            where: {userId: task.dataValues.assigneeId},
            attributes: ['firstName', 'secondName']
        });
        const supervisor = await User.findOne({
            where: {userId: task.dataValues.supervisorId},
            attributes: ['firstName', 'secondName']
        });
        const preparedResult = {
            taskId: task.dataValues.taskId,
            name: task.dataValues.name,
            description: task.dataValues.description,
            typeCode: task.dataValues.typeCode,
            type: task.taskType.name,
            statusCode: task.dataValues.statusCode,
            status: task.taskStatus.name,
            priorityCode: task.dataValues.priorityCode,
            priority: task.taskPriority.name,
            projectId: task.dataValues.projectId,
            project: task.project.name,
            dateStartPlan: task.dataValues.dateStartPlan,
            dateStartFact: task.dataValues.dateStartFact,
            dateFinishPlan: task.dataValues.dateFinishPlan,
            dateFinishFact: task.dataValues.dateFinishFact,
            sumHoursPlan: task.dataValues.sumHoursPlan,
            sumHoursFact: task.dataValues.sumHoursFact,
            assigneeId: task.dataValues.assigneeId,
            assignee: assignee.dataValues.firstName + " " + assignee.dataValues.secondName,
            supervisorId: task.dataValues.supervisorId,
            supervisor: supervisor.dataValues.firstName + " " + supervisor.dataValues.secondName,
            authorId: task.dataValues.authorId,
            author: author.dataValues.firstName + " " + author.dataValues.secondName
        }
        res.send(preparedResult).status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на списание времени по этой задаче");
        res.status(400);
        res.send(err).status(400);
    }
});

// удалить задачу
router.delete("/:projectId/tasks/:taskId", async(req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole.roleCode < 4) {
        const thisTask = await Task.findOne(
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