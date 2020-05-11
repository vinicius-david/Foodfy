const Chef = require('../models/Chef')

module.exports = {
  async post(req, res, next) {
    
    const keys = Object.keys(req.body)

    for (key of keys) {
      
      if ( req.body[key] == '' && [key] != 'information') {

        const chefs = await Chef.findAllWithParam('', 'recipes', 'chef_id', 'chefs.id')

        return res.render('admin/recipes/create', { 
          chefs, 
          recipe: req.body, 
          error: 'Por favor, preencha todos os campos',
          number: Math.ceil(Math.random() * 20) })
      }
    }

    next()
  }
}