const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../helper/connector')
const fs = require('fs')

const userModel = {
    getAllUser: (req)=> {
        const {limit=8, page=1} = req.query
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users LIMIT ${limit} OFFSET ${(page-1) * limit}`, (err, result) => {
                if(result.rows.length < 1){
                    reject({message: `user not found`, status: 400, data: []})
                }
                if(!err) {
                    resolve({message: 'get all users success', status: 200, data: result.rows})
                }else{
                    reject({message: `get users error ${err}`, status: 500, data: []})
                }
            })
        })
    },

    getUser: (req)=> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE user_id = ${req.query.id}`, (err, result) => {
                if(!err) {
                    resolve({message: `get user id: ${req.query.id} success`, status: 200, data: result.rows[0]})
                }else{
                    reject({message: `get user failed`, status: 500, data: {}})
                }
            })
        })
    },

    // getById: (req)=> {
    //     return new Promise((resolve, reject) => {
    //         db.query(`SELECT * FROM users WHERE user_id = ${req.id}`, (err, result) => {
    //             if(!err) {
    //                 // const checkId = result.rows[0] ? result.rows[0].user_id : null;
    //                 const checkId = result.rows[0]?.user_id;
    //                 if(req.id == checkId) {
    //                     resolve({message: `get user id: ${req.id} success`, status: 200, data: result.rows[0]})
    //                 }else{
    //                     reject({message: `user id: ${req.id} not found`, status: 400, data: {}})
    //                 }
    //             }else{
    //                 reject({message: `get user error ${err}`, status: 500, data: {}})
    //             }
    //         })
    //     })
    // },

    deleteUser: (req)=> {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM users WHERE user_id = '${req.id}' RETURNING *`, (err, result) => {
                if(!err) {
                    const checkId = result.rows[0]?.user_id;
                    if(req.id == checkId) {
                        resolve({message: 'delete success', status: 200, data: result.rows[0]})
                    }else{
                        reject({message: `user id: ${req.id} not found`, status: 400, data: {}})
                    }
                }else{
                    reject({message: 'update data failed', status: 500, data: err})
                }
            })
        })
    },

    addNewUser: (req, res)=> {
        return new Promise((resolve, reject) => {
        const {name, phone, images, username, email, password, bio} = req.body
            db.query(`SELECT * FROM users where username= '${username}' OR phone= '${phone}' OR email = '${email}'`, (error, result) => {
                if(!error) {
                    const checkUsername = result.rows[0] ? result.rows[0].username : null; 
                    const checkPhone = result.rows[0] ? result.rows[0].phone : null; 
                    const checkEmail = result.rows[0] ? result.rows[0].email : null; 
                    // console.log(checkPhone)
                    if((username == null) || (phone == null) || (email == null)) {
                        reject({message: `username/phone/email is required`, status: 400, data: []})
                    }else if((username == checkUsername) || (phone == checkPhone) || (email == checkEmail)) {
                        reject({message: `username/phone/email is exists`, status: 400})
                    }else{
                        const file = req.file?.filename ? `/uploads/images/${req.file.filename}` : null

                        bcrypt.genSalt(10, function(saltError, salt){
                            bcrypt.hash(password, salt, function(hashingError, hash){
                                if(!hashingError){
                                    let newBody = {...req.body, password: hash, images: file}
                                    db.query('INSERT INTO users(name, phone, photo_profile, username, email, password, bio) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [name, phone, newBody.images, username, email, hash, bio], (err, response) => {
                                        if(!err) {
                                            resolve({message: 'user has been created', status: 201, data: response.rows[0]})
                                        }else{
                                            reject({message: 'create data failed', status: 500, data: err})
                                        }
                                    })
                                }else{
                                    reject({message: `hashing failed`, status: 500})
                                }
                            });
                        });
                    }
                }else{
                    reject({message: 'create data failed', status: 500, data: error})
                }
            })
        })
    },

    updateUser: (req, res)=> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE user_id = '${req.params.id}'`, (error, result) => {
                if(result.rows == '' || result.rows.length < 1) {
                    reject({message: `user id not found`, status: 400, data: {}})
                }
                if(!error) {
                    const file = req.file?.filename ? `/uploads/images/${req.file.filename}` : result.rows[0].photo_profile
                    const {
                        name = result.rows[0]?.name, 
                        phone = result.rows[0]?.phone,  
                        username = result.rows[0]?.username, 
                        email = result.rows[0]?.email, 
                        password = result.rows[0]?.password, 
                        bio = result.rows[0]?.bio, 
                    } = req.body
                    const {id} = req.params;
                    bcrypt.genSalt(10, function(saltError, salt){
                        bcrypt.hash(password, salt, function(hashingError, hash){
                            if(!hashingError){
                                let newBody = {...req.body, password: req.body.password? hash : result.rows[0]?.password , images: file }
                                if(newBody.images != result.rows[0].photo_profile){
                                    fs.unlink(`./public/${result.rows[0].photo_profile}`, (err1) => {
                                        if(!err1){
                                            console.log('successfully deleted local image')
                                        }else{
                                            console.log(`failed to deleted local image ${err1}`)
                                        }
                                    });
                                    db.query("UPDATE users SET name=$1, phone=$2, photo_profile=$3, username=$4, email=$5, password=$6, bio=$7 WHERE user_id=$8 RETURNING *", [name, phone, newBody.images, username, email, newBody.password, bio, id], (err, response) => {                        
                                        if(!err){ 
                                            resolve({message: `update user id ${id} success`, status: 200, data: response.rows[0]})
                                        }else{
                                            reject({message: 'update data failed', status: 500, data: err})
                                        }
                                    })
                                }else{
                                    db.query("UPDATE users SET name=$1, phone=$2, photo_profile=$3, username=$4, email=$5, password=$6, bio=$7 WHERE user_id=$8 RETURNING *", [name, phone, newBody.images, username, email, newBody.password, bio, id], (err, response) => {                        
                                        if(!err){ 
                                            resolve({message: `update user id ${id} success`, status: 200, data: response.rows[0]})
                                        }else{
                                            reject({message: 'update data failed', status: 500, data: err})
                                        }
                                    })
                                }                                
                            }else{
                                reject({message: `hashing failed`, status: 500})
                            }
                        });
                    });
                }else{
                    reject({message: 'update data failed', status: 500, data: error})
                }           
            })
        })        
    },

    
    searchUserByName: (req)=> {
        return new Promise((resolve, reject) => {
            const textName = req.toLowerCase();
            db.query(`SELECT * FROM users WHERE LOWER(name) LIKE '%${textName}%' ORDER BY name ASC`, (err, result) => {
                if(!err) {
                    resolve({message: 'get all users success', status: 200, data: result.rows})
                }else{
                    reject({message: `get users error ${err}`, status: 500, data: []})
                }
            })
        })  
    },

    login: (req)=> {
        const {email, password} = req.body
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE email= '${email}'`, (err, result) => {
                if(!err) {
                    if(result?.rows?.length < 1){
                        reject({message: `email/password is wrong`, status: 400})
                    }else{
                        bcrypt.compare(password, result.rows[0].password, function(err, res){
                            if(!res){
                                reject({message: `email/password is wrong`, status: 400})
                            }else{
                                const {user_id, phone, username, role} = result?.rows[0]
                                const payload = {
                                    "user_id": user_id,
                                    "phone": phone,
                                    "username": username,
                                    "role": role 
                                }
                                jwt.sign(payload, process.env.SECRET_KEY, function(err, token){
                                    resolve({message: 'login successfully', status: 200, data: token})
                                })
                                // jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '15s'} , function(err, token){
                                //     resolve({message: 'login successfully', status: 200, data: token})
                                // })
                            }
                        })
                    }
                }else{
                    reject({message: `email/password is wrong`, status: 400})
                }
            })
        })
    },

    register: (req)=> {
        return new Promise((resolve, reject) => {
             const {password, email, phone} = req.body
            // const {name, phone, photo_profile, username, email, password, bio} = req.body
            db.query(`SELECT * FROM users WHERE phone= '${phone}' OR email = '${email}'`, (error, result) => {
                if(!error) {
                    // const checkUsername = result.rows[0] ? result.rows[0].username : null; 
                    const checkPhone = result.rows[0] ? result.rows[0].phone : null; 
                    const checkEmail = result.rows[0] ? result.rows[0].email : null; 
                    // console.log(checkPhone)
                    if((phone == null) || (email == null) || (password == null)) {
                        reject({message: `phone/email/password is required`, status: 400})
                    }else if((phone == checkPhone) || (email == checkEmail)) {
                        reject({message: `phone/email is exists`, status: 400})
                    }else{
                       
                        bcrypt.genSalt(10, function(saltError, salt){
                            bcrypt.hash(password, salt, function(hashingError, hash){
                                if(!hashingError){
                                    let newBody = {...req.body, password: hash}
                                    // resolve({message: newBody, status: 201})
                                    db.query('INSERT INTO users(password, email, phone) VALUES($1,$2,$3)', [hash, email, phone], (err, response) => {
                                        if(!err) {
                                            resolve({message: 'user has been created', status: 201, data: newBody})
                                        }else{
                                            reject({message: `create data failed ${err}`, status: 500, data: {}})
                                        }
                                    })
                                }else{
                                    reject({message: `hashing failed`, status: 500})
                                }
                            });
                        });
                    }
                }else{
                    reject({message: 'create data failed', status: 500, data: error})
                }
            })
        })
    },

}

module.exports = userModel