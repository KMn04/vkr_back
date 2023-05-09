import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";
import {TaskType} from "./TaskType.mjs";
import {Project} from "./Project.mjs";
import {Sprint} from "./Sprint.mjs";
import {User} from "./User.mjs";
import {TaskStatus} from "./TaskStatus.mjs";
import {TaskPriority} from "./TaskPriority.mjs";

export const Task = sequelize.define('task', {
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
        allowNull: true
    },
    dateStartFact: {
        type: Sequelize.DATE,
        allowNull: true
    },
    dateFinishPlan: {
        type: Sequelize.DATE,
        allowNull: true
    },
    dateFinishFact: {
        type: Sequelize.DATE,
        allowNull: true
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

Task.belongsTo(TaskType, {foreignKey: 'typeCode'});
Task.belongsTo(Project, {foreignKey: 'projectId'});
Task.belongsTo(Sprint, {foreignKey: 'sprintId'});
Task.belongsTo(User, {foreignKey: 'assigneeId'});
Task.belongsTo(User, {foreignKey: 'supervisorId'});
Task.belongsTo(User, {foreignKey: 'authorId'});
Task.belongsTo(TaskStatus, {foreignKey: 'statusCode'});
Task.belongsTo(TaskPriority, {foreignKey: 'priorityCode'});


