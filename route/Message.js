const route = require('express').Router()
const messageListController = require('../controller/Message')
const verifyToken = require('../helper/verifyToken')
 
route.get('/:key', verifyToken, messageListController.getMessageByUserIdAndContactId)  
// route.post('/', contactListController.refreshContactList) 
// route.post('/:user_id', contactListController.addNewContactList) 
// route.patch('/:id', contactListController.updateContactNameById) 
// route.delete('/:id', contactListController.deleteContactListById) 


module.exports = route