import Cors from 'cors'
import {ObjectID} from 'mongodb';

const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
})

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
  await runMiddleware(req, res, cors)
    const { name } = req.body;

    const crypto = require('crypto');
    const code = crypto.randomBytes(4).toString('HEX');

    const doc = { _id: new ObjectID, name: name, code: code };

    const { MongoClient } = require("mongodb");

    const client = new MongoClient(process.env.Mongo_URI);

    async () => {
        try {
            await client.connect();
            const database = client.db(process.env.Mongo_DB);
            const collection = database.collection("users");
            await collection.insertOne(doc);

            res.json({ code })
        } catch(err) {
          console.dir(err)
        } finally {
            await client.close();
        }
    }
}

export default handler;