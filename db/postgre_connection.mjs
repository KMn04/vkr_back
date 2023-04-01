import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5444/vkr')

export default sequelize