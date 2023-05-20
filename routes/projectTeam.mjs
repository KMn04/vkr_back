import express from "express";
import { ProjectTeamMember } from "../models/ProjectTeamMember.mjs";
import {Role} from "../models/Role.mjs";
import {Project} from "../models/Project.mjs";
import {User} from "../models/User.mjs";
import {Op} from 'sequelize'

const router = express.Router();


// получить список участников команды на проекте
router.get("/:projectId/team", async (req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole) {
        const allProjectTeamMembers = await ProjectTeamMember.findAll({
            where: {
                projectId: req.params.projectId,
                finishedAt: null,
            },
            include: [
                {
                    model: Project,
                    attributes: ['name']
                },
                {
                    model: User,
                    attributes: ['secondName', 'firstName', 'thirdName']
                },
                {
                    model: Role,
                    attributes: ['name', 'description']
                }
            ]
        });
        const preparedResult = allProjectTeamMembers.map((teamModel) => {
            return {
                projectName: teamModel.project.name,
                projectId: teamModel.dataValues.projectId,
                projectTeamMemberId: teamModel.dataValues.projectTeamMemberId,
                userId: teamModel.dataValues.userId,
                // сделать join массива
                projectMember: teamModel.user.secondName + " " + teamModel.user.firstName + " " + (teamModel.user.thirdName ?? ''),
                roleCode: teamModel.dataValues.roleCode,
                roleName: teamModel.role.name,
                roleDescription: teamModel.role.description,
            }
        })
        res.send(preparedResult).status(200);
    }
    else {
        const err = new Error("У вас нет доступа для просмотра команды этого проекта");
        res.status(400);
        res.send(err).status(400);
    }
});


// добавить участника на проект
router.post("/:projectId/team", async (req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole.roleCode < 3) {
        // на проекте только 1 роль - проверка что ещё нет такого
        const whereRequest = {};
        const login = req.body.login;
        if(login){
            whereRequest.login = login;
        }
        const email = req.body.email;
        if(email){
            whereRequest.email = email;
        }
        const memberUser = await User.findOne({
            where: whereRequest
        });
        if(memberUser) {
            const newMember = await ProjectTeamMember.create({
                updatedAt: Date.now(),
                projectId: req.params.projectId,
                adminId: req.body.user.userId,
                userId: memberUser.userId,
                roleCode: req.body.roleCode,
            });
            res.send().status(200);
        }
        else {
            const err = new Error("Вы пытаетесь добавить несуществующего пользователя");
            res.status(400);
            res.send(err).status(400);
        }
    }
    else {
        const err = new Error("У вас нет прав доступа на добавление участников команды");
        res.status(400);
        res.send(err).status(400);
    }
});

// изменить роль участника на проекте
router.put("/:projectId/team/:projectTeamMemberId", async(req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole.roleCode < 3) {
        // добавить проверку, что пытаются поменять не роль владельца
        const member = await ProjectTeamMember.findOne({
            where:{
                projectTeamMemberId: req.params.projectTeamMemberId,
                finishedAt: null
            }
        });
        if (member) {
            await member.update({
                updatedAt: Date.now(),
                roleCode: req.body.roleCode,
            });
        }
        else {
            const err = new Error("Такого участника на проекте нет");
            res.status(400);
            res.send(err).status(400);
        }
        res.send(member).status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на изменение ролей участников команды");
        res.status(400);
        res.send(err).status(400);
    }
});

// удалить участника с проекта
router.delete("/:projectId/team/:projectTeamMemberId", async(req, res) => {
    const actualRole = await ProjectTeamMember.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId,
            finishedAt: null
        }
    });
    if (actualRole.roleCode < 3) {
        // добавить проверку, что пытаются удалить не владельца, и что админа удаляет владелец
        const deletedMember = await ProjectTeamMember.findOne({
            where:{
                projectTeamMemberId: req.params.projectTeamMemberId,
                finishedAt: null
            }
        });
        if (deletedMember) {
            await deletedMember.update({
                updatedAt: Date.now(),
                finishedAt: Date.now(),
            });
        }
        else {
            const err = new Error("Такого участника на проекте нет");
            res.status(400);
            res.send(err).status(400);
        }
        res.send().status(200);
    }
    else {
        const err = new Error("У вас нет прав доступа на удаление участников с этого проекта");
        res.status(400);
        res.send(err).status(400);
    }
});

export default router