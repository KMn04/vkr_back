import Sequelize from "sequelize";
import sequelize from "../db/postgre_connection.mjs";

export const Users = sequelize.define('user', {
    userId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    login: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    secondName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    thirdName: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true
    }
  });