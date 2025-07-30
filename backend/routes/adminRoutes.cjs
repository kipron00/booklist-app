const { createChampion, getChampions, updateChampion, deleteChampion } = require('../controllers/adminController.cjs')
const authMiddleware = require('../middleware/authMiddleware.cjs')
const adminOnly = require('../middleware/adminMiddleware.cjs')
const { Router } = require('express')
const router = Router()

// Protect all admin routes
router.use(authMiddleware, adminOnly)

// Routes
router.post('/create-champion', createChampion)
router.get('/champions', getChampions)
router.put('/champions/:id', updateChampion)
router.delete('/champions/:id', deleteChampion)

module.exports = router;