// controllers/adminController.js
const models = require('../models/index.cjs');
const { User } = models;
const bcrypt = require('bcryptjs');
const saltRounds = 10;

exports.createChampion = async (req, res) => {
  const { name, payrollNumber, password } = req.body;

  if (!name || !payrollNumber || !password) {
    return res.status(400).json({ message: 'Name, payroll number, and password are required' });
  }

  try {
    const existing = await User.findOne({ where: { payrollNumber } });
    if (existing) {
      return res.status(400).json({ message: 'Payroll number already exists' });
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newChampion = await User.create({
      name,
      payrollNumber,
      password: passwordHash,
      role: 'champion'
    });

    res.status(201).json({
      id: newChampion.id,
      name: newChampion.name,
      payrollNumber: newChampion.payrollNumber,
      role: newChampion.role
    });
  } catch (err) {
    console.error('❌ Error creating champion:', err);
    res.status(500).json({ message: 'Failed to create champion' });
  }
};

exports.getChampions = async (req, res) => {
  try {
    const champions = await User.findAll({
      where: { role: 'champion' },
      attributes: ['id', 'name', 'payrollNumber', 'role']
    });
    res.json(champions);
  } catch (err) {
    console.error('❌ Error fetching champions:', err);
    res.status(500).json({ message: 'Failed to fetch champions' });
  }
};

exports.updateChampion = async (req, res) => {
  const { id } = req.params;
  const { name, payrollNumber, password } = req.body;

  try {
    const champion = await User.findByPk(id);
    if (!champion) return res.status(404).json({ message: 'Champion not found' });
    if (champion.role !== 'champion') return res.status(400).json({ message: 'Only champions can be edited' });

    if (payrollNumber && payrollNumber !== champion.payrollNumber) {
      const existing = await User.findOne({ where: { payrollNumber } });
      if (existing) return res.status(400).json({ message: 'Payroll number already in use' });
    }

    const passwordHash = password ? await bcrypt.hash(password, saltRounds) : champion.password;

    champion.name = name || champion.name;
    champion.payrollNumber = payrollNumber || champion.payrollNumber;
    champion.password = passwordHash;

    await champion.save();

    res.json({
      id: champion.id,
      name: champion.name,
      payrollNumber: champion.payrollNumber,
      role: champion.role
    });
  } catch (err) {
    console.error('❌ Error updating champion:', err);
    res.status(500).json({ message: 'Failed to update champion' });
  }
};

exports.deleteChampion = async (req, res) => {
  const { id } = req.params;

  try {
    const champion = await User.findByPk(id);
    if (!champion) return res.status(404).json({ message: 'Champion not found' });
    if (champion.role !== 'champion') return res.status(400).json({ message: 'Only champions can be deleted' });

    await champion.destroy();
    res.json({ message: 'Champion deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting champion:', err);
    res.status(500).json({ message: 'Failed to delete champion' });
  }
};