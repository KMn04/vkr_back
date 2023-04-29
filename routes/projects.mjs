import express from "express";
import { Projects } from "../models/Projects.mjs";
import { Project_relations } from "../models/Project_relations.mjs";
import Sequelize from "sequelize";

const router = express.Router();

router.get("/", async (req, res) => {
    const allUserProjects = await Project_relations.findAll({
        where: {
            [Sequelize.Op.and]: [
                {user: req.user_id },
                {deleted_on: null}
            ]
        }
    });
    res.send(allUserProjects).status(200);
});

router.post("/create", async (req, res) => {
    const newProject = await Projects.create({
        name: req.body.name,
        description: req.body.description,
        owner: req.body.user.user_id,
        status: 1
    });
    const newProjRel = await Project_relations.create({
        project: newProject.project_id,
        admin: newProject.owner,
        user: newProject.owner,
        role: "owner"
    });
    res.send().status(200);
});

export default router