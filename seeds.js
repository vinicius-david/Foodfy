const { hash } = require('bcryptjs')
const faker = require('faker')

const User = require('./src/app/models/User')
const Chef = require('./src/app/models/Chef')
const Recipe = require('./src/app/models/Recipe')
const File = require('./src/app/models/File')

let usersIds = [],
  recipesIds = [],
  chefsIds = [],
  filesIds = []

let totalUsers = 3,
  totalChefs = 5,
  totalRecipes = 10,
  totalFiles = 50

async function createUsers() {

  const users = []
  const password = await hash('123', 8)

  while (users.length < totalUsers) {

    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
    })
  }

  const usersPromisse = users.map(user => User.create(user))

  usersIds = await Promise.all(usersPromisse)
}

async function createChefs() {

  const chefs = [],
    files = []

  while (files.length < totalChefs) {
    files.push({
      name: faker.image.image(),
      path: `public/images/placeholder.jpg`,
    })
  }

  const filesPromise = files.map(file => File.create(file))
  await Promise.all(filesPromise)

  while (chefs.length < totalChefs) {

    chefs.push({
      name: faker.name.firstName(),
      file_id: Math.ceil(Math.random() * files.length)
    })
  }

  const chefsPromise = chefs.map(chef => Chef.create(chef))

  chefsIds = await Promise.all(chefsPromise)
}

async function createRecipes() {

  let recipes = []

  while (recipes.length < totalRecipes) {
    recipes.push({
      chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
      user_id: usersIds[Math.floor(Math.random() * totalUsers)],
      title: faker.name.title(),
      information: faker.lorem.paragraph(Math.ceil(Math.random()))
    })
  }

  const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
  recipesIds = await Promise.all(recipesPromise)

  let files = []

  while (files.length < totalFiles) {
    files.push({
      name: faker.image.image(),
      path: `public/images/placeholder.jpg`,
    })
  }

  const filesPromise = files.map(file => File.create(file))
  filesIds = await Promise.all(filesPromise)
}

async function createRelations() {

  const recipe_files = []

  while (recipe_files.length < totalFiles) {

    recipe_files.push({
      recipe_id: recipesIds[Math.floor(Math.random() * totalRecipes)],
      file_id: filesIds[5 + Math.ceil(Math.random() * totalFiles)],
    })
  }

  const recipe_filesPromise = recipe_files.map(recipe_files => File.createRelation(recipe_files))

  await Promise.all(recipe_filesPromise)
}

async function init() {
  await createUsers()
  await createChefs()
  await createRecipes()
  await createRelations()
}

init()