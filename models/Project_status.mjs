import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const Project_status = sequelize.define('project_status', {
    prSt_code: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})