const Contacts = require('../model/contacts.js')

const getAllContacts = async (req, res, next) => {
    try {
        userId = req.user?.id //if there is no user, return undefind
        const contacts = await Contacts.listContacts(userId, req.query);
        return res.json({
            status: 'success',
            code: 200,
            data: {
                contacts
            },
        });
    } catch (e) {
        next(e);
    }
}

const getContactByID = async (req, res, next) => {
    try {
        const userId = req.user?.id
        const contact = await Contacts.getContactById(userId, req.params.contactId)
        console.log(contact)
        if (contact) {
            return res.json({
                status: 'success',
                code: 201,
                data: {
                    contact
                },
            });
        } else {
            return res.status(404).json({
                status: 'error',
                code: 404,
                data: 'Not found',
            });
        }
    } catch (e) {
        next(e);
    }
}

const addContact = async (req, res, next) => {
    try {
        const userId = req.user?.id
        const contact = await Contacts.addContact(userId, req.body);
        return res.status(201).json({
            status: 'success',
            code: 201,
            data: {
                contact
            },
        });
    } catch (e) {
        next(e);
    }
}

const deleteContact = async (req, res, next) => {
    try {
        const userId = req.user?.id
        const contact = await Contacts.removeContact(userId, req.params.contactId);
        if (contact) {
            return res.json({
                status: 'success',
                code: 201,
                message: 'Contact deleted',
            });
        } else {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: 'Not found',
            });
        }
    } catch (e) {
        next(e);
    }
}

const updateContact = async (req, res, next) => {
    try {
        const userId = req.user?.id
        const contact = await Contacts.updateContact(
            userId,
            req.params.contactId,
            req.body
        );
        if (contact) {
            return res.json({
                status: 'success',
                code: 200,
                data: {
                    contact
                },
            });
        } else {
            return res.status(404).json({
                status: 'error',
                code: 404,
                data: 'Not found',
            });
        }
    } catch (e) {
        next(e);
    }
}

const patchContact = async (req, res, next) => {
    try {
        const contact = await Contacts.updateContact(
            req.params.contactId,
            req.body
        );
        if (contact) {
            return res.json({
                status: 'success',
                code: 201,
                data: {
                    contact
                },
            });
        } else {
            return res.status(404).json({
                status: 'error',
                code: 404,
                data: 'Not found',
            });
        }
    } catch (e) {
        next(e);
    }
}

const updateFavoriteStatusOfContact = async (req, res, next) => {
    try {
        const userId = req.user?.id
        const contact = await Contacts.updateStatusContact(
            userId,
            req.params.contactId,
            req.body
        )
        if (contact) {
            return res.json({
                status: 'success',
                code: 200,
                data: {
                    contact
                },
            });
        } else {
            return res.status(404).json({
                status: 'error',
                code: 404,
                data: 'Not found',
                message: 'missing field favorite'
            });
        }
    } catch (e) {
        next(e);
    }
}

module.exports = {
    getAllContacts,
    getContactByID,
    addContact,
    deleteContact,
    updateContact,
    patchContact,
    updateFavoriteStatusOfContact
}
