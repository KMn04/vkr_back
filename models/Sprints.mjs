import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const Sprints = sequelize.define('sprint', {
    sprint_id: {
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
    date_start: {
        type: Sequelize.DATE,
        allowNull: false
    },
    date_finish: {
        type: Sequelize.DATE,
        allowNull: false
    }
})