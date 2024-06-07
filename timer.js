import { app } from "./index.js";
import { CronJob } from 'cron';

// // 定义要在每天早上 5 点执行的任务
// const job = new CronJob('55 59 10 * * *', () => {
//   console.log('Running the task at 17 AM:', new Date().toLocaleString());
//   app()
//   // 在这里执行你想要的任务
// }, null, true, 'Asia/Shanghai');

// // 启动定时任务
// job.start();

app()
