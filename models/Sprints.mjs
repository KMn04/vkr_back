import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const Sprints = sequelize.define('sprint', {
    sprintId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    dateStart: {
        type: Sequelize.DATE,
        allowNull: false
    },
    dateFinish: {
        type: Sequelize.DATE,
        allowNull: false
    }
})