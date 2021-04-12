const route = require('express').Router()
const contactListController = require('../controller/ContactListEachUser')

route.get('/:user_id', contactListController.getContactListByUserId)  
// route.post('/', contactListController.refreshContactList) 
route.post('/:user_id', contactListController.addNewContactList) 
route.patch('/:id', contactListController.updateContactNameById) 
route.delete('/:id', contactListController.deleteContactListById) 


module.exports = route