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
    const {
        query: { id },
        method,
    } = req

    // Run the middleware
    await runMiddleware(req, res, cors)

    const { MongoClient } = require("mongodb");
  
    const client = new MongoClient(process.env.Mongo_URI);

    const user_id = req.headers.authorization;
    const idObj = new ObjectID(id);

    switch (method) {
      // Get
      case 'GET':
        async function runGet() {
          try {
              await client.connect();
              const database = client.db(process.env.Mongo_DB);
              const collection = database.collection("simulado");
  
              const result = await collection.findOne({ _id: { $eq: idObj } });
              /*const result = await collection.aggregate([ 
                { $match: { _id: { $eq: idObj } } },
                 {
                  $lookup: {
                      from: 'questoes',
                      localField: 'qSimulado',
                      foreignField: '_id',
                      as: 'detailQuestao'
                  } } 
              ]).toArray(); */

              //console.log(result);
              res.json(result);
          } finally {
              await client.close();
          }
        }
        runGet().catch(console.dir);
        break
      // DELETE
      case 'DELETE':
        async function runDelete() {
            try {
                await client.connect();
                const database = client.db(process.env.Mongo_DB);
                const collection = database.collection("simulado");
    
                const question_id = await collection.findOne({ _id: { $eq: idObj } });
                
                if ( question_id.user !== user_id ) {
                    res.status(401).json({ error: 'Operation not permitted.' });
                }

                await collection.deleteOne({ _id: { $eq: idObj } });
                
                res.status(204).send();

            } finally {
                await client.close();
            }
        }
        runDelete().catch(console.dir);
        break
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
  
export default handler;