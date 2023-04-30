import express from "express";
import { Projects } from "../models/Projects.mjs";
import { Project_relations } from "../models/Project_relations.mjs";
import Sequelize from "sequelize";

const router = express.Router();

router.get("/", async (req, res) => {
    const allUserProjects = await Project_relations.findAll({
        where: {
            [Sequelize.Op.and]: [
                {user: req.body.user.user_id },
                {deleted_on: null}
            ]
        },
        include: {
            model: Projects,
            required: true
        }
    });
    res.send(allUserProjects).status(200);
});

router.get("/project", async (req, res) => {
    const project = await Projects.findByPk(req.body.project_id);
    if ((await Project_relations.findByPk(project.project_id)).user === req.body.user.user_id){
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
    await (await Projects.findByPk(req.body.project_id)).update({
        name: req.body.name,
        date_start: req.body.date_start,
        date_finish: req.body.date_finish,
        description: req.body.description,
        status: req.body.status,
        budget: req.body.budget,
        currency: req.body.currency,
        sum_hours_plan: req.body.sum_hours_plan,
        sum_hours_fact: req.body.sum_hours_fact
    });
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