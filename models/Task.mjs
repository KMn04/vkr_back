import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";
import {TaskType} from "./TaskType.mjs";
import {Projects} from "./Projects.mjs";
import {Sprints} from "./Sprints.mjs";
import {Users} from "./Users.mjs";
import {TaskStatus} from "./TaskStatus.mjs";
import {TaskPriority} from "./TaskPriority.mjs";

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
    description: {
        type: Sequelize.STRING,
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

Tasks.belongsTo(TaskType, {foreignKey: 'typeCode'});
Tasks.belongsTo(Projects, {foreignKey: 'projectId'});
Tasks.belongsTo(Sprints, {foreignKey: 'sprintId'});
Tasks.belongsTo(Users, {foreignKey: 'assigneeId'});
Tasks.belongsTo(Users, {foreignKey: 'supervisorId'});
Tasks.belongsTo(Users, {foreignKey: 'authorId'});
Tasks.belongsTo(TaskStatus, {foreignKey: 'statusCode'});
Tasks.belongsTo(TaskPriority, {foreignKey: 'priorityCode'});
