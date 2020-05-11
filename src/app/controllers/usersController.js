const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')

const User = require('../models/User')

module.exports = {
  async list(req, res) {
    try {

      const users = await User.findAll()

      return res.render('admin/users/users', { 
        users, 
        number: Math.ceil(Math.random() * 20) 
      })
      
    } catch (error) {
      console.error(error)
    }
  },
  create(req, res) {
    try {

      return res.render('admin/users/create', { 
        number: Math.ceil(Math.random() * 20) 
      })

    } catch (error) {
      console.error(error)
    }
  },
  async post(req, res) {
    try {

      //boolean admin status
      if (req.body.is_admin) {
        req.body.is_admin = true
      } else {
        req.body.is_admin = false
      }

      const { name, email, is_admin } = req.body

      //create a random users password as a reset_token
      const reset_token = crypto.randomBytes(20).toString('hex')
      let password = reset_token

      password = await hash(password, 8)

      // create token expiration date
      let now = new Date()
      now = now.setHours(now.getHours() + 1)
      const reset_token_expires = now

      const userId = await User.create({
        name,
        email,
        password,
        reset_token,
        reset_token_expires,
        is_admin,
      })

      //send email with token and password
      await mailer.sendMail({
        to: email,
        from: 'no-reply@foodfy.com.br',
        sub: 'Solicitação de registro de usuário',
        html: `
          <h2>Bem vindo ao Foodfy</h2>
          <p>Sua senha atual é ${reset_token}</p>
          <p>Clique no link abaixo para definit uma nova senha!</p>
          <p>
            <a href='http://localhost:3000/users/reset-password?token=${reset_token}' target='_blank'>
            DEFINIR NOVA SENHA
            </a>
          </p>
        `
      })

      const users = await User.findAll()
      
      return res.render(`admin/users/users`, {
        users,
        success: 'Novo usuário criado, use o link enviado por email para redefinir a sua senha',
        number: Math.ceil(Math.random() * 20)
      })
 
    } catch (error) {
      console.error(error)
    }    
  },
  async show(req, res) {
    try {

      const user = await User.findOne({ where: { id: req.params.id } })

      return res.render('admin/users/show', { 
        user, 
        number: Math.ceil(Math.random() * 20) 
      })

    } catch (error) {
      console.error(error)
    }
  },
  async edit(req, res) {
    try {

      const user = await User.findOne({ where: { id: req.params.id } })

      return res.render('admin/users/edit', { 
        user, 
        number: Math.ceil(Math.random() * 20) 
      })

    } catch (error) {
      console.error(error)
    }
  },
  async put(req, res) {
    try {

      const { id, name, email } = req.body

      //boolean admin status
      if (!req.body.is_admin) {

        let is_admin = 'false'

        await User.update(id, {
          name,
          email,
          is_admin
        })

        console.log('sem admin')

      } else {

        let is_admin = 'true'

        await User.update(id, {
          name,
          email,
          is_admin
        })

        console.log('com admin')

      }

      const users = await User.findAll()

      return res.render(`admin/users/users`, {
        users,
        success: 'Os dados do usuário foram atualizados',
        number: Math.ceil(Math.random() * 20)
      })

    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res) {
    try {

      let { id } = req.body

      const user = await User.findOneWithParam({ where: {id} }, 'recipes', 'user_id', 'users.id')

      if (user.total_recipes != 0) {

        const users = await User.findAll()
  
        return res.render('admin/users/users', {
          users,
          error: 'Usuários com receitas cadastradas não podem ser deletados',
          number: Math.ceil(Math.random() * 20)
        })
      } else {
        
        await User.delete(id)
  
        const users = await User.findAll()
  
        return res.render('admin/users/users', {
          users,
          success: 'Usuário deletado',
          number: Math.ceil(Math.random() * 20)
        })

      }      
    } catch (error) {
      console.error(error)
    }
  }
}