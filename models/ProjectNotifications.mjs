import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";
import {Users} from "./Users.mjs";
import {Projects} from "./Projects.mjs";

export const ProjectNotifications = sequelize.define('project_notification', {
    projectNotificationId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    // как называется тип уведомления - для проектов, для задач, для комментов на задачах, тд
    typeName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // тип коммента - из списка что в телеге
    type: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // с какого по какое будут приходить уведомляшки
    dateStart: {
        type: Sequelize.DATE,
        allowNull: true
    },
    dateFinish: {
        type: Sequelize.DATE,
        allowNull: true
    },
    // текст увед
    text: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

ProjectNotifications.belongsTo(Users, {foreignKey: "addressId"}); // ид адресата, хотя по факту тут нужен емейл
ProjectNotifications.belongsTo(Projects, {foreignKey: "projectId"}); // ид проекта, по которому приходят уведы;
                                                                            // альтернатива - ид задачи