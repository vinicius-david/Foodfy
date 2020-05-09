const express = require('express');
const routes = express.Router();

const home = require('../app/controllers/HomeController')

const recipes = require('./recipes')
const chefs = require('./chefs')
const session = require('./session')
const users = require('./users')

// HOME
routes.get('/', home.index)
routes.get('/about', home.about)
routes.get('/recipes', home.recipes)
routes.get('/recipes/:id', home.show)
routes.get('/chefs', home.chefs)
routes.get('/filter', home.filter)

routes.get('/admin', home.admin)

// SESSION
routes.use('/session', session)

// USERS
routes.use('/admin/users', users)

// CHEFS
routes.use('/admin/chefs', chefs)

// RECIPES
routes.use('/admin/recipes', recipes)


module.exports = routes