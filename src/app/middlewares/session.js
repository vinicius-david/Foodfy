const User = require('../models/User')
const LoadService = require('../services/LoadService')

module.exports = {
  onlyUsers(req, res, next) {

    if (!req.session.userId) return res.redirect('/session/login')

    next()
  },
  isLoggedRedirectToUser(req, res, next) {

    if (req.session.userId) return res.redirect(`/admin/users/${req.session.userId}`)

    next()
  },
  async onlyAdmins(req, res, next) {

    const user = await User.findOne({ where: { id: req.session.userId } })

    if (!user.is_admin) {

      const recipes = await LoadService.recipes(req)
      const chefs = await LoadService.chefs(req)
      const users = await User.findAll()

      return res.render('admin/index', {
        recipes: recipes.length,
        chefs: chefs.length,
        users: users.length,
        error: 'Somente admins podem acessar essa página'
      })

    }

    next()
  },
  async isYourAccount(req, res, next) {

    if (req.params.id == req.session.userId) {

      const users = await User.findAll()

      return res.render('admin/users/users', { users, error:'Usuários não podem deletar a própria conta' })
    }

    next()
  }
}