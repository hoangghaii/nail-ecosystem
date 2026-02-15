const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://nail_salon_api_user:8RXKNkNpn8BLmhc5@cluster0.m6ia2tj.mongodb.net/nail-salon-dev?retryWrites=true&w=majority';

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
