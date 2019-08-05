'use strict';

const mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'serverless',
  password : 'serverless',
  database : 'serverless-test'
});

const getPeopleDataPromise = new Promise((resolve, reject) => {
  connection.connect();

  connection.query('SELECT * FROM people', (error, results, fields) => {
    if (error) throw error;
    resolve(results);
  });

  connection.end();
});

module.exports.helloWorld = (event, context, callback) => {
  var response = {};

  getPeopleDataPromise.then(
    (resolvedValue) => {
      response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify(resolvedValue),
      };

    }, (error) => {
      response = {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify(error),
      };

  }).finally(
    () => {
      callback(null, response);
    }
  );

};
