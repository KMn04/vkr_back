import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const Task_status = sequelize.define('task_status', {
    tSt_code: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})