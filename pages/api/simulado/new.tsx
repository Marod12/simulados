import Cors from 'cors'
import {ObjectID} from 'mongodb';

interface Simulados { 
  _id: ObjectID,
  user: string,
  title: string,
  qtQuestoes: string,
  nota: string,
  qCorretas: Array<ObjectID>,
  qErradas: Array<ObjectID>,
  qNull: Array<ObjectID>
}

// Initializing the cors middleware
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
    const { title, qtQuestoes, nota, qCorretas, qErradas, qNull } = req.body;
    const user_id = req.headers.authorization;

    const qCQuerry = [];
    const qEQuerry = [];
    const qNQuerry = [];

    qCorretas.forEach(qC);
    function qC(i) {
      const n_id = new ObjectID(i.questao);
      const data = { questao: n_id, pergunta: i.pergunta, resposta: i.resposta, minhaResposta: i.minhaResposta, materia: i.materia };
      qCQuerry.push(data);
    }

    qErradas.forEach(qE);
    function qE(i) {
      const n_id = new ObjectID(i.questao);
      const data = { questao: n_id, pergunta: i.pergunta, resposta: i.resposta, minhaResposta: i.minhaResposta, materia: i.materia };
      qEQuerry.push(data);
    }

    qNull.forEach(qN);
    function qN(i) {
      const n_id = new ObjectID(i.questao);
      const data = { questao: n_id, pergunta: i.pergunta, resposta: i.resposta, minhaResposta: i.minhaResposta, materia: i.materia };     
      qNQuerry.push(data);
    }
    
    //console.log(qCQuerry);
    //console.log(qEQuerry);
    //console.log(qNQuerry);

    const query = { _id: new ObjectID, user: new ObjectID(user_id), title: title, qtQuestoes: qtQuestoes, nota: nota, qCorretas: qCQuerry, qErradas: qEQuerry, qNull: qNQuerry };

    const { MongoClient } = require("mongodb");

    const client = new MongoClient(process.env.MONGO_URI);
    
    try {
        await client.connect();
        const database = client.db('simulados');
        const collection = database.collection("simulado");

        await collection.insertOne(query);

        res.json({ title })
    } catch(err) {
      console.dir(err)
    } finally {
        await client.close();
    }

}

export default handler;