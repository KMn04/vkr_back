import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const Role = sequelize.define('role', {
    roleCode: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
})