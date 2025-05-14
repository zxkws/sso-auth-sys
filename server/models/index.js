import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import User from './user.js';
import UserAuthProvider from './userAuthProvider.js';
import RefreshToken from './refreshToken.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

const db = {
  sequelize,
  Sequelize,
  User: User(sequelize, Sequelize),
  UserAuthProvider: UserAuthProvider(sequelize, Sequelize),
  RefreshToken: RefreshToken(sequelize, Sequelize),
};

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;