const express = require('express')
const router = express.Router()
const contactsController = require('../../controllers/contacts')

const {
  addContactSchema,
  updateContactSchema,
  updateContactFavoriteStatusSchema
} = require('./valid-contacts-router')

router
  .get('/', contactsController.getAllContacts)
  .post('/', addContactSchema, contactsController.addContact)

router
  .get('/:contactId', contactsController.getContactByID)
  .delete('/:contactId', contactsController.deleteContact)
  .put('/:contactId', updateContactSchema, contactsController.updateContact)
  .patch('/:contactId', updateContactSchema, contactsController.patchContact)

router.patch('/:contactId/favorite', updateContactFavoriteStatusSchema, contactsController.updateFavoriteStatusOfContact)

module.exports = router;
