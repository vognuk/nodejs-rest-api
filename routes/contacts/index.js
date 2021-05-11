const express = require('express')
const router = express.Router()
const contactsController = require('../../controllers/contacts')

const {
  addContactSchema,
  updateContactSchema,
  updateContactFavoriteStatusSchema
} = require('./valid-contacts-router')

const guard = require('../../helper/guard')

router
  .get('/', guard, contactsController.getAllContacts)
  .post('/', guard, addContactSchema, contactsController.addContact)

router
  .get('/:contactId', guard, contactsController.getContactByID)
  .delete('/:contactId', guard, contactsController.deleteContact)
  .put('/:contactId', guard, updateContactSchema, contactsController.updateContact)
  .patch('/:contactId', guard, updateContactSchema, contactsController.patchContact)

router.patch('/:contactId/favorite', guard, updateContactFavoriteStatusSchema, contactsController.updateFavoriteStatusOfContact)

module.exports = router
