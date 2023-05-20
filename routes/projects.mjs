import express from "express";
import { Project } from "../models/Project.mjs";
import { ProjectTeamMember } from "../models/ProjectTeamMember.mjs";
import { Role } from "../models/Role.mjs";
import { User } from "../models/User.mjs";
import { ProjectStatus}  from "../models/ProjectStatus.mjs";
import { Currency } from "../models/Currency.mjs";
import {Op} from 'sequelize'
import projectTasks from './projectTasks.mjs';
import projectTeam from './projectTeam.mjs';
import wikiRouter from './wiki.mjs'

const router = express.Router();


// получить все проекты пользователя с учетом роли
router.get("/", async (req, res) => {
    const whereRequest = {
        userId: req.body.user.userId,
        finishedAt: null,
    };
    const roleCode = req.query.roleCode;
    if(roleCode){
        whereRequest.roleCode = roleCode;
    }
    const excludeRoleCode = req.query.excludeRoleCode;
    if(excludeRoleCode){
        whereRequest[Op.not] = {
            roleCode: excludeRoleCode
        }
    }
    const allUserProjects = await ProjectTeamMember.findAll({
        where: whereRequest,
        include: [
            {
                model: Project,
                attributes:['name', 'description']
            },
            {
                model: Role,
                attributes: ['name']
            }
        ]
    });
    const preparedResult = allUserProjects.map((projectModel) => {
        return {
            projectId: projectModel.dataValues.projectId,
            name: projectModel.project.name,
            description: projectModel.project.description,
            role: projectModel.role.name
        }
    })
    res.send(preparedResult).status(200);
});

// получить проект
router.get("/:projectId", async (req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        },
        include: [
            {
                model: Role,
                attributes: ['name']
            }
        ]
    });
    if (actualRole) {
        const tempProject = await Project.findOne(
            {
                where: {
                    projectId: req.params.projectId,
                    deletedAt: null},
                include: [
                    {
                        model: User,
                        attributes:['firstName', 'secondName']
                    },
                    {
                        model: ProjectStatus,
                        attributes: ['name']
                    },
                    {
                        model: Currency,
                        attributes: ['name']
                    }
                ]
        })
        const preparedResult = {
            projectId: tempProject.dataValues.projectId,
            name: tempProject.dataValues.name,
            description: tempProject.dataValues.description,
            dateStart: tempProject.dataValues.dateStart,
            dateFinish: tempProject.dataValues.dateFinish,
            budget: tempProject.dataValues.budget,
            currencyCode: tempProject.dataValues.currencyCode,
            currency: tempProject.dataValues.currencyCode ? tempProject.currency.name : null,
            sumHoursPlan: tempProject.dataValues.sumHoursPlan,
            sumHoursFact: tempProject.dataValues.sumHoursFact,
            ownerId: tempProject.dataValues.ownerId,
            ownerName: tempProject.user.firstName,
            ownerSecondName: tempProject.user.secondName,
            statusCode: tempProject.dataValues.statusCode,
            status: tempProject.projectStatus?.name,
            roleCode: actualRole.roleCode,
            role: actualRole.role.name
        }
        res.send(preparedResult).status(200);
    }
    else {
        const err = new Error("У вас нет доступа к этому проекту");
        res.status(400);
        res.send(err).status(400);
    }}
);

// создать проект
router.post("/", async (req, res) => {
    const newProject = await Project.create({
        name: req.body.name,
        description: req.body.description,
        ownerId: req.body.user.userId,
        sumHoursFact: 0,
        statusCode: 1
    });
    await ProjectTeamMember.create({
        startedAt: Date.now(),
        projectId: newProject.projectId,
        adminId: req.body.user.userId,
        userId: req.body.user.userId,
        roleCode: 1 // owner
    });
    res.send().status(200);
});

// изменение проекта
router.put("/:projectId", async(req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        },
        include: [
            {
                model: Role,
                attributes: ['name']
            }
        ]
    });
    if (actualRole.roleCode < 3) {
        const tempProject = await Project.findOne(
            {
                where: {
                    projectId: req.params.projectId,
                    deletedAt: null},
                include: [
                    {
                        model: User,
                        attributes:['firstName', 'secondName']
                    },
                    {
                        model: ProjectStatus,
                        attributes: ['name']
                    },
                    {
                        model: Currency,
                        attributes: ['name']
                    }
                ]
            })
        const {ownerId, user, ...newBody} = req.body;
        await tempProject.update(newBody);
        const preparedResult = {
            projectId: tempProject.dataValues.projectId,
            name: tempProject.dataValues.name,
            description: tempProject.dataValues.description,
            dateStart: tempProject.dataValues.dateStart,
            dateFinish: tempProject.dataValues.dateFinish,
            budget: tempProject.dataValues.budget,
            currencyCode: tempProject.dataValues.currencyCode,
            currency: tempProject.dataValues.currencyCode ? tempProject.currency.name : null,
            sumHoursPlan: tempProject.dataValues.sumHoursPlan,
            sumHoursFact: tempProject.dataValues.sumHoursFact,
            ownerId: tempProject.dataValues.ownerId,
            ownerName: tempProject.user.firstName,
            ownerSecondName: tempProject.user.secondName,
            statusCode: tempProject.dataValues.statusCode,
            status: tempProject.projectStatus.name,
            roleCode: actualRole.roleCode,
            role: actualRole.role.name
        };
        res.send(preparedResult).status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на изменение этого проекта");
        res.status(400);
        res.send(err).status(400);
    }
});

// удаление проекта
router.delete("/:projectId", async(req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole.roleCode === 1) {
        const tempProject = await Project.findOne(
            {
                where: {
                    projectId: req.params.projectId,
                    deletedAt: null},
                attributes: {
                    exclude: ['createdAt', 'deletedAt', 'updatedAt']
                }
            })
        await tempProject.update({ deletedAt: Date.now() });
        const projectTeam = await ProjectTeamMember.findAll({
            where: {
                projectId: req.params.projectId,
            }
        });
        for (const member of projectTeam) {
            await member.update({ finishedAt: Date.now() })
        }
        res.send().status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на удаление этого проекта");
        res.status(400);
        res.send(err).status(400);
    }
});

router.use('', projectTasks);
router.use('', projectTeam);
router.use('', wikiRouter);

export default router