const formResponse = require('../helper/formResponse')
const contactListModel = require('../model/ContactListEachUser');

const contactListController = {
    getContactListByUserId: async(req, res) => {
        try {
            const result = await contactListModel.getContactListByUserId(req)
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

    updateContactNameById: async(req, res) => {
        try {
            const result = await contactListModel.updateContactNameById(req)
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

    deleteContactListById: async(req, res) => {
        try {
            const result = await contactListModel.deleteContactListById(req.params)
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

    addNewContactList: async(req, res) => {
        try {
            const result = await contactListModel.addNewContactList(req);
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

    refreshContactList: async(req, res) => {
        try {
            const result = await contactModel.refreshContactList();
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

}

module.exports = contactListController