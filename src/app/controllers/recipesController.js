const { unlinkSync } = require('fs')

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
        const user = await User.findOne({ where: { id: req.session.userId } })

        if (user.is_admin) {

          // get all recipes
          let recipes = await Recipe.findAllAs('', 'chefs.name', 'chef_name', 'chefs', 'chef_id', 'chefs', '', 'created_at', 'DESC')

          return recipes

        } else {

          // get users recipes
          let recipes = await Recipe.userRecipes(user.id)
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
    
      const recipeId = await Recipe.createRecipe(req.body)
  
      const filesPromise = req.files.map(file => File.create({
        name: file.name, 
        path: `public/images/${file.filename}`}))

      const filesIds = await Promise.all(filesPromise)
  
      for (let i = 0; i < filesIds.length; i++) {
  
        File.createRelation({
        recipe_id: recipeId,
        file_id: filesIds[i]
      })
      }
      
      return res.redirect(`/admin/recipes/${recipeId}`)
      
    } catch (error) {
      console.error(error)
    }
  },
  async show(req, res) {
    try {
      
      const { id } = req.params

      const recipe = await Recipe.findOneAs({ where: {id} }, 'chefs.name', 'chef_name', 'chefs', 'chef_id', 'chefs')

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

      const { id } = req.params

      // get chefs
      let chefs = await Chef.findAllWithParam('', 'recipes', 'chef_id', 'chefs.id')
  
      // get recipe
      const recipe = await Recipe.findOneAs({ where: {id} }, 'chefs.name', 'chef_name', 'chefs', 'chef_id', 'chefs')
  
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
          File.create({
            name: file.name, 
            path: `public/images/${file.filename}`}))
  
        const newFilesIds = await Promise.all(newFilesPromise)

        await Promise.all(newFilesIds.map(id => File.createRelation({
          recipe_id: req.body.id,
          file_id: id
        })))
      }
  
      if (req.body.removed_files) {

        const removedFiles = req.body.removed_files.split(',')
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1)

        await Promise.all(removedFiles.map(id => File.deleteRelation(id)))
        await Promise.all(removedFiles.map(id => File.delete(id)))
      }
  
      await Recipe.update(req.body)
      
      return res.redirect(`/admin/recipes/${req.body.id}`)
      
    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res) {
    try {

      const { id } = req.body

      const recipe = await Recipe.findOneAs({ where: {id} }, 'chefs.name', 'chef_name', 'chefs', 'chef_id', 'chefs')
  
      results = await Recipe.files(recipe.id)
      const files = results.rows.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
      }))

      await Promise.all(files.map(file => unlinkSync(`${file.path}`)))
      await Promise.all(files.map(file => File.deleteRelation(file.id)))
      await Promise.all(files.map(file => File.delete(file.id)))
  
      await Recipe.delete(id)
  
      return res.redirect('/admin/recipes')
      
    } catch (error) {
      console.error(error)
    }
  }
}