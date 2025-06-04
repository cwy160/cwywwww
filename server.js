const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let latestData = '';
let lockStatus = {};
let motorQueues = {};
let motorWorking = {};

// 初始化所有 motor 狀態
for (let i = 1; i <= 16; i++) {
  const motor = `motor${i}`;
  lockStatus[motor] = false;
  motorQueues[motor] = [];
  motorWorking[motor] = false;
}

// 🔁 排程每個 motor 的任務（2 秒間隔）
function scheduleNextMotorTask(motor) {
  if (motorQueues[motor].length === 0) {
    motorWorking[motor] = false;
    return;
  }

  const task = motorQueues[motor].shift();
  latestData = task.data;
  lockStatus[motor] = true;

  console.log(`🚀 執行 ${motor}`);

  setTimeout(() => {
    lockStatus[motor] = false;
    console.log(`✅ ${motor} 解鎖，繼續排程`);

    scheduleNextMotorTask(motor);  // 繼續處理下一個
  }, 2000);  // 每 2 秒執行一次任務
}

// 📩 前端請求觸發 motor
app.post('/send', (req, res) => {
  const motor = req.body.data;
  if (!motorQueues[motor]) return res.status(400).json({ error: '無效的 motor 名稱' });

  motorQueues[motor].push({ data: motor });
  const position = motorQueues[motor].length;

  console.log(`📥 已加入 ${motor} 佇列，當前第 ${position} 位`);

  if (!motorWorking[motor]) {
    motorWorking[motor] = true;
    scheduleNextMotorTask(motor);
  }

  res.json({ success: true, position });
});

app.get('/status', (req, res) => {
  const motor = req.query.motor;
  if (!motor || !motorQueues[motor]) {
    return res.json({ position: 0 });
  }

  const queue = motorQueues[motor];
  const position = queue.length + (motorWorking[motor] ? 1 : 0);
  res.json({ position });
});


// 📤 回傳最新執行指令
app.get('/latest', (req, res) => {
  res.json({ data: latestData });
  latestData = '';
});

// 🧭 查詢 motor 鎖定狀態
app.get('/status', (req, res) => {
  res.json(lockStatus);
});

app.listen(port, () => {
  console.log(`伺服器運行中： http://localhost:${port}`);
});
