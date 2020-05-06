const db = require('../../config/db')

function find(filters, table) {

  let query = `SELECT * FROM ${table}`

  if (filters) {

    Object.keys(filters).map(key => {

    // WHERE, OR, AND
    query += ` ${key}`

    Object.keys(filters[key]).map(field => {
      query += ` ${field} = '${filters[key][field]}'`
    })
    
  })
  }

  return db.query(query)
}

function findAndCount(filters, table, target, param, group, order, direction) {

  let query = `SELECT ${table}.*, count(${target}) AS total_${target}
    FROM ${table}
    LEFT JOIN ${target} ON (${target}.${param} = ${table}.id)
  `
  if (filters) {

    Object.keys(filters).map(key => {

    // WHERE, OR, AND
    query += ` ${key}`

    Object.keys(filters[key]).map(field => {
      query += ` ${field} = '${filters[key][field]}'`
    })
    
  })
  }

  if (group) {
    query += `GROUP BY ${group}`
  }

  if (order) {
    query += `ORDER BY ${order} ${direction}`
  }


  return db.query(query)
}

const Base = {
  init({ table }) {

    if (!table) throw new Error('Invalid params')

    this.table = table

    return this
  },
  async find(id) {
    try {

      const results = await find({ where: { id } }, this.table)
    
      return results.rows[0]
      
    } catch (error) {
      console.error(error)
    }
  },
  async findOne(filters) {
    try {

      const results = await find(filters, this.table)
    
      return results.rows[0]

    } catch (error) {
      console.error(error)
    }   
  },
  async findAll(filters) {
    try {

      const results = await find(filters, this.table)
    
      return results.rows
      
    } catch (error) {
      console.error(error)
    }
  },
  async findOneWithParam(filters, target, param, group, order, direction) {
    try {
     
      const results = await findAndCount(filters, this.table, target, param, group, order, direction)
      
      return results.rows[0]
      
    } catch (error) {
      console.error(error)
    }
  },
  async findAllWithParam(filters, target, param, group, order, direction) {
    try {
     
      const results = await findAndCount(filters, this.table, target, param, group, order, direction)
      
      return results.rows
      
    } catch (error) {
      console.error(error)
    }
  },
  async create(fields) {
    try {
      
      let keys = [],
        values = []

      Object.keys(fields).map(key => {
        keys.push(key)
        values.push(fields[key])
      })

      console.log(values.join(','))

      const query = `INSERT INTO ${this.table} (${keys.join(',')})
        VALUES (${values.join(',')})
        RETURNING id
      `

      const results = await db.query(query)
      return results.rows[0].id

    } catch (err) {
      console.error(err)
    }
  },
  update(id, fields) {
    try {
      
      let update = []

      Object.keys(fields).map(key => {

        let line = `${key} = '${fields[key]}'` // category_id = ($1)
        update.push(line)
      })

      let query = `UPDATE ${this.table} SET
        ${update.join(',')} WHERE id = ${id}
      `

      return db.query(query)

    } catch (err) {
      console.error(err)
    }
  },
  delete(id) {
    try {

      return db.query(`DELETE FROM ${this.table} WHERE id = ${id}`)
      
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = Base