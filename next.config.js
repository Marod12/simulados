module.exports = {
    env: {
        Mongo_URI: (() => {
            return 'mongodb+srv://Marod:ip0HgSBLMy6tv8nA@mrscluster.vbnbd.mongodb.net/<dbname>?retryWrites=true&w=majority'
        })(),
        Mongo_DB: (() => {
            return 'simulados'
        })()
    },
}