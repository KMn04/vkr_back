import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const Tasks = sequelize.define('task', {
    taskId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    /*type: {
        type: Sequelize.INTEGER,
        allowNull: false
    },*/
    /*project: {
        type: Sequelize.INTEGER,
        allowNull: false
    },*/
    /*sprint: {
        type: Sequelize.INTEGER,
        allowNull: false
    },*/
    dateStartPlan: {
        type: Sequelize.DATE,
        allowNull: false
    },
    dateStartFact: {
        type: Sequelize.DATE,
        allowNull: false
    },
    dateFinishPlan: {
        type: Sequelize.DATE,
        allowNull: false
    },
    dateFinishFact: {
        type: Sequelize.DATE,
        allowNull: false
    },
    /*assignee: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    supervisor: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    author: {
        type: Sequelize.INTEGER,
        allowNull: false
    },*/
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    /*priority: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false
    },*/
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
})