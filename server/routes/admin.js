import express from 'express'
import multer from 'multer'
import { body, param, validationResult } from 'express-validator'
import { requireAdmin } from '../middleware/auth.js'
import { listOrders, setOrderStatus } from '../controllers/adminOrdersController.js'
import { listCustomers } from '../controllers/adminCustomersController.js'
import {
  listProducts,
  addVariant,
  editVariant,
  removeVariant,
  uploadImage,
} from '../controllers/adminProductsController.js'

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'))
    }
    cb(null, true)
  },
})

router.use(requireAdmin)

function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid input', errors: errors.array() })
  }
  next()
}

const ORDER_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'failed']

router.get('/orders', listOrders)
router.patch(
  '/orders/:reference/status',
  [
    param('reference').isString().trim().notEmpty(),
    body('status').isIn(ORDER_STATUSES),
  ],
  validate,
  setOrderStatus
)

router.get('/customers', listCustomers)

router.get('/products', listProducts)

router.post(
  '/products/:productId/variants',
  [
    param('productId').isUUID(),
    body('colorName').isString().trim().notEmpty(),
    body('colorSlug').isString().trim().notEmpty(),
    body('hex').isString().trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
  ],
  validate,
  addVariant
)

router.patch(
  '/products/variants/:id',
  [param('id').isUUID()],
  validate,
  editVariant
)

router.delete('/products/variants/:id', [param('id').isUUID()], validate, removeVariant)

router.post('/products/upload-image', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message })
    }
    next()
  })
}, uploadImage)

export default router
