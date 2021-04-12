const db = require('../helper/connector')

const messageListModel = {
    getMessageByUserIdAndContactId: (req)=> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT single_chat_message.content, single_chat_message.sender_username, single_chat_message.receiver_username, single_chat_message.time, contacts_list.contact_name, contacts_list.friend_photo, users.photo_profile 
            FROM contacts_list LEFT JOIN single_chat_message ON contacts_list.contact_id = ${req.query.contact_id} AND contacts_list.user_id = ${req.query.id} AND single_chat_message.contact_account = ${req.query.contact_id} AND single_chat_message.user_account = ${req.query.id} JOIN users
            ON users.user_id = ${req.query.id} WHERE single_chat_message.content IS NOT NULL`, (err, result) => {
                if(result?.rows.length < 1 ){
                    reject({message: `message not found`, status: 400, data: []})
                }
                if(!err) {
                    resolve({message: 'get all message success', status: 200, data: result.rows})
                }else{
                    reject({message: `get message error ${err}`, status: 500, data: []})
                }
            })
        })
    },

}

module.exports = messageListModel