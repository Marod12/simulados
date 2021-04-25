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
  
    const client = new MongoClient(process.env.MONGO_URL);

    const user_id = req.headers.authorization;

    if ( user_id !== id ) {
      res.status(401).json({ error: 'Operation not permitted.' });
    } else {
      const crypto = require('crypto');
      const decipher = crypto.createDecipher('aes256', 'Hi Ron');
      let dexx = decipher.update(id, 'hex', 'utf8');
      dexx += decipher.final('utf8');

      var idObj = new ObjectID(dexx);
    }

    switch (method) {
      // Get
      case 'GET':
        try {
            await client.connect();
            const database = client.db('simulados');
            const collection = database.collection("users");

            const result = await collection.findOne({ _id: { $eq: idObj } });

            res.json({
              code: result.code
            })
        } catch(err) {
          console.dir(err)
        } finally {
            await client.close();
        }
        break
      // Update 
      case 'PUT':
        const { name } = req.body;
        
        try {
            await client.connect();
            const database = client.db('simulados');
            const collection = database.collection("users");

            await collection.updateOne( { _id: { $eq: idObj } }, {$set: { name: name }}, { multi: true } );
            
            const result = await collection.findOne({ _id: { $eq: idObj } });
            res.json(result)
        } catch(err) {
          console.dir(err)
        } finally {
            await client.close();
        }
        break
      // DELETE
      case 'DELETE':
        if ( id === user_id ) {
          try {
              await client.connect();
              const database = client.db('simulados');
              const collection = database.collection("users");

              await collection.deleteOne({ _id: { $eq: idObj } });
              res.status(200).json({ message: 'Deletado com sucesso' });

          } catch(err) {
            console.dir(err)
          } finally {
              await client.close();
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