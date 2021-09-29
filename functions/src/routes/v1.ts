import Express from 'express'

const route = Express.Router()

export default route

require('@controllers/Auth/controller')

// Master
require('@controllers/Master/Role/controller')
require('@controllers/Master/Category/controller')
