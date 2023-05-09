import sequelize from "../db/postgre_connection.mjs";
import Sequelize from "sequelize";

export const NotificationType = sequelize.define('notificationType', {
    notificationTypeCode: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})