const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer')

const chefs = require('../app/controllers/chefsController')

const sessionMiddleware = require('../app/middlewares/session')



routes.get('/', sessionMiddleware.onlyUsers, chefs.list)

routes.get('/create', sessionMiddleware.onlyUsers, sessionMiddleware.onlyAdmins, chefs.create)
routes.post('/create', sessionMiddleware.onlyUsers, sessionMiddleware.onlyAdmins, multer.array('photo', 1), chefs.post)

routes.get('/:id', sessionMiddleware.onlyUsers, chefs.show)

routes.get('/:id/edit', sessionMiddleware.onlyUsers, sessionMiddleware.onlyAdmins, chefs.edit)
routes.put('/:id/edit', sessionMiddleware.onlyUsers, sessionMiddleware.onlyAdmins,  multer.array('photo', 1), chefs.put)

routes.delete('/:id/edit', sessionMiddleware.onlyUsers, sessionMiddleware.onlyAdmins, multer.array('photo', 1), chefs.delete)

module.exports = routes