import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";
import {Project} from "./Project.mjs";
import {User} from "./User.mjs";
import {Role} from "./Role.mjs";

export const ProjectTeamMember = sequelize.define('projectTeamMember', {
    projectTeamMemberId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
    },
    finishedAt: {
        type: Sequelize.DATE,
        allowNull: true
    }
});

ProjectTeamMember.belongsTo(Project, {foreignKey: 'projectId'});
ProjectTeamMember.belongsTo(User, {foreignKey: 'adminId'});
ProjectTeamMember.belongsTo(User, {foreignKey: 'userId'});
ProjectTeamMember.belongsTo(Role, {foreignKey: 'roleCode'});