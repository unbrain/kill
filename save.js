import fs from 'fs';
import path from 'path';

export const save = (name, body) => {
  const currentDirectory = process.cwd();
  // 构建文件路径
  const filePath = path.join(currentDirectory, name);
  // console.log(filePath);
  fs.writeFile(filePath, JSON.stringify(body, null, 2), (err) => {
    if (err) {
      console.error('An error occurred while writing JSON to the file:', err);
    } else {
      console.log('JSON file has been written successfully.');
    }
  });
}

export const gotFile = (name) => {
  // 获取当前工作目录
  const currentDirectory = process.cwd();
  // 构建文件路径
  const filePath = path.join(currentDirectory, name);

  try {
    // 同步读取文件内容
    const data = fs.readFileSync(filePath, 'utf8');

    // 解析 JSON 数据
    const jsonData = JSON.parse(data);

    // console.log('JSON data:', jsonData);
    return jsonData;
  } catch (err) {
    console.error('An error occurred while reading or parsing the JSON file:', err);
  }
}
