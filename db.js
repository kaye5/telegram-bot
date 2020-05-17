require('dotenv').config()
const MongoClient = require("mongodb").MongoClient;
const URI = process.env.MONGO;
async function getDB(db){
    let client = await MongoClient.connect(
        URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    console.log('Connected to database')
    return client.db(db)
}

module.exports = {getDB}