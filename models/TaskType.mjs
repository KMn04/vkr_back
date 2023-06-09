import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const TaskType = sequelize.define('taskType', {
    taskTypeCode: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})