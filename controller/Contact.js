const formResponse = require('../helper/formResponse')
const contactModel = require('../model/Contact');

const contactController = {
    getAllContact: async(req, res) => {
        try {
            const result = await contactModel.getAllContact(req)
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

    getContactById: async(req, res) => {
        try {
            const result = await contactModel.getContactById(req)
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

    refreshContact: async(req, res) => {
        try {
            const result = await contactModel.refreshContact();
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

    searchContactByName: async(req, res) => {
        try {
            const result = await contactModel.searchContactByName(req.query.name);
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },
}

module.exports = contactController