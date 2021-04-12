const formResponse = require('../helper/formResponse')
const userModel = require('../model/User');

const userController = {
    getUser: async(req, res) => {
        try {
            const result = await userModel.getUser(req)
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

    getAllUser: async(req, res) => {
        try {
            const result = await userModel.getAllUser(req)
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },


    // getById: async(req, res) => {
    //     try {
    //         const result = await userModel.getById(req.params)
    //         formResponse(result, res)
    //     } catch (error) {
    //         formResponse(error, res)
    //     }
    // },

    deleteUser: async(req, res) => {
        try {
            const result = await userModel.deleteUser(req.params)
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

    addNewUser: async(req, res) => {
        try {
            const result = await userModel.addNewUser(req);
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

    updateUser: async(req, res) => {

        try {
            const result = await userModel.updateUser(req, res);
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

    searchUserByName: async(req, res) => {
        try {
            const result = await userModel.searchUserByName(req.query.name);
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

    login: async(req, res) => {
        try {
            const result = await userModel.login(req);
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },

    register: async(req, res) => {
        try {
            const result = await userModel.register(req);
            formResponse(result, res)
        } catch (error) {
            formResponse(error, res)
        }
    },
}

module.exports = userController