import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const TaskPriority = sequelize.define('task_priority', {
    taskPriorityCode: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})