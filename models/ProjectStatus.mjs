import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const ProjectStatus = sequelize.define('projectStatus', {
    projectStatusCode: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})