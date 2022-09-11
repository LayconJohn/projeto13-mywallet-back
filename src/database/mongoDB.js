import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;
mongoClient.connect().then(()=> {
    db = mongoClient.db("mywallet");
})

export default db;