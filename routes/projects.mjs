import express from "express";
import { Projects } from "../models/Projects.mjs";
import { ProjectTeamMembers } from "../models/ProjectTeamMembers.mjs";
import projectTasks from './projectTasks.mjs';
import {Op} from 'sequelize'
import { Roles } from "../models/Roles.mjs";
import { Users } from "../models/Users.mjs";

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
    const allUserProjects = await ProjectTeamMembers.findAll({
        where: whereRequest,
        include: [{
            model: Projects,
            attributes: {
                exclude: ['updatedAt', 'createdAt']
            }
        }],
        required: true
    });
    const preparedResult = allUserProjects.map((projectModel) => {
        return {
            ...projectModel.project.dataValues,
            roleCode: projectModel.roleCode,
        }
    })
    res.send(preparedResult).status(200);
});

// получить проект
router.get("/:projectId", async (req, res) => {
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole) {
        const tempProject = await Projects.findByPk(
            req.params.projectId,
            {
                where: {deletedAt: null},
                attributes: {
                    exclude: ['createdAt', 'deletedAt', 'updatedAt']
                }
        })
        const preparedResult = {
                ...tempProject.dataValues,
                roleCode: actualRole.roleCode,
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
    const newProject = await Projects.create({
        name: req.body.name,
        description: req.body.description,
        ownerId: req.body.user.userId,
        statusCode: 1 // новый/не начато
    });
    await ProjectTeamMembers.create({
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
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole.roleCode < 3) {
        const tempProject = await Projects.findByPk(
            req.params.projectId,
            {
                where: {deletedAt: null},
                attributes: {
                    exclude: ['createdAt', 'deletedAt', 'updatedAt']
                }
            })
        const {ownerId, user, ...newBody} = req.body;
        await tempProject.update(newBody);
        const preparedResult = {
                ...tempProject.dataValues,
                roleCode: actualRole.roleCode
        };
        res.send(preparedResult).status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на изменение этого проекта");
        res.status(400);
        res.send(err).status(400);
    }
});

// Получение команды проекта
router.get("/:projectId/members", async (req, res) => {
    const tempMembers = await ProjectTeamMembers.findAll({
        where: {
            projectId: req.params.projectId,
            finishedAt: null,
        },
        include: [{
            model: Users,
            attributes: ["firstName", "secondName", "login", "userId", "email"]
        }, Roles],
    })
    const result = tempMembers.map((member) => {
        return {
            userId: member.dataValues.userId,
            user: member.dataValues.user.dataValues,
            roleCode: member.dataValues.roleCode,
            roleName: member.dataValues.role.dataValues.name
        }
    })
    res.send(result)
})

// удаление проекта
router.delete("/:projectId", async(req, res) => {
    const actualRole = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole.roleCode === 1) {
        const tempProject = await Projects.findByPk(
            req.params.projectId,
            {
                where: {deletedAt: null},
                attributes: {
                    exclude: ['createdAt', 'deletedAt', 'updatedAt']
                }
            })
        await tempProject.update({ deletedAt: Date.now() });
        const projectTeam = await ProjectTeamMembers.findAll({
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

export default router