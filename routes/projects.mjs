import express from "express";
import { Projects } from "../models/Projects.mjs";
import { ProjectRelations } from "../models/ProjectRelations.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const allUserProjects = await ProjectRelations.findAll({
        where: {
            user: req.body.user.userId,
            deleted_on: null,
        },
        include: { model: Projects }
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
        owner: req.body.user.userId,
        status: 1
    });
    await ProjectRelations.create({
        project: newProject.projectId,
        admin: newProject.owner,
        user: newProject.owner,
        role: "owner"
    });
    res.send().status(200);
});

router.put("/:projectId", async(req, res) => {
    const tempProject = await Projects.findByPk(req.body.projectId);
    const {owner, user, ...newBody} = req.body;
    await tempProject.update(newBody);
    res.send().status(200);
});

router.delete("/:projectId", async(req, res) => {
    await (await Projects.findByPk(req.body.projectId)).update({
        deletedAt: req.body.deletedAt
    }); //заменить метод на делит и разделить эвейты
    res.send().status(200);
    //убрать отображение проекта(?)
});
// круд + ид
export default router