const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


let latestData = '';
let lockStatus = {
  motor1: false,
  motor2: false,
  motor3: false,
  motor4: false,
  motor5: false,
  motor6: false,
  motor7: false,
  motor8: false,
  motor9: false,
  motor10: false,
  motor11: false,
  motor12: false,
  motor13: false,
  motor14: false,
  motor15: false,
  motor16: false,
};

app.post('/send', (req, res) => {
  const { data } = req.body;
  console.log('收到指令：', data);
  latestData = data;
  lockStatus[data] = true;
  res.sendStatus(200);

 

  // 自動解鎖（模擬馬達完成）
  setTimeout(() => {
    lockStatus[data] = false;
    console.log('已解鎖：', data);
  }, 7000);
});

app.post('/lock', (req, res) => {
  const { motor } = req.body;
  if (motor) {
    lockStatus[motor] = true;
    setTimeout(() => {
      lockStatus[motor] = false;
    }, 7000);
    res.sendStatus(200);
  } else {
    res.status(400).send('Invalid motor key');
  }
});


app.get('/latest', (req, res) => {
  res.json({ data: latestData });
  latestData = ''; // 傳送完就清空，避免重複送出
});

app.get('/status', (req, res) => {
  res.json(lockStatus);
});

app.listen(port, () => {
  console.log(`伺服器啟動：http://localhost:${port}`);
});
