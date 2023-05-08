import express from "express";
import { Projects } from "../models/Projects.mjs";
import { ProjectTeamMembers } from "../models/ProjectTeamMembers.mjs";
import tasks from './tasks.mjs';
import {Op} from 'sequelize'

const router = express.Router();


// получить все проекты пользователя
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
                exclude: ['wiki', 'updatedAt', 'createdAt']
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
    const tempProjectMember = await ProjectTeamMembers.findOne({
        where: {
            projectId: req.params.projectId,
            userId: req.body.user.userId
        }
    }) 
    if (tempProjectMember){
        const project = await Projects.findByPk(
            req.params.projectId,
            {
                attributes: {
                    exclude: ['createdAt', 'deletedAt', 'updatedAt', 'wiki']
                }
            }
        );
        res.send(project).status(200);
    } else{
        res.status(400);
        res.send('У вас нет доступа к этому проекту');
    }
});

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
    const tempProject = await Projects.findByPk(req.params.projectId);
    const {ownerId, user, ...newBody} = req.body;
    await tempProject.update(newBody);
    res.send().status(200);
});

// удаление проекта
router.delete("/:projectId", async(req, res) => {
    const tempProject = await Projects.findByPk(req.params.projectId);
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
});

router.use('/tasks', tasks);

export default router