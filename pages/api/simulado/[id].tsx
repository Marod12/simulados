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
    
    const cryptod = require('crypto');
    const decipher = cryptod.createDecipher('aes256', 'Hi Ron');
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
            const collection = database.collection("simulado");

            const result = await collection.findOne({ _id: { $eq: idObj } });
            const resultAll = await collection.find({ user: { $eq: new ObjectID(user_id) } }).toArray();

            const allQuestions = [];
            const stastQuestion = [];
            const qtCorretas = [];
            const qtErradas = [];
            const qtNulls = [];

            result.qCorretas.forEach(item => {
              allQuestions.push(item.questao);
            })

            result.qErradas.forEach(item => {
              allQuestions.push(item.questao);
            })

            result.qNull.forEach(item => {
              allQuestions.push(item.questao)
            })

            resultAll.forEach(i => {
              i.qCorretas.forEach(c => {
                qtCorretas.push(`${c.questao}`);
              });
              i.qErradas.forEach(e => {
                qtErradas.push(`${e.questao}`);
              });
              i.qNull.forEach(n => {
                qtNulls.push(`${n.questao}`);
              });
            })

            allQuestions.forEach(i => {
              const statistic = {id: i, data:{c: 0, e: 0, n: 0}}

              qtCorretas.forEach(cc => {
                if ( cc === `${i}` ) {
                  statistic.data.c += 1
                }
              })

              qtErradas.forEach(ee => {
                if ( ee === `${i}` ) {
                  statistic.data.e += 1
                }
              })

              qtNulls.forEach(nn => {
                if ( nn === `${i}` ) {
                  statistic.data.n += 1
                }
              })

              stastQuestion.push(statistic)
            })

            stastQuestion.forEach(i => {
              result.qCorretas.forEach(item => {
                if ( item.questao === i.id ) {
                  Object.assign(item, {statistic: i.data})
                }
              })

              result.qErradas.forEach(item => {
                if ( item.questao === i.id ) {
                  Object.assign(item, {statistic: i.data})
                }
              })

              result.qNull.forEach(item => {
                if ( item.questao === i.id ) {
                  Object.assign(item, {statistic: i.data})
                }
              })
            })
          
            res.json({
              _id: result._id, 
              title: result.title, 
              nota: result.nota, 
              qtQuestoes: result.qtQuestoes,
              qCorretas: result.qCorretas,
              qErradas: result.qErradas,
              qNull: result.qNull, 
            });
        } catch(err) {
          console.dir(err)
        } finally {
          await client.close();
        }
        break
      // DELETE
      case 'DELETE':
        try {
            await client.connect();
            const database = client.db('simulados');
            const collection = database.collection("simulado");

            const simulado = await collection.findOne({ _id: { $eq: idObj } });

            console.log(user_id, simulado.user)
            
            if ( `${simulado.user}` !== user_id ) {
                res.status(401).json({ error: 'Operation not permitted.' });
            } else {
              await collection.deleteOne({ _id: { $eq: idObj } });
              res.status(200).json({ message: 'Simulado deletado com sucesso'});
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