import express from "express";
import { Task } from "../models/Task.mjs";
import { ProjectTeamMember } from "../models/ProjectTeamMember.mjs";
import {Op} from "sequelize";
import {TaskStatus} from "../models/TaskStatus.mjs";
import {TaskPriority} from "../models/TaskPriority.mjs";
import {TaskType} from "../models/TaskType.mjs";
import {Project} from "../models/Project.mjs";
import {User} from "../models/User.mjs";

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
        },
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

    const preparedResult = allUserTasks.map((taskModel) => {
        return {
            taskId: taskModel.dataValues.taskId,
            name: taskModel.dataValues.name,
            description: taskModel.dataValues.description,
            statusCode: taskModel.dataValues.statusCode,
            status: taskModel.taskStatus.name,
            priorityCode: taskModel.dataValues.priorityCode,
            priority: taskModel.taskPriority.name,
            projectId: taskModel.dataValues.projectId,
        }
    })
    res.send(preparedResult).status(200);
});

// получить задачу
router.get('/:taskId', async (req, res) => {
    const task = await Task.findOne(
        {
            where: {
                taskId: req.params.taskId,
                deletedAt: null},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
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
    });
    if (task){
        const actualRole = await ProjectTeamMember.findOne({
            where: {
                projectId: task.projectId,
                userId: req.body.user.userId,
                finishedAt: null
            }
        });
        if (actualRole) {
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
            const {projectId, authorId, ...newBody} = req.body;
            await thisTask.update(newBody);
            await thisTask.save()
            const task = await Task.findOne(
                {
                    where: {
                        taskId: req.params.taskId,
                        deletedAt: null},
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
                });
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
                supervisorId: task.dataValues.supervisorId,
                authorId: task.dataValues.authorId,
            }
            res.send(preparedResult).status(200);
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
                deletedAt: null}
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
    const task = await Task.findOne(
        {
            where: {
                taskId: req.params.taskId,
                deletedAt: null},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
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
        });
    if (task){
        if (task.assigneeId === req.body.user.userId) {
            const sumTime = +task.sumHoursFact + +req.body.sumHoursFact;
            await task.update({ sumHoursFact: sumTime });
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

/**
 * Для загрузки файлов, в postman нужно выбрать form-data
 * тип поля выбрать file
 * название поля "files"
 */
router.post('/:taskId/files', async (req, res) => {
    try{
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let files = req.files.files;
            const { taskId } = req.params
            
            if(Array.isArray(files)){
                files.forEach(file => {
                    file.mv('./uploads/' + `${taskId}_` + file.name)
                })
            }else{
                files.mv('./uploads/' + `${taskId}_` + files.name);
            }

            res.send({
                status: true,
                message: 'File is uploaded',
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
})

export default router