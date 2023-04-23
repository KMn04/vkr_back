import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const Projects = sequelize.define('project', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date_start: {
        type: Sequelize.DATE,
        allowNull: false
    },
    date_finish: {
        type: Sequelize.DATE,
        allowNull: true
    },
    deleted_on: {
        type: Sequelize.DATE,
        allowNull: true
    }
})