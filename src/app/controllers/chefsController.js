const { unlinkSync } = require('fs')

const Chef = require('../models/Chef')
const File = require('../models/File')
const LoadService = require('../services/LoadService')

module.exports = {
  async list(req, res) {
    try {

      const chefs = await LoadService.chefs(req)

      return res.render('admin/chefs/chefs', { chefs })
      
    } catch (error) {
      console.error(error)
    }
  },
  create(req, res) {
    return res.render('admin/chefs/create')
  },
  async post(req, res) {
    try {

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
  
      const chefId = await Chef.create(values)
      
      return res.redirect(`/admin/chefs/${chefId}`)
      
    } catch (error) {
      console.error(error)
    }
  },
  async show(req, res) {
    try {

      const { chef, recipes } = await LoadService.chef(req)

      if (!chef) return res.send('Chef não encontrado.')
              
      return res.render('admin/chefs/show', { chef, recipes })
      
    } catch (error) {
      console.error(error)
    }
  },
  async edit(req, res) {
    try {

      const { chef } = await LoadService.chef(req)

      if (!chef) return res.send('Chef não encontrado.')

      return res.render('admin/chefs/edit', { chef })
      
    } catch (error) {
      console.error(error)
    }
  },
  async put(req, res) {
    try {

      const { id } = req.body

      console.log(req.body)

      if (req.files.length != 0) {

        // get chef
        const chef = await Chef.findOneWithParam({ where: {id} }, 'recipes', 'chef_id', 'chefs.id')
  
        // get chef avatar
        let results = await Chef.file(chef.id)
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

        return res.redirect(`/admin/chefs/${req.body.id}`)
      }

      let values = {
        name: req.body.name,
        id: req.body.id
      }
      
      await Chef.update(id, values)
      
      return res.redirect(`/admin/chefs/${req.body.id}`)
      
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
          
        return res.redirect('/admin/chefs')
        
      } else {

        return res.send('O chef não pode ser deletado pois possui receitas cadastradas.')
      }
    
    } catch (error) {
      console.error(error)
    }
  }
}