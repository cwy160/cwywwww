const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

let latestData = '';

app.use(cors());      
app.use(bodyParser.json());

app.post('/send', (req, res) => {
  latestData = req.body.data || '';
  console.log('收到：', latestData);
  res.sendStatus(200);
});

app.get('/latest', (req, res) => {
  res.json({ data: latestData });
  latestData = '';
});

app.listen(port, () => {
  console.log(`伺服器啟動：http://localhost:${port}`);
});
