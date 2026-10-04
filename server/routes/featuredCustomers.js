import express from 'express'
import { listPublicFeaturedCustomers } from '../controllers/featuredCustomersController.js'

const router = express.Router()

router.get('/', listPublicFeaturedCustomers)

export default router
