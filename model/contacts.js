/*
All errors from under functions 
handling in try/catch constructions from 
relevant routers (in /routes) and then in app.js 
*/
const db = require('./db')
const { Db } = require('mongodb')
const { ObjectID } = require('mongodb')

/*
This func is multipurpose. It get 
and return collection with name "name" from db.
Using Collection() from 
https://mongodb.github.io/node-mongodb-native/api-generated/collection.html 
*/
const getCollection = async (db, name) => {
  const client = await db
  const collection = client.db().collection('contacts')

  return collection
}

/*
Retun all documents from collection 
"contacts" in DB "db-contacts". 
 */
const listContacts = async () => {
  const collection = await getCollection(db, 'contacts')
  const results = await collection.find().toArray()

  return results
}

/*
Retun document by id from collection 
"contacts" in DB "db-contacts". 
 Using https://mongodb.github.io/node-mongodb-native/api-bson-generated/objectid.html?highlight=objectid
 */
const getContactById = async (id) => {
  const collection = await getCollection(db, 'contacts')
  const ObjectID = new ObjectID(id)
  const { result } = await collection.find().toArray()

  return result
}

/*
This func let to remove document 
from DB by id.
*/
const removeContact = async (id) => {
  const collection = await getCollection(db, 'contacts')
  const objectID = new ObjectID(id)
  const { value: result } = await collection.findOneAndDelete({ _id: objectID })

  return result
}

/*
This func let to add new contact. 
If key "favourite" has empty value, 
there will be set "false" by default.
*/
const addContact = async (body) => {
  const favoriteDefault = { "favorite": false }

  if (typeof body['favorite'] === "undefined") {
    Object.assign(body, favoriteDefault)
  }

  const collection = await getCollection(db, 'contacts')
  const record = { ...body };
  const { ops: [result] } = await collection.insertOne(record)

  return record
}

/*
This func update contact fields in "db-contacts".
*/
const updateContact = async (id, body) => {
  const collection = await getCollection(db, 'contacts')
  const objectID = new ObjectID(id)
  const { value: result } = await collection.findOneAndUpdate(
    { _id: objectID },
    { $set: body }
  )

  return result
}

/*
This func recive field "favourite" 
with value and set it to contact document in db.
*/
const updateStatusContact = async (id, body) => {
  if (typeof body['favorite'] !== "undefined" && Object.keys(body).length === 1) {
    const collection = await getCollection(db, 'contacts')
    const objectID = new ObjectID(id)
    const { value: result } = await collection.findOneAndUpdate(
      { _id: objectID },
      { $set: body }
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
