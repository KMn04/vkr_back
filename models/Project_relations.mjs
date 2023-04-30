import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";
import { Projects } from "./Projects.mjs";
import { Users } from "./Users.mjs";


export const Project_relations = sequelize.define('project_relations', {
    projRel_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    project: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    admin: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    user: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false
    },
   deleted_on: {
       type: Sequelize.DATE,
       allowNull: true
   }
});

Project_relations.hasOne(Projects, {
    foreignKey: 'project'
});
Project_relations.hasOne(Users, {
    foreignKey: 'admin'
});
Project_relations.hasOne(Users, {
    foreignKey: 'user'
});
