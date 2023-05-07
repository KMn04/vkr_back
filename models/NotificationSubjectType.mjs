import sequelize from "../db/postgre_connection.mjs";
import Sequelize from "sequelize";

export const NotificationSubjectType = sequelize.define('notification_subject_type', {
    notificationSubjectTypeCode: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})