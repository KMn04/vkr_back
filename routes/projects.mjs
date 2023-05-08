import express from "express";
import { Projects } from "../models/Projects.mjs";
import { ProjectTeamMembers } from "../models/ProjectTeamMembers.mjs";
import tasks from './tasks.mjs';

const router = express.Router();


// получить все проекты пользователя
router.get("/", async (req, res) => {
    const allUserProjects = await ProjectTeamMembers.findAll({
        where: {
            userId: req.body.user.userId,
            finishedAt: null,
            roleCode: req.query.roleCode,
        },
        include: Projects,
        required: true
    });
    res.send(allUserProjects).status(200);
});

// получить только проекты самого пользователя
router.get("/:userId", async (req, res) => {
    const onlyUserProjects = await ProjectTeamMembers.findAll({
        where: {
            userId: req.params.userId,
            roleCode: 1, // owner
            finishedAt: null,
        },
        include: Projects,
        required: true
    });
    res.send(onlyUserProjects).status(200);
});

// получить проект
router.get("/:projectId", async (req, res) => {
    if ((await ProjectTeamMembers.findByPk(req.params.projectId)).user === req.body.user.userId){
        const project = await Projects.findByPk(req.params.projectId);
        res.send(project).status(200);
    } else{
        alert ('У вас нет доступа к этому проекту');
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