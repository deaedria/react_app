const route = require('express').Router()
const formUpload = require('../helper/formUpload')

route.post('/images', formUpload.uploadImage) 

module.exports = route