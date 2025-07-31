// config/database.js
require('dotenv').config()

module.exports = {
  development: {
    use_env_variable: 'postgresql://booklistuser:Ka4IQlmXXQTSPq2Q8e8LuD7sKg02KooT@dpg-d25enmbuibrs73ai0bo0-a.oregon-postgres.render.com/booklist_db_3guq',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
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
