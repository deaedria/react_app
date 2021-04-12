const route = require('express').Router()
const contactController = require('../controller/Contact')

route.get('/', contactController.getAllContact)
route.post('/', contactController.refreshContact) 
route.get('/:id', contactController.getContactById) 
route.post('/:search_contact', contactController.searchContactByName)  


module.exports = route