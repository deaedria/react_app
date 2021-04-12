const formResponse = require('../helper/formResponse')
const messageListModel = require('../model/Message');

const messageListController = {
    getMessageByUserIdAndContactId: async(req, res) => {
        try {
            const result = await messageListModel.getMessageByUserIdAndContactId(req)
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

}

module.exports = messageListController