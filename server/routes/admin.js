import express from 'express'
import multer from 'multer'
import { body, param, query, validationResult } from 'express-validator'
import { requireAdmin } from '../middleware/auth.js'
import { listOrders, setOrderStatus } from '../controllers/adminOrdersController.js'
import { listCustomers } from '../controllers/adminCustomersController.js'
import { listContactMessages } from '../controllers/adminContactController.js'
import {
  listAdminFeaturedCustomers,
  addFeaturedCustomer,
  removeFeaturedCustomer,
} from '../controllers/featuredCustomersController.js'
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

router.get(
  '/orders',
  [
    query('status').optional().isIn(ORDER_STATUSES),
    query('search').optional().isString().trim().isLength({ max: 200 }),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  validate,
  listOrders
)
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

router.get('/contact-messages', listContactMessages)

router.get('/featured-customers', listAdminFeaturedCustomers)
router.post(
  '/featured-customers',
  [
    body('firstName').isString().trim().matches(/^[A-Za-z\s'-]+$/).isLength({ max: 50 }),
    body('quote').isString().trim().notEmpty().isLength({ max: 280 }),
    body('imageUrl').isURL({ protocols: ['https'], require_protocol: true }),
    body('consentConfirmed').custom((value) => value === true),
  ],
  validate,
  addFeaturedCustomer
)
router.delete(
  '/featured-customers/:id',
  [param('id').isUUID()],
  validate,
  removeFeaturedCustomer
)

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
