const multer = require('multer')
const path = require('path')
const formResponse = require('./formResponse')

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/images')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
})

//upload initialitation
let upload = multer({ 
    storage: storage, 
    limits: {fileSize: 5000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
})

//check file type
const checkFileType = (file, cb) =>{
    const filetypes = /jpeg|jpg|png|gif/; //allowed ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // check ext
    const mimetype = filetypes.test(file.mimetype); //check mime

    if(mimetype && extname){
        return cb(null, true)
    }else{
        cb({message: 'Images Only'})
    }
}


const formUpload = {
    uploadImage: (req, res, next) => {
        const uploadImage = upload.single('images')
        uploadImage(req, res, (err) => {
            if(err instanceof multer.MulterError) {
                //A multer error occured when uploading
                formResponse({
                    message: err.message,
                    status: 400
                }, res)
            }else if(err){
                //An unknown error occured when uploading 
                formResponse({
                    message: err.message,
                    status: 400
                }, res)
            }else{
                next()
            }
        })
    }
}

module.exports = formUpload