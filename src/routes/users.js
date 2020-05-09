const express = require('express');
const routes = express.Router();

const users = require('../app/controllers/UsersController')

const userValidator = require('../app/validators/userValidator')

const { onlyUsers, onlyAdmins, isYourAccount } = require('../app/middlewares/session')



routes.get('/', onlyUsers, users.list)

routes.get('/create', onlyUsers, onlyAdmins, users.create)
routes.post('/create', onlyUsers, onlyAdmins, users.post)


routes.get('/:id', onlyUsers, users.show)
routes.put('/:id', onlyUsers, userValidator.put, users.put)


routes.get('/:id/edit', onlyAdmins, users.edit)
routes.put('/:id/edit', onlyUsers, onlyAdmins, users.put)

routes.delete('/:id/edit', onlyUsers, onlyAdmins, isYourAccount, users.delete)

module.exports = routes