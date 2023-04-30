import express from "express";
import { Projects } from "../models/Projects.mjs";
import { Project_relations } from "../models/Project_relations.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const allUserProjects = await Project_relations.findAll({
        where: {
            user: req.body.user.user_id,
            deleted_on: null,
        },
        include: {
            model: Projects,
            required: true
        }
    });
    res.send(allUserProjects).status(200);
});

router.get("/:project_id", async (req, res) => {
    if ((await Project_relations.findByPk(req.params.project_id)).user === req.body.user.user_id){    
        const project = await Projects.findByPk(req.params.project_id);
        res.send(project).status(200);
    } else{
        alert ('Не хватает прав');
    }
});

router.post("/create", async (req, res) => {
    const newProject = await Projects.create({
        name: req.body.name,
        description: req.body.description,
        owner: req.body.user.user_id,
        status: 1
    });
    await Project_relations.create({
        project: newProject.project_id,
        admin: newProject.owner,
        user: newProject.owner,
        role: "owner"
    });
    res.send().status(200);
});

router.put("/edit", async(req, res) => {
    const tempProject = await Projects.findByPk(req.body.project_id); 
    const {owner, user, ...newBody} = req.body;
    await tempProject.update(newBody);
    res.send().status(200);
});

router.put("/delete", async(req, res) => {
    await (await Projects.findByPk(req.body.project_id)).update({
        deleted_on: req.body.deleted_on
    });
    res.send().status(200);
    //убрать отображение проекта(?)
});

export default router