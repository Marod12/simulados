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
    const crypto = require('crypto');
    const decipher = crypto.createDecipher('aes256', 'Hi Ron');
    let dexx = decipher.update(req.headers.authorization, 'hex', 'utf8');
    dexx += decipher.final('utf8');

    const user_id = dexx;

    const { MongoClient } = require("mongodb");

    const client = new MongoClient(process.env.MONGO_URL);

    try {
        await client.connect();
        const database = client.db('simulados');
        const collection = database.collection("questoes");

        const result = await collection.find({ user: { $eq: new ObjectID(user_id) } }).toArray();

        const retorno = []

        result.forEach(item => {
          retorno.push({
            _id: item._id,
            materia: item.materia,
            questao: item.questao,
            resposta: item.resposta
          })
        })

        res.json(retorno)

    } catch(err) {
      console.dir(err)
    } finally {
        await client.close();
    }
}

export default handler;