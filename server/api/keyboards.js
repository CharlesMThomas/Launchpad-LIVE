const router = require('express').Router()
const {Keyboard} = require('../db/models')
module.exports = router

router.get('/:id', (req, res, next) => {
  Keyboard.findAll({where: {userId: req.params.id}})
    .then(keyboards => res.json(keyboards))
    .catch(next)
})

router.post('/', (req, res, next) => {
  Keyboard.create(req.body)
    .then(keyboard => res.json(keyboard))
    .catch(next)
})

router.put('/:id', (req, res, next) => {
  Keyboard.update(req.body, { where: {id: req.params.id}})
    .then(keyboard => res.json(keyboard))
    .catch(next)
})

router.delete('/:id', (req, res, next) => {
  Keyboard.destroy({where: {id: req.params.id}})
    .then(() => res.sendStatus(200))
    .catch(next);
})
