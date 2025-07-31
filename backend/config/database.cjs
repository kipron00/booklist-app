// config/database.js
module.exports = {
  development: {
    database: process.env.DB_NAME || 'schooltrack_dev',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'postgresql://booklistuser:Ka4IQlmXXQTSPq2Q8e8LuD7sKg02KooT@dpg-d25enmbuibrs73ai0bo0-a.oregon-postgres.render.com/booklist_db_3guq',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}
