const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let latestData = '';
let lockStatus = {}; // motor1: true, motor2: false...

app.post('/send', (req, res) => {
  const { data } = req.body;
  latestData = data;
  res.sendStatus(200);
});

app.get('/latest', (req, res) => {
  res.json({ data: latestData });
  latestData = ''; // 清空訊號
});

app.post('/lock', (req, res) => {
  const { motor } = req.body;
  lockStatus[motor] = true;
  setTimeout(() => {
    lockStatus[motor] = false;
  }, 7000);
  res.sendStatus(200);
});

app.get('/status', (req, res) => {
  res.json(lockStatus);
});

app.listen(PORT, () => {
  console.log(`伺服器啟動：http://localhost:${PORT}`);
});
