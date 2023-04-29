import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const Tasks = sequelize.define('task', {
    task_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    project: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    sprint: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    date_start_plan: {
        type: Sequelize.DATE,
        allowNull: false
    },
    date_start_fact: {
        type: Sequelize.DATE,
        allowNull: false
    },
    date_finish_plan: {
        type: Sequelize.DATE,
        allowNull: false
    },
    date_finish_fact: {
        type: Sequelize.DATE,
        allowNull: false
    },
    assignee: {
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
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    priority: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    sum_hours_plan: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    sum_hours_fact: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    deleted_on: {
        type: Sequelize.DATE,
        allowNull: true
    }
})