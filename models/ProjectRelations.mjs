import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";


export const projectRelations = sequelize.define('project_relations', {
    projectRelationId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false
    },
   deletedAt: {
       type: Sequelize.DATE,
       allowNull: true
   }
});

