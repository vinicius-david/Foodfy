const { unlinkSync } = require('fs')

const Chef = require('../models/Chef')
const File = require('../models/File')
const LoadService = require('../services/LoadService')

module.exports = {
  async list(req, res) {
    try {

      const chefs = await LoadService.chefs(req)

      return res.render('admin/chefs/chefs', { 
        chefs, 
        number: Math.ceil(Math.random() * 20) 
      })
      
    } catch (error) {
      console.error(error)
    }
  },
  create(req, res) {
    return res.render('admin/chefs/create', { number: Math.ceil(Math.random() * 20) })
  },
  async post(req, res) {
    try {

      if (req.files.length == 0) {
        return res.render('admin/chefs/create', { 
          error: 'Por favor, envie ao menos uma imagem', 
          number: Math.ceil(Math.random() * 20) 
        })
      }

      const file = req.files

      const filesPromise = file.map(file => File.create({
        name: file.filename,
        path: `public/images/${file.filename}`
      }))
      let fileId = await Promise.all(filesPromise)
      
      let values = {
        name: req.body.name,
        file_id: fileId[0]
      }
  
      req.params.id = await Chef.create(values)

      const { chef, recipes } = await LoadService.chef(req)
              
      return res.render('admin/chefs/show', { 
        chef, 
        recipes, 
        number: Math.ceil(Math.random() * 20), 
        success: 'Chef criado' })
            
    } catch (error) {
      console.error(error)
    }
  },
  async show(req, res) {
    try {

      const { chef, recipes } = await LoadService.chef(req)

      if (!chef) return res.send('Chef não encontrado.')
              
      return res.render('admin/chefs/show', { 
        chef, 
        recipes, 
        number: Math.ceil(Math.random() * 20) 
      })
      
    } catch (error) {
      console.error(error)
    }
  },
  async edit(req, res) {
    try {

      const { chef } = await LoadService.chef(req)

      if (!chef) return res.send('Chef não encontrado.')

      return res.render('admin/chefs/edit', { 
        chef, 
        number: Math.ceil(Math.random() * 20) 
      })
      
    } catch (error) {
      console.error(error)
    }
  },
  async put(req, res) {
    try {

      const { id } = req.body

      if (req.files.length != 0) {

        // get chef
        const oldChef = await Chef.findOneWithParam({ where: {id} }, 'recipes', 'chef_id', 'chefs.id')
  
        // get chef avatar
        let results = await Chef.file(oldChef.id)
        const file = results.rows[0]
    
        const newFilesPromise = req.files.map(file => File.create({
          name: file.filename,
          path: `public/images/${file.filename}`
        }))
        
        let fileId = await Promise.all(newFilesPromise)
        
        let values = {
          name: req.body.name,
          file_id: fileId[0],
          id: req.body.id
        }
        
        await Chef.update(id, values)

        // delete chef old avatar
        await unlinkSync(file.path)
        await File.delete(file.file_id)

        req.params.id = id

        const { chef, recipes } = await LoadService.chef(req)

        console.log(chef, recipes)
                
        return res.render('admin/chefs/show', { 
          chef, 
          recipes, 
          success: 'Dados do chef atualizados', number: Math.ceil(Math.random() * 20) 
        })
      }

      let values = {
        name: req.body.name,
        id: req.body.id
      }
      
      await Chef.update(id, values)

      req.params.id = id

      const { chef, recipes } = await LoadService.chef(req)
              
      return res.render('admin/chefs/show', { 
        chef, 
        recipes, 
        success: 'Dados do chef atualizados', number: Math.ceil(Math.random() * 20) 
      })
            
    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res) {
    try {

      const { id } = req.body

      // get chef
      const chef = await Chef.findOneWithParam({ where: {id} }, 'recipes', 'chef_id', 'chefs.id')

      // get chef avatar
      let results = await Chef.file(chef.id)
      const file = results.rows[0]
        
      if (chef.total_recipes == 0) {
          
        await Chef.delete(id)

        // delete chef old avatar
        await unlinkSync(file.path)
        await File.delete(file.file_id)
          
        const chefs = await LoadService.chefs(req)

        return res.render('admin/chefs/chefs', { 
          chefs, 
          success: 'Chef deletado com sucesso', 
          number: Math.ceil(Math.random() * 20) 
        })
        
      } else {

        const chefs = await LoadService.chefs(req)

        return res.render('admin/chefs/chefs', { 
          chefs, 
          error: 'Não é possível deletar chefs com receitas cadastradas', 
          number: Math.ceil(Math.random() * 20) 
        })
      }
    
    } catch (error) {
      console.error(error)
    }
  }
}