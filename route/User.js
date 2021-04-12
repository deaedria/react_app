const route = require('express').Router()
const userController = require('../controller/User')
const formUpload = require('../helper/formUpload')
const verifyToken = require('../helper/verifyToken')

//auth
route.post('/register', userController.register)
route.post('/login', userController.login)

route.get('/:get_user', verifyToken, userController.getUser) 
route.get('/', userController.getAllUser) 
route.post('/', formUpload.uploadImage, userController.addNewUser) 
route.patch('/:id', formUpload.uploadImage, userController.updateUser) 
route.delete('/:id', userController.deleteUser) 
route.post('/:search_user', userController.searchUserByName) 



module.exports = route