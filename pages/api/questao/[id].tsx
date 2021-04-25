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

    const crypto = require('crypto');
    const decipher = crypto.createDecipher('aes256', 'Hi Ron');
    let dexx = decipher.update(req.headers.authorization, 'hex', 'utf8');
    dexx += decipher.final('utf8');

    const user_id = dexx;
    const idObj = new ObjectID(id);

    switch (method) {
      // Get
      case 'GET':
        try {
            await client.connect();
            const database = client.db('simulados');
            const collection = database.collection("questoes");

            const result = await collection.findOne({ _id: { $eq: idObj } });

            if (`${result.user}` === user_id) {
              res.json({
                _id: result._id,
                materia: result.materia,
                questao: result.questao,
                resposta: result.resposta
              })
            } else {
              res.status(400);
            }

        } catch(err) {
          console.dir(err)
        } finally {
            await client.close();
        }
        break
      // Update 
      case 'PUT':
        const { questao, resposta, materia } = req.body;
        
        try {
            await client.connect();
            const database = client.db('simulados');
            const collection = database.collection("questoes");

            await collection.updateOne( { _id: { $eq: idObj } }, {$set: { questao: questao, resposta: resposta, materia: materia }}, { multi: true } );
            
            const result = await collection.findOne({ _id: { $eq: idObj } });
            
            if (`${result.user}` === user_id) {
              res.json({
                _id: result._id,
                materia: result.materia,
                questao: result.questao,
                resposta: result.resposta
              })
            } else {
              res.status(400);
            }
        } catch(err) {
          console.dir(err)
        } finally {
            await client.close();
        }
        break
      // DELETE
      case 'DELETE':
        try{
          await client.connect();
          const database = client.db('simulados');
          const collection = database.collection("questoes");

          const result = await collection.findOne({ _id: { $eq: idObj } });

          if (`${result.user}` === user_id) {
            await collection.deleteOne({ _id: { $eq: idObj } });
            res.status(200).json({ message: 'Questão deletada com sucesso'});
          } else {
            res.status(400);
          }
        } catch(err) {
          console.dir(err)
        } finally {
            await client.close();
        }
        break
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
  
export default handler;