import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";
import { Project_relations } from "./Project_relations.mjs";

export const Projects = sequelize.define('project', {
    projectId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    owner: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    dateStart: {
        type: Sequelize.DATE,
        allowNull: true
    },
    dateFinish: {
        type: Sequelize.DATE,
        allowNull: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    budget: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    currency: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    sumHoursPlan: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    sumHoursFact: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    wiki: {
        type: Sequelize.STRING,
        allowNull: true
    },
    deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
    }
})

Projects.hasMany(Project_relations, {foreignKey: "project"});