const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/keys', require('./keys'))
router.use('/keyboard', require('./keyboard'))
router.use('/keyboards', require('./keyboards'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
