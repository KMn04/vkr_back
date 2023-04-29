import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const Currency = sequelize.define('currency', {
    cur_code: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})