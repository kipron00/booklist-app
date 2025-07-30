// controllers/visitController.js
const { v4: uuidv4 } = require('uuid')
const models = require('../models/index.cjs')

const { Visit, User } = models

/**
 * Create a new visit (champion only)
 */
module.exports.createVisits = async (req, res) => {
  console.log('👤 User from JWT:', req.user)

  const { schoolName, location, contactPerson, phoneNumber, email, purchaseType, booklistStatus, remarks, dateOfVisit } = req.body
  const championId = req.user.id

  if (!schoolName || !location || !contactPerson || !phoneNumber || !email) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const newVisit = await Visit.create({
      id: uuidv4(),
      championId,
      dateOfVisit: dateOfVisit || new Date().toISOString().split('T')[0],
      schoolName,
      location,
      contactPerson,
      phoneNumber,
      email,
      purchaseType: purchaseType || 'Booklist',
      booklistStatus: booklistStatus || 'Pending',
      remarks: remarks || null
    })

    console.log('✅ Visit created:', newVisit.toJSON())
    res.status(201).json(newVisit)
  } catch (err) {
    console.error('❌ Error creating visit:', err)
    res.status(500).json({ message: 'Failed to create visit' })
  }
}

/**
 * Get all visits for the logged-in champion
 */
module.exports.getVisits = async (req, res) => {
  try {
    const championId = req.user.id
    const userVisits = await Visit.findAll({
      where: { championId },
      order: [['dateOfVisit', 'DESC']]
    })

    console.log('✅ Returning visits:', userVisits)
    res.json(userVisits)
  } catch (err) {
    console.error('❌ Error fetching visits:', err)
    res.status(500).json({ message: 'Failed to fetch visits' })
  }
}

/**
 * Get a single visit by ID (owner only)
 */
module.exports.getVisitById = async (req, res) => {
  try {
    const { id } = req.params
    const visit = await Visit.findOne({
      where: { id, championId: req.user.id }
    })

    if (!visit) {
      return res.status(404).json({ message: 'Visit not found or access denied' })
    }

    res.json(visit)
  } catch (err) {
    console.error('❌ Error fetching visit:', err)
    res.status(500).json({ message: 'Failed to fetch visit' })
  }
}

/**
 * Update a visit (owner only)
 */
module.exports.updateVisit = async (req, res) => {
  try {
    const { id } = req.params
    const { dateOfVisit, schoolName, location, contactPerson, phoneNumber, email, purchaseType, booklistStatus, remarks } = req.body

    const visit = await Visit.findOne({
      where: { id, championId: req.user.id }
    })

    if (!visit) {
      return res.status(404).json({ message: 'Visit not found or access denied' })
    }

    // Update fields
    visit.dateOfVisit = dateOfVisit || visit.dateOfVisit
    visit.schoolName = schoolName || visit.schoolName
    visit.location = location || visit.location
    visit.contactPerson = contactPerson || visit.contactPerson
    visit.phoneNumber = phoneNumber || visit.phoneNumber
    visit.email = email || visit.email
    visit.purchaseType = purchaseType || visit.purchaseType
    visit.booklistStatus = booklistStatus || visit.booklistStatus
    visit.remarks = remarks || visit.remarks
    visit.updatedAt = new Date()

    await visit.save()

    res.json(visit)
  } catch (err) {
    console.error('❌ Error updating visit:', err)
    res.status(500).json({ message: 'Failed to update visit' })
  }
}

/**
 * GET all visits (admin only)
 * Includes champion name
 */
module.exports.getAllVisits = async (req, res) => {
  try {
    console.log('🔐 Admin requested ALL visits')

    const visits = await Visit.findAll({
      include: [{
        model: User,
        as: 'User',
        attributes: ['name', 'payrollNumber'],
        where: { role: 'champion' },
        required: true
      }],
      order: [['dateOfVisit', 'DESC']]
    })

    // Flatten response
    const formattedVisits = visits.map(v => {
      const data = v.toJSON()
      return {
        ...data,
        championName: data.User?.name,
        championPayroll: data.User?.payrollNumber
      }
    })

    res.json(formattedVisits)
  } catch (err) {
    console.error('❌ Error fetching all visits:', err)
    res.status(500).json({ message: 'Failed to fetch all visits' })
  }
}