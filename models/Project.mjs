import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";
import {User} from "./User.mjs";
import {ProjectStatus} from "./ProjectStatus.mjs";
import {Currency} from "./Currency.mjs";


export const Project = sequelize.define('project', {
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
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    dateStart: {
        type: Sequelize.DATE,
        allowNull: true
    },
    dateFinish: {
        type: Sequelize.DATE,
        allowNull: true
    },
    budget: {
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
    deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
    }
});

Project.belongsTo(User, {foreignKey: "ownerId"});
Project.belongsTo(ProjectStatus, {foreignKey: "statusCode"});
Project.belongsTo(Currency, {foreignKey: "currencyCode"});