// controllers/authController.js
const models = require('../models/index.cjs');
const { User, sequelize, Sequelize } = models;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  console.log('🔍 Login attempt:', { identifier, password }) 

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Name/Payroll No and password are required' });
  }

  try {
    const user = await User.findOne({
      where: {
        [Sequelize.Op.or]: [
          sequelize.where(
            sequelize.fn('LOWER', sequelize.col('name')),
            'LIKE',
            identifier.toLowerCase()
          ),
          { payrollNumber: identifier }
        ]
      }
    })

    console.log('🔍 Found user:', user ? { id: user.id, role: user.role } : 'Not found')

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Error during login:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};