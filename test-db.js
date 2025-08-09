
require('dotenv').config({ path: './.env.local' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB Atlas!');
    const db = client.db("limitbreakers");
    const collections = await db.listCollections().toArray();
    console.log("Collections found:", collections.map(c => c.name));
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas.");
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
