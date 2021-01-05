import Cors from 'cors'

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
    const { code } = req.body;

    const { MongoClient } = require("mongodb");

    const client = new MongoClient(process.env.Mongo_URI);

    async function run() {
        try {
            await client.connect();
            const database = client.db(process.env.Mongo_DB);
            const collection = database.collection("users");

            const result = await collection.findOne({ code: { $eq: code } });

            if (!result) {
                res.status(400).json({ error: 'Não encotramos nenhum usuario com esse Código' });
            }

            res.json(result)
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
}

export default handler;