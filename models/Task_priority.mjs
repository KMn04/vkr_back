import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const Task_priority = sequelize.define('task_priority', {
    tPrior_code: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})