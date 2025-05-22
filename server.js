const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let latestData = '';
let lockStatus = {
  motor1: false,
  motor2: false,
  motor3: false,
  motor4: false
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
