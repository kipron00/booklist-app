// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes.cjs');
const visitRoutes = require('./routes/visitRoutes.cjs');
const adminRoutes = require('./routes/adminRoutes.cjs');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('✅ TBC Booklist Backend is running');
});

// Start server
async function startServer() {
  try {
    const models = require('./models/index.cjs')
    await models.sequelize.authenticate()
    console.log('✅ Database connected')
    await models.sequelize.sync({ alter: true })
    console.log('✅ Database synced')

    // ✅ Create default admin
    const { User } = models
    const bcrypt = require('bcryptjs')

    const adminData = {
      name: 'Admin',
      payrollNumber: 'ADMIN001',
      password: 'admin123', // Change this in production!
      role: 'admin'
    }

    const existingAdmin = await User.findOne({
      where: { payrollNumber: adminData.payrollNumber }
    })

    if (!existingAdmin) {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash('admin123', saltRounds)

      await User.create({
        name: adminData.name,
        payrollNumber: adminData.payrollNumber,
        password: passwordHash,
        role: adminData.role
      })

      console.log('✅ Default admin created:', adminData.name)
    } else {
      console.log('ℹ️ Admin already exists')
    }

    // Run only in development
    if (process.env.NODE_ENV !== 'production') {
      require('./scripts/update-admin.cjs')
    }

    // Start server
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer();