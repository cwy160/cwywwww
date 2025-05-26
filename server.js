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

  // 🔒 正常鎖定自己
  lockStatus[data] = true;

  // 🔒 額外綁定：火腐小辣（motor11）與檸茶小辣（motor14）
  if (data === 'motor11') lockStatus['motor14'] = true;
  if (data === 'motor14') lockStatus['motor11'] = true;

  res.sendStatus(200);

  // ⏱ 自動解鎖
  setTimeout(() => {
    lockStatus[data] = false;
    if (data === 'motor11') lockStatus['motor14'] = false;
    if (data === 'motor14') lockStatus['motor11'] = false;
    console.log('已解鎖：', data, '和綁定項目');
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
