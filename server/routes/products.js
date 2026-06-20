import express from 'express'
import { listActiveProducts } from '../controllers/productController.js'

const router = express.Router()

router.get('/', listActiveProducts)

export default router
