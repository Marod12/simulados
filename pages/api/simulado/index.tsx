// Pega todos os simulados
import Cors from 'cors'
import {ObjectID} from 'mongodb';

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors)
    const user_id = req.headers.authorization;

    const { MongoClient } = require("mongodb");

    const client = new MongoClient(process.env.MONGO_URL);

    try {
        await client.connect();
        const database = client.db('simulados');
        const collection = database.collection("simulado");

        const result = await collection.find({ user: { $eq: new ObjectID(user_id) } }).toArray();

        res.json(result);
        
    } catch(err) {
      console.dir(err)
    } finally {
        await client.close();
    }
}

export default handler;