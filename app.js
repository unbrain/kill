import Koa from 'koa';
import got from 'got';
import { save } from './save.js';
const app = new Koa();

const getDetail = async (headers, url) => {
  try {
    console.log(url);
    const res = await got.get(url, {
      headers: {
        ...headers,
      },
    }).json()
    return res;
  } catch(e) {
    console.log(e, 'error');
  }
}

app.use(async ctx => {
  const url = ctx.URL.href.replace('http', 'https');
  save('header.json', ctx.header);
  const res = await getDetail(ctx.header, url);
  ctx.body = res;
})

// app.use(proxy('/api', {
//   events: {
//     proxyReq(proxyReq, req, res) {
//       // console.log(proxyReq, req, res);
//       console.log(req);
//       const currentDirectory = process.cwd();
//       // 构建文件路径
//       const filePath = path.join(currentDirectory, 'header.json');
//       // console.log(filePath);
//       fs.writeFile(filePath, JSON.stringify(req.headers, null, 2), (err) => {
//         if (err) {
//           console.error('An error occurred while writing JSON to the file:', err);
//         } else {
//           console.log('JSON file has been written successfully.');
//         }
//       });
//     },
//   },
//   target: 'https://aceso.bjhsyuntai.com', // 目标服务器地址 (HTTPS)
//   changeOrigin: true,
//   secure: false, // 如果目标服务器使用的是自签名证书，将 secure 设置为 false
//   pathRewrite: { '^/api': '' }, // 重写路径，比如将 /api 去掉
//   logs: true,
//   // agent: new Https.Agent({ rejectUnauthorized: false }) // 忽略未授权的证书
// }));


app.listen(9000);
