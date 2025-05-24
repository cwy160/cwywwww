const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // 提供 index.html

let latestData = '';
let lockState = {}; // motorX: timestamp

// 接收訊號（從客戶端送來 motorX）
app.post('/send', (req, res) => {
  const { data } = req.body;
  if (data) {
    latestData = data;
    lockState[data] = Date.now();
    res.status(200).json({ status: 'ok' });
  } else {
    res.status(400).json({ error: 'Missing data' });
  }
});

// 提供目前最新資料給 Arduino
app.get('/latest', (req, res) => {
  res.json({ data: latestData });
});

// ✅ 前端會定期輪詢這裡來確認哪些 motorX 被鎖
app.get('/status', (req, res) => {
  const now = Date.now();
  const status = {};

  Object.entries(lockState).forEach(([key, timestamp]) => {
    if (now - timestamp < 7000) {
      status[key] = true;
    } else {
      status[key] = false;
    }
  });

  res.json(status);
});

app.listen(port, () => {
  console.log(`伺服器啟動：http://localhost:${port}`);
});
