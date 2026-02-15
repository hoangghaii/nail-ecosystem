const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

async function deleteServices() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('services').deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} services`);
  } finally {
    await client.close();
  }
}

deleteServices().catch(console.error);
