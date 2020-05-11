const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer')

const chefs = require('../app/controllers/ChefsController')

const { onlyUsers, onlyAdmins } = require('../app/middlewares/session')
const chefValidator = require('../app/validators/chefValidator')



routes.get('/', onlyUsers, chefs.list)

routes.get('/create', onlyUsers, onlyAdmins, chefs.create)
routes.post('/create', onlyUsers, onlyAdmins, multer.array('photo', 1), chefValidator.post, chefs.post)

routes.get('/:id', onlyUsers, chefs.show)

routes.get('/:id/edit', onlyUsers, onlyAdmins, chefs.edit)
routes.put('/:id/edit', onlyUsers, onlyAdmins,  multer.array('photo', 1), chefs.put)

routes.delete('/:id/edit', onlyUsers, onlyAdmins, multer.array('photo', 1), chefs.delete)

module.exports = routes