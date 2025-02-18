const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    MongoClient.connect(
        'mongodb+srv://duartecgomes:teste7723@cluster0.752m5.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0'
    )
    .then(client => {
        console.log('Connected');
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}

const getDB = () => {
    if (_db){
        return _dg;
    }
    throw 'no database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
