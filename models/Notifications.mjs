import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";
import {Users} from "./Users.mjs";
import {NotificationType} from "./NotificationType.mjs";
import {NotificationSubjectType} from "./NotificationSubjectType.mjs";
import {NotificationFrequency} from "./NotificationFrequency.mjs";

// ощущение что сущность надо перенести в монго, тк в зависимости от самого уведа у всех будут немного разные поля
 // ну или упростить
export const Notifications = sequelize.define('notification', {
    notificationId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    // ид сущности, по которой будут приходить уведомления:
    // проект, роли на проекте, задачи, комменты к задачам, бз, общие
    subjectId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    //то что будет в названии письма
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // текст
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // с какого по какое будут приходить уведомления
    // по умолчанию со следующего дня бесконечно
    dateStart: {
        type: Sequelize.DATE,
        allowNull: true
    },
    dateFinish: {
        type: Sequelize.DATE,
        allowNull: true
    },
    // по-хорошему это должен быть день недели + время (для общих уведомлений)
    sendingTime: {
        type: Sequelize.DATE,
        allowNull: true
    }
});

Notifications.belongsTo(Users, {foreignKey: "addressId"}); // ид адресата, хотя по факту тут нужен емейл
Notifications.belongsTo(NotificationType, {foreignKey: "type"}); // тип распространения: все/только мои (проекты, задачи)
Notifications.belongsTo(NotificationSubjectType, {foreignKey: "subjectType"}); // тип сущности
Notifications.belongsTo(NotificationFrequency, {foreignKey: "frequency"}); // как часто присылать (только для общих)