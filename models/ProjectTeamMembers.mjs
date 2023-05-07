import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";
import {Projects} from "./Projects.mjs";
import {Users} from "./Users.mjs";
import {Roles} from "./Roles.mjs";

export const ProjectTeamMembers = sequelize.define('project_team_member', {
    projectTeamMemberId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    startedAt: {
        type: Sequelize.DATE,
        allowNull: true
    },
    finishedAt: {
        type: Sequelize.DATE,
        allowNull: true
    }
});

ProjectTeamMembers.belongsTo(Projects, {foreignKey: 'projectId'});
ProjectTeamMembers.belongsTo(Users, {foreignKey: 'adminId'});
ProjectTeamMembers.belongsTo(Users, {foreignKey: 'userId'});
ProjectTeamMembers.belongsTo(Roles, {foreignKey: 'roleCode'});