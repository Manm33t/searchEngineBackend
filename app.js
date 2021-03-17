const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const assignmentAPI = require('./lib/apis/searchAPIs').getInstance();
const getIP = require('ipware')().get_ip;
const cors = require('cors');


const reqConverter = (req) => {
  let params = {};
  if (req.method.toLowerCase() === 'get') {
    ({params} = req);
  }
  if (['put', 'post'].includes(req.method.toLowerCase())) {
    ({params} = req);
    params.post = req.body;
  }
  params.ip = getIP(req).clientIp;
  params.headers = req.headers;
  params.query = req.query;
  params.middlewareStorage = req.middlewareStorage;
  params.files = req.files;
  params.authData = req.authData || {};
  return params;
};

app.use(bodyParser.json({limit: '10mb'}));
app.use(cors());

app.post('/search', async (req, res) => {
  const params = reqConverter(req);
  console.log(params);
  const response = await assignmentAPI.fullTextSearch(params);
  res.send(response);
});


app.post('/getDataById', async (req, res) => {
  const params = reqConverter(req);
  console.log(params);
  const response = await assignmentAPI.getItemById(params);
  res.send(response);
});
app.post('/updateToDictionary', async (req, res) => {
  const params = reqConverter(req);
  console.log(params);
  const response = await assignmentAPI.updateToDictionary(params);
  res.send(response);
});


app.listen(7000, (err) => {
  if (err) {
    console.log('something went wrong')
  }
  console.log('server listening on port: 7000')
});
