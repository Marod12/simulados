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
    const { questao, resposta, materia } = req.body;
    const user_id = req.headers.authorization;

    const doc = { _id: new ObjectID, user: new ObjectID(user_id), questao: questao, resposta: resposta, materia: materia };

    const { MongoClient } = require("mongodb");

    const client = new MongoClient(process.env.Mongo_URI);

    async function run() {
        try {
            await client.connect();
            const database = client.db(process.env.Mongo_DB);
            const collection = database.collection("questoes");
            await collection.insertOne(doc);

            //res.json(result.ops[0]);
            res.json({ menssage: 'Questão adicionada com sucesso' });
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
}

export default handler;