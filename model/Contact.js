const db = require('../helper/connector')

const contactModel = {
    getAllContact: (req)=> {
        const {limit=8, page=1} = req.query
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM contacts LIMIT ${limit} OFFSET ${(page-1) * limit}`, (err, result) => {
                if(result.rows.length < 1){
                    reject({message: `contact not found`, status: 400, data: []})
                }
                if(!err) {
                    resolve({message: 'get all contacts success', status: 200, data: result.rows})
                }else{
                    reject({message: `get contacts error ${err}`, status: 500, data: []})
                }
            })
        })
    },

    getContactById: (req)=> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM contacts WHERE contact_id = ${req.params.id}`, (err, result) => {
                if(!err) {
                    resolve({message: `get contact id: ${req.params.id} success`, status: 200, data: result.rows[0]})
                }else{
                    reject({message: `get contact failed`, status: 500, data: {}})
                }
            })
        })
    },

    refreshContact: ()=> {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO contacts(name, phone, username) SELECT t1.name, t1.phone, t1.username FROM users t1 LEFT JOIN contacts ON contacts.username = t1.username WHERE contacts.username IS NULL RETURNING *`, (error, result) => {
                if(result.rows.length < 1){
                    reject({message: `there is no new contact`, status: 400, data: []})
                }
                if(!error) { 
                    resolve({message: 'contact has been created', status: 201, data: result.rows})
                }else{
                    reject({message: 'create data failed', status: 500, data: error})
                }
            })
        })
    },

    searchContactByName: (req)=> {
        return new Promise((resolve, reject) => {
            const textName = req.toLowerCase();
            db.query(`SELECT * FROM contacts WHERE LOWER(name) LIKE '%${textName}%' ORDER BY name ASC`, (err, result) => {
                if(!err) {
                    resolve({message: 'get all contacts success', status: 200, data: result.rows})
                }else{
                    reject({message: `get contacts error ${err}`, status: 500, data: []})
                }
            })
        })  
    },
}

module.exports = contactModel