const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Set this to your Supabase database name
  process.env.DB_USER, // Set this to your Supabase user
  process.env.DB_PASSWORD, // Set this to your Supabase password
  {
    host: 'elulxxtneaxxezpgyibs.supabase.co', // Supabase host
    dialect: 'postgres',
    logging: false, // désactive les logs SQL
    port: 5432, // Supabase uses port 5432 for PostgreSQL
    ssl: true, // Enable SSL for Supabase
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

module.exports = sequelize;
