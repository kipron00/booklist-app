// scripts/update-admin.cjs
const models = require('../models/index.cjs')
const bcrypt = require('bcryptjs')

async function ensureOneAdmin() {
  try {
    // Connect to DB
    await models.sequelize.authenticate()
    console.log('✅ Connected to database')

    const { User } = models

    const targetAdmin = {
      name: 'Admin',
      payrollNumber: 'ADMIN001',
      password: 'admin123', // Change in production!
      role: 'admin'
    }

    // 🔍 Find all admins
    const allAdmins = await User.findAll({
      where: { role: 'admin' }
    })

    console.log(`🔍 Found ${allAdmins.length} admin(s)`)

    // 🧹 Delete all admins except the one with ADMIN001
    for (const admin of allAdmins) {
      if (admin.payrollNumber !== targetAdmin.payrollNumber) {
        console.log(`🗑️ Deleting admin: ${admin.name} (${admin.payrollNumber})`)
        await admin.destroy()
      }
    }

    // ✅ Check if target admin exists
    let mainAdmin = await User.findOne({
      where: { payrollNumber: targetAdmin.payrollNumber }
    })

    if (!mainAdmin) {
      // 🔐 Hash password
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(targetAdmin.password, saltRounds)

      // 🆕 Create the one true admin
      mainAdmin = await User.create({
        name: targetAdmin.name,
        payrollNumber: targetAdmin.payrollNumber,
        password: passwordHash,
        role: targetAdmin.role
      })

      console.log('✅ One true admin created:', mainAdmin.payrollNumber)
    } else {
      // 🔁 Ensure correct name and role
      mainAdmin.name = targetAdmin.name
      mainAdmin.role = targetAdmin.role
      await mainAdmin.save()
      console.log('✅ One true admin ensured:', mainAdmin.payrollNumber)
    }

    // 📋 Final check
    const remainingAdmins = await User.findAll({ where: { role: 'admin' } })
    console.log('🎯 Final admin(s):')
    remainingAdmins.forEach(a => {
      console.log(`   - ${a.name} (${a.payrollNumber})`)
    })

  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    await models.sequelize.close()
  }
}

ensureOneAdmin()