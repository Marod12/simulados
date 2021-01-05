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
        if ( user_id !== id ) {
          res.status(401).json({ error: 'Operation not permitted.' });
          break;
        }

        async () => {
          try {
              await client.connect();
              const database = client.db(process.env.Mongo_DB);
              const collection = database.collection("users");
  
              const result = await collection.findOne({ _id: { $eq: idObj } });

              res.json(result)
          } catch(err) {
            console.dir(err)
          } finally {
              await client.close();
          }
        }
        break
      // Update 
      case 'PUT':
        const { name } = req.body;
        
        async () => {
          try {
              await client.connect();
              const database = client.db(process.env.Mongo_DB);
              const collection = database.collection("users");
  
              await collection.updateOne( { _id: { $eq: idObj } }, {$set: { name: name }}, { multi: true } );
              
              const result = await collection.findOne({ _id: { $eq: idObj } });
              res.json(result)
          } catch(err) {
            console.dir(err)
          } finally {
              await client.close();
          }
        }
        break
      // DELETE
      case 'DELETE':
        if ( id === user_id ) {
          async () => {
            try {
                await client.connect();
                const database = client.db(process.env.Mongo_DB);
                const collection = database.collection("users");

                await collection.deleteOne({ _id: { $eq: idObj } });
                res.status(200).json({ message: 'Deletado com sucesso' });

            } catch(err) {
              console.dir(err)
            } finally {
                await client.close();
            }
          }
          break
        } 
        res.status(401).json({ error: 'Erro ao deletar'});
        break
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
  
export default handler;