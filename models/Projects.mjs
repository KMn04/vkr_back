import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";
import { Project_relations } from "./Project_relations.mjs";

export const Projects = sequelize.define('project', {
    project_id: {
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
    date_start: {
        type: Sequelize.DATE,
        allowNull: true
    },
    date_finish: {
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
    sum_hours_plan: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    sum_hours_fact: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    wiki: {
        type: Sequelize.STRING,
        allowNull: true
    },
    deleted_on: {
        type: Sequelize.DATE,
        allowNull: true
    }
})

Projects.hasMany(Project_relations, {foreignKey: "project"});