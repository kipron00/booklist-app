const { createVisits, getVisits, getVisitById, updateVisit, getAllVisits } = require('../controllers/visitController.cjs')
const authMiddleware = require('../middleware/authMiddleware.cjs')
const adminOnly  = require('../middleware/adminMiddleware.cjs')
const { Router } = require('express')
const router = Router()

// Protect routes
router.use(authMiddleware)

// Champion routes
router.post('/', createVisits)
router.get('/', getVisits)
router.get('/:id', getVisitById)
router.put('/:id', updateVisit)

// Admin-only sub-router
const adminRouter = Router()
adminRouter.use(adminOnly) // Ensures only admins access
adminRouter.get('/all', getAllVisits)

// Mount admin routes under /admin
router.use('/admin', adminRouter)

module.exports = router;