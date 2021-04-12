const db = require('../helper/connector')

const contactListModel = {
    getContactListByUserId: (req)=> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT contacts.phone, contacts_list.contact_name FROM contacts LEFT JOIN contacts_list ON contacts_list.user_id = ${req.query.id} AND contacts_list.contact_id = contacts.contact_id WHERE contacts_list.contact_id is not null`, (err, result) => {
                if(result.rows.length < 1){
                    reject({message: `contact list not found`, status: 400, data: []})
                }
                if(!err) {
                    resolve({message: 'get all contacts success', status: 200, data: result.rows})
                }else{
                    reject({message: `get contacts error ${err}`, status: 500, data: []})
                }
            })
        })
    },

    updateContactNameById: (req, res)=> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM contacts_list WHERE cl_id = '${req.params.id}'`, (error, result) => {
                if(result.rows == '' || result.rows.length < 1) {
                    reject({message: `contact id not found`, status: 400, data: {}})
                }
                if(!error) {
                    const {
                        contact_name = result.rows[0]?.contact_name, 
                    } = req.body
                    const {id} = req.params;
                    db.query("UPDATE contacts_list SET contact_name=$1 WHERE cl_id=$2 RETURNING *", [contact_name, id], (err, response) => {                        
                        if(!err){ 
                            resolve({message: `update contact id ${id} success`, status: 200, data: response.rows[0]})
                        }else{
                            reject({message: 'update data failed', status: 500, data: err})
                        }
                    })
                }else{
                    reject({message: 'update data failed', status: 500, data: error})
                }           
            })
        })        
    },

    deleteContactListById: (req)=> {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM contacts_list WHERE cl_id = '${req.id}' RETURNING *`, (err, result) => {
                if(!err) {
                    const checkId = result.rows[0]?.cl_id;
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

    addNewContactList: (req, res)=> {
        return new Promise((resolve, reject) => {
        // const {phone, name} = req.body
        // console.log(req.query.id) 
            // db.query(`SELECT contacts.phone, contacts.contact_id, contacts_list.contact_id, contacts_list.user_id FROM contacts, contacts_list where contacts_list.user_id = ${req.query.id} AND contacts.phone = '${req.body.phone}'`, (error, result) => {
            db.query(`SELECT contacts.contact_id FROM contacts WHERE contacts.phone = '${req.body.phone}'`, (error, result) => {
                if(!error) {
                    const value = result.rows[0].contact_id
                    if(result.rows == '' || result.rows.length < 1){
                        reject({message: `${req.body.contact_name} is not on this app yet`, status: 400})
                    }else{
                        db.query(`SELECT * FROM contacts_list where contacts_list.user_id = ${req.query.id} AND contacts_list.contact_id = ${value}`, (error1, result1) => {
                            if(!error1){
                                if(result1.rows.length > 0){
                                    reject({message: `this contact is exist`, status: 400})
                                }else{
                                    db.query('INSERT INTO contacts_list(contact_id, user_id, contact_name) VALUES ($1, $2, $3) RETURNING *', [value, req.query.id, req.body.contact_name], (err, response) => {
                                        if(!err) {
                                            resolve({message: 'user has been created', status: 201, data: response.rows[0]})
                                        }else{
                                            reject({message: 'create data failed', status: 500, data: err})
                                        }
                                    })
                                }
                            }
                        })
                    }
                }else{
                    reject({message: 'create data failed', status: 500, data: error})
                }
            })
        })
    },

    // refreshContactList: ()=> {
    //     return new Promise((resolve, reject) => {
    //         db.query(`SELECT contacts.contact_id, contacts_list.contact_id FROM contacts, contacts_list WHERE contacts.phone = '${req.body.phone}'`, (error, result) => {
    //             if(result.rows.length < 1){
    //                 reject({message: `there is no new contact`, status: 400, data: []})
    //             }
    //             if(!error) { 
    //                 resolve({message: 'contact has been created', status: 201, data: result.rows})
    //             }else{
    //                 reject({message: 'create data failed', status: 500, data: error})
    //             }
    //         })
    //     })
    // },
}

module.exports = contactListModel