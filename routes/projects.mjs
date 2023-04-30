import express from "express";
import { Projects } from "../models/Projects.mjs";
import { ProjectRelations } from "../models/ProjectRelations.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const allUserProjects = await ProjectRelations.findAll({
        where: {
            user: req.body.user.userId,
            deletedAt: null,
        },
        include: Projects,
        required: true
    });
    res.send(allUserProjects).status(200);
});

router.get("/:projectId", async (req, res) => {
    if ((await ProjectRelations.findByPk(req.params.projectId)).user === req.body.user.userId){
        const project = await Projects.findByPk(req.params.projectId);
        res.send(project).status(200);
    } else{
        alert ('Не хватает прав');
    }
});

router.post("/", async (req, res) => {
    const newProject = await Projects.create({
        name: req.body.name,
        description: req.body.description,
    });
    await ProjectRelations.create({
        projectId: newProject.projectId,
        admin: req.body.user.userId,
        user: req.body.user.userId,
        role: "owner"
    });
    res.send().status(200);
});

router.put("/:projectId", async(req, res) => {
    const tempProject = await Projects.findByPk(req.params.projectId);
    const {owner, user, ...newBody} = req.body;
    await tempProject.update(newBody);
    res.send().status(200);
});

router.delete("/:projectId", async(req, res) => {
    const tempProject = await Projects.findByPk(req.params.projectId);
    await tempProject.update({ deletedAt: Date.now() });
    res.send().status(200);
});

export default router