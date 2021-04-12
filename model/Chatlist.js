const db = require('../helper/connector')

const chatListModel = {
    getChatListByUserId: (req)=> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT TO_CHAR(last_time, 'HH24:MI'), contacts_list.contact_name, contacts_list.friend_photo, single_chat.contact_id, single_chat.notification, single_chat.last_message FROM contacts_list LEFT JOIN single_chat ON single_chat.user_id = ${req.query.id} AND single_chat.user_id = contacts_list.user_id AND single_chat.contact_id = contacts_list.contact_id WHERE single_chat.contact_id is not null`, (err, result) => {
                if(result?.rows.length < 1 ){
                    reject({message: `chat list not found`, status: 400, data: []})
                }
                if(!err) {
                    resolve({message: 'get all chat list success', status: 200, data: result.rows})
                }else{
                    reject({message: `get chat list error ${err}`, status: 500, data: []})
                }
            })
        })
    },

}

module.exports = chatListModel