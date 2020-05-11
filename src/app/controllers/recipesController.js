const { unlinkSync } = require('fs')

const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
const User = require('../models/User')
const LoadService = require('../services/LoadService')

module.exports = {
  async list(req, res) {
    try {

      // pagination
      let { page, limit } = req.query
      let filter = ''
      let pages = []

      const allRecipes = await LoadService.recipes(req)
      const totalRecipes = allRecipes.length

      page = page || 1
      limit = limit || 6
      let offset = limit * ( page - 1 )

      for (let i = 1; i <= Math.ceil(totalRecipes/limit); i++) {
        pages.push(i)
      }

      // get recipes
      results = await Recipe.findBy(filter, limit, offset)
      let recipes = results.rows
  
      // get images
      async function getImage(recipeId) {
  
        let results = await Recipe.file(recipeId)
        const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)
  
        return files[0]
      }
  
      const recipesPromisse = recipes.map(async recipe => {
  
        recipe.img = await getImage(recipe.id)
  
        return recipe
      })
  
      recipes = await Promise.all(recipesPromisse)
  
      return res.render('admin/recipes/recipes', { 
        recipes,  
        number: Math.ceil(Math.random() * 20),
        pages
      })

      // const recipes = await LoadService.recipes(req)

      // return res.render('admin/recipes/recipes', { 
      //   recipes, 
      //   number: Math.ceil(Math.random() * 20) })
      
    } catch (error) {
      console.error(error)
    }
  },
  async userRecipes(req, res) {
    try {

      // get users recipes
      let recipes = await Recipe.userRecipes(req.session.userId)

      // get images
      async function getImage(recipeId) {

        let results = await Recipe.file(recipeId)
        const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)

        return files[0]
      }

      const recipesPromisse = recipes.map(async recipe => {

        recipe.img = await getImage(recipe.id)

        return recipe
      })

      recipes = await Promise.all(recipesPromisse)

      return res.render('admin/recipes/user-recipes', { 
        recipes, 
        number: Math.ceil(Math.random() * 20) })
      
    } catch (error) {
      console.error(error)
    }
  },
  async create(req, res) {
    try {

      const chefs = await Chef.findAllWithParam('', 'recipes', 'chef_id', 'chefs.id')

      return res.render('admin/recipes/create', { 
        chefs, 
        number: Math.ceil(Math.random() * 20) })
      
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

      req.params.id = recipeId

      const { recipe, files } = await LoadService.recipe(req)

      return res.render('admin/recipes/show', { 
        recipe, 
        files, 
        success: 'Receita cadastrada com sucesso', 
        number: Math.ceil(Math.random() * 20) })
            
    } catch (error) {
      console.error(error)
    }
  },
  async show(req, res) {
    try {

      const { recipe, files } = await LoadService.recipe(req)

      if (!recipe) return res.send('Receita não encontrada')

      return res.render('admin/recipes/show', { 
        recipe, 
        files, 
        number: Math.ceil(Math.random() * 20) })

    } catch (error) {
      console.error(error)
    }
  },
  async edit(req, res) {
    try {

      // get user
      const user = await User.findOne({ where: { id: req.session.userId } })
      const oldRecipe = await Recipe.findOne({ where: { id: req.params.id } })

      if (!user.is_admin && (oldRecipe.user_id != user.id)) {

        const recipes = await LoadService.recipes(req)

        return res.render('admin/recipes/recipes', { 
          recipes,
          error: 'Usuários comuns só podem editar as próprias receitas'
        })
      } 

      // // get chefs
      let chefs = await Chef.findAllWithParam('', 'recipes', 'chef_id', 'chefs.id')

      const { recipe, files } = await LoadService.recipe(req)
  
      if (!recipe) return res.send('Receita não encontrada')
  
      return res.render('admin/recipes/edit', { 
        recipe, 
        chefs, 
        files, 
        number: Math.ceil(Math.random() * 20) })
      
    } catch (error) {
      console.error(error)
    }
  },
  async put(req, res) {
    try {

      // get user
      const user = await User.findOne({ where: { id: req.session.userId } })

      // get recipe
      const oldRecipe = await Recipe.findOne({ where: { id: req.body.id } })

      if (!user.is_admin && (oldRecipe.user_id != user.id)) 
      return res.send('Usuários comuns só podem editar as próprias receitas')

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

      req.params.id = oldRecipe.id

      const { recipe, files } = await LoadService.recipe(req)

      return res.render('admin/recipes/show', { 
        recipe, 
        files, 
        success: 'Dados atualizados com sucesso', 
        number: Math.ceil(Math.random() * 20) })
            
    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res) {
    try {

      const { id } = req.body

      const recipe = await Recipe.findOneAs({ where: {id} }, 'chefs.name', 'chef_name', 'chefs', 'chef_id', 'chefs')
  
      results = await Recipe.file(recipe.id)
      const files = results.rows.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
      }))

      await Promise.all(files.map(file => unlinkSync(`${file.path}`)))
      await Promise.all(files.map(file => File.deleteRelation(file.id)))
      await Promise.all(files.map(file => File.delete(file.id)))
  
      await Recipe.delete(id)
  
      const recipes = await LoadService.recipes(req)

      return res.render('admin/recipes/recipes', { 
        recipes, 
        success:'Receita deletada com sucesso', 
        number: Math.ceil(Math.random() * 20) })
      
    } catch (error) {
      console.error(error)
    }
  }
}