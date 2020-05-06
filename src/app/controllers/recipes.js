const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
const User = require('../models/User')

module.exports = {
  async list(req, res) {
    try {

      // get recipes
      async function getRecipes() {

        //check if is admin
        const id = req.session.userId
        const user = await User.find({ where: {id} })

        if (user.is_admin) {

        // get all recipes
        let recipes = await Recipe.findAllAs('', 'chefs.name', 'chef_name', 'chefs', 'chef_id', '', 'created_at', 'DESC')
        return recipes

      } else {

        // get users recipes
        let recipes = await Recipe.findAllAs({ where: {id} }, 'chefs.name', 'chef_name', 'chefs', 'chef_id', '', 'created_at', 'DESC')
        return recipes
      }
      }

      let recipes = await getRecipes()

      // get images

      async function getImage(recipeId) {

        let results = await Recipe.files(recipeId)
        const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)

        return files[0]
      }

      const recipesPromisse = recipes.map(async recipe => {

        recipe.img = await getImage(recipe.id)

        return recipe
      })

      recipes = await Promise.all(recipesPromisse)

      return res.render('admin/recipes/recipes', { recipes })
      
    } catch (error) {
      console.error(error)
    }
  },
  async create(req, res) {
    try {

      const chefs = await Chef.findAllWithParam('', 'recipes', 'chef_id', 'chefs.id')

      return res.render('admin/recipes/create', { chefs })
      
    } catch (error) {
      console.error(error)
    }
  },
  async post(req, res) {
    try {

      if (req.files.length == 0) {
        return res.send('Envie ao menos uma imagem.')
      }
  
      req.body.user_id = req.session.userId
  
      const { chef_id, title, ingredients, preparation, information, user_id } = req.body
  
      const recipeId = await Recipe.create({
        chef_id,
        title,
        ingredients,
        preparation,
        information,
        user_id
      })
  
      const filesPromise = req.files.map(file => File.create({...file, recipe_id: recipeId}))
      const filesIds = await Promise.all(filesPromise)
  
      for (let i = 0; i < filesIds.length; i++) {
  
        File.createRelation({
        recipe_id: recipeId,
        file_id: filesIds[i].rows[0].id
      })
      }
      
      return res.redirect(`/admin/recipes/${recipeId}`)
      
    } catch (error) {
      console.error(error)
    }
  },
  async show(req, res) {
    try {
      
      const { id } = req.params.id

      const recipes = await Recipe.findOneAs({ where: {id} }, 'chefs.name', 'chef_name', 'chefs', 'chef_id')

      if (!recipe) return res.send('Receita não encontrada')

      results = await Recipe.files(recipe.id)
      const files = results.rows.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
      }))

      return res.render('admin/recipes/show', { recipe, files })

    } catch (error) {
      console.error(error)
    }
  },
  async edit(req, res) {
    try {

      const { id } = req.params.id

      // get chefs
      let chefs = await Chef.findAllWithParam('', 'recipes', 'chef_id', 'chefs.id')
  
      // get recipe
      const recipes = await Recipe.findOneAs({ where: {id} }, 'chefs.name', 'chef_name', 'chefs', 'chef_id')
  
      if (!recipe) return res.send('Receita não encontrada')
  
      // get images
  
      results = await Recipe.files(recipe.id)
      let files = results.rows
      files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
      }))
  
      return res.render('admin/recipes/edit', { recipe, chefs, files })
      
    } catch (error) {
      console.error(error)
    }
  },
  async put(req, res) {
    try {

      if (req.files.length != 0) {
        const newFilesPromise = req.files.map(file => 
          File.create({...file, recipe_id: req.body.id}))
  
        const newFilesIds = await Promise.all(newFilesPromise)
  
        for (let i = 0; i < newFilesIds.length; i++) {
  
          File.createRelation({
          recipe_id: req.body.id,
          file_id: newFilesIds[i].rows[0].id
        })
        }
      }
  
      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(',')
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1)
  
        const removedFilesPromise = removedFiles.map(id => File.delete(id))
  
        await Promise.all(removedFilesPromise)
      }
  
      await Recipe.update(req.body)
      
      return res.redirect(`/admin/recipes/${req.body.id}`)
      
    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res) {
    try {

      const { id } = req.body.id

      const recipes = await Recipe.findOneAs({ where: {id} }, 'chefs.name', 'chef_name', 'chefs', 'chef_id')
  
      results = await Recipe.files(recipe.id)
      const files = results.rows.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
      }))
  
      for (let i = 0; i < files.length; i++) {
        await File.delete(files[i].id)
      }
  
      await Recipe.delete(id)
  
      return res.redirect('/admin/recipes')
      
    } catch (error) {
      console.error(error)
    }
  }
}