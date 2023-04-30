import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const TaskStatus = sequelize.define('task_status', {
    taskStatusCode: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})