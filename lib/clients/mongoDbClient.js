const mongodb = require('mongodb'),
  MongoClient = mongodb.MongoClient;

const url = "mongodb://localhost:27017/";

let instance;
let dbConnection;

class Mongo {
  constructor() {

    this.client = MongoClient.connect(url, function (err, db) {
      if (err) throw err;

      dbConnection = db;
      // console.log(db);
      return db;
    });
    console.log(this.client);

  }

  async executeSearchQuery(query, score) {
    const dbo = dbConnection.db("db");
    console.log(query);
    const response = await new Promise(((resolve, reject) => {
      dbo.collection("dataset").find(query, score).limit(8).toArray(function (err, result) {
        if (err) {
          console.log(err);
          reject();
        }
        console.log(result);
        resolve(result);
      });
    }));

    return response
  }

  async executeQuery(query) {
    const dbo = dbConnection.db("db");
    console.log(query);
    const response = await new Promise(((resolve, reject) => {
      dbo.collection("dataset").find(query).toArray(function (err, result) {
        if (err) {
          console.log(err);
          reject();
        }
        // console.log(result);
        resolve(result);
      });
    }));

    return response
  }

  async executeUpdateQuery(query, updateQuery) {
    const dbo = dbConnection.db("db");
    // const query = {Sponsor: "Clare Adamson MSP"};
    console.log(query);
    const response = await new Promise(((resolve, reject) => {
      dbo.collection("dataset").updateOne(query, updateQuery);
      resolve();
    }));

    return response
  }

  static getInstance() {

    if (!instance) {
      instance = new Mongo();
    }
    return instance;
  }

}

exports.getInstance = Mongo.getInstance;



