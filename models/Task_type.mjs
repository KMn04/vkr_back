import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const Task_type = sequelize.define('task_type', {
    tTyp_code: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})