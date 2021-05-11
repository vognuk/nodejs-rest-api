/*
All errors from under functions 
handling in try/catch constructions from 
relevant routers (in /routes) and then in app.js 
*/

const Contacts = require('./schemas/contact')

/*
This func is multipurpose. It get 
and return collection with name "name" from db.
Using Collection() from 
https://mongodb.github.io/node-mongodb-native/api-generated/collection.html 
*/
// const getCollection = async (db, name) => {
//   const client = await db
//   const collection = client.db().collection('contacts')

//   return collection
// }

/*
Retun all documents from collection 
"contacts" in DB "db-contacts". 
 */

const listContacts = async (userId, query) => {
  const results = await Contacts
    .find({
      owner: userId
    })
    .populate({
      path: 'owner',
      select: 'name email -_id',
    })

  return results
}

/*
Retun document by id from collection 
"contacts" in DB "db-contacts". 
 Using https://mongodb.github.io/node-mongodb-native/api-bson-generated/objectid.html?highlight=objectid
 */

const getContactById = async (userId, id) => {
  const result = await Contacts.findOne({ _id: id, owner: userId }).populate({
    path: 'owner',
    select: 'name email gender -_id',
  })
  return result
}

/*
This func let to remove document 
from DB by id.
*/

const removeContact = async (userId, id) => {
  const result = await Contacts.findByIdAndRemove({ _id: id, owner: userId })
  return result
}

/*
This func let to add new contact. 
If key "favourite" has empty value, 
there will be set "false" by default.
*/

const addContact = async (userId, body) => {
  const result = await Contacts.create({ ...body, owner: userId })
  return result
}

/*
This func update contact fields in "db-contacts".
*/

const updateContact = async (userId, id, body) => {
  const result = await Contacts.findByIdAndUpdate(
    { _id: id, owner: userId },
    { ...body },
    { new: true }
  )
  return result
}

/*
This func recive field "favourite" 
with value and set it to contact document in db.
*/
const updateStatusContact = async (userId, id, body) => {
  if (typeof body['favorite'] !== "undefined" && Object.keys(body).length === 1) {
    // const collection = await getCollection(db, 'contacts')
    // const objectID = new ObjectID(id)
    const result = await Contacts.findOneAndUpdate(
      { _id: id, owner: userId },
      { ...body },
      { new: true }
    )

    return result
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
}
