import sequelize from "../db/postgre_connection.mjs";
import Sequelize from "sequelize";

// только для общих уведомлений
export const NotificationFrequency = sequelize.define('notification_frequency', {
    notificationFrequencyCode: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    // каждый день, раз в неделю, раз в месяц, раз в 3 месяца, раз в полгода, раз в год
    value: {
        type: Sequelize.STRING,
        allowNull: false
    }
})