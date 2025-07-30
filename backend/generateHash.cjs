// generateHash.cjs
const bcrypt = require('bcryptjs')

const password = 'admin123'
const saltRounds = 10

bcrypt.hash(password, saltRounds).then(hash => {
  console.log('Hashed password:', hash)
})