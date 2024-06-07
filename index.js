import got from 'got';
import { gotFile, save } from './save.js';
let deptCode = '971';
let hosCode = '02110001';
const patientCode = "08105452";
let visitDate = '2024-06-13';
let headers = {};
let timeList = {
  'AM': [{ "timeIntervalCode": "08:00-08:30" }, { "timeIntervalCode": "08:30-09:00" }, { "timeIntervalCode": "09:00-09:30" }, { "timeIntervalCode": "09:30-10:00" }, { "timeIntervalCode": "10:00-10:30" }, { "timeIntervalCode": "10:30-11:00" }],
  'PM': [{ "timeIntervalCode": "13:30-14:00" }, { "timeIntervalCode": "14:00-14:30" }, { "timeIntervalCode": "14:30-15:00" }, { "timeIntervalCode": "15:00-15:30" }, { "timeIntervalCode": "15:30-16:00" }],
}

headers = gotFile('header.json');

export const getDetail = async (headers, url) => {
  const res = await got.get(url, {
    headers: {
      ...headers,
    },
  }).json()
  return res;
}


export const deptDetail = async (headers) => {
  const name = `${visitDate}${deptCode}.json`;
  let file = gotFile(name);
  delete headers['hos-code'];
  if (!file) {
    file = await got.get('https://aceso.bjhsyuntai.com/api/mobile/source/dept/detail', {
      searchParams: { deptCode, visitDate, _t: Date.now() }, headers: {
        ...headers,
        'hos-code': hosCode,
      },
    }).json();
    console.log(file);
    if (file.code === 0 && file.data && file.data.length > 0) {
      save(name, file);
    }
  }
  return file;
}

const locking = async (json) => {
  delete headers['hos-code'];
  const res = await got.post('https://aceso.bjhsyuntai.com/api/mobile/source/locking', {
    json,
    headers: {
      ...headers,
      'hos-code': hosCode,
    },
  }).json()
  console.log(res);
  return res;
}

const getPostList = (hospital) => {
  let list = [];
  hospital.forEach(element => {
    const treatmentPeriodType = element.periodType;
    const sourceList = element.sourceList;
    sourceList.forEach(item => {
      timeList[treatmentPeriodType].forEach(time => {
        list.push({
          doctorCode: item.doctorCode,
          sourceCode: item.sourceCode,
          treatmentPeriodType,
          timeIntervalCode: time.timeIntervalCode
        })
      })
    })
  });
  return list
}

const lockList = async (list) => {
  const arr = [];
  list.forEach(item => {
    let json = {
      ...item,
      deptCode,
      treatmentDate: visitDate,
      patientCode,
    }
    arr.push(json);
  });

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    await locking(item);
    console.log(i);
  }
  app()
  // Promise.all(allArr);
}

const getInternal = () => {
  // got.get('https://aceso.bjhsyuntai.com/api/mobile/risk/access-token/internal', {
  //   searchParams: { sign, _t: Date.now(), timestamp: Date.now() },
  // }.json().then(res => {
  //   console.log(res);
  // }))
  return list = [{ "timeIntervalCode": "08:00-08:30", "timeFrom": "08:00:00", "timeTo": "08:30:00", "timeIntervalView": "08:00~08:30", "count": 1 }, { "timeIntervalCode": "08:30-09:00", "timeFrom": "08:30:00", "timeTo": "09:00:00", "timeIntervalView": "08:30~09:00", "count": 1 }, { "timeIntervalCode": "09:00-09:30", "timeFrom": "09:00:00", "timeTo": "09:30:00", "timeIntervalView": "09:00~09:30", "count": 2 }, { "timeIntervalCode": "09:30-10:00", "timeFrom": "09:30:00", "timeTo": "10:00:00", "timeIntervalView": "09:30~10:00", "count": 4 }, { "timeIntervalCode": "10:00-10:30", "timeFrom": "10:00:00", "timeTo": "10:30:00", "timeIntervalView": "10:00~10:30", "count": 3 }];
}

const getAuth = async (json) => {
  delete headers['hos-code'];
  const res = await got.post('https://aceso.bjhsyuntai.com/api/mobile/third/mp/auth', {
    searchParams: {
      jsCode: '0b3JRhGa1zCJzH0VujGa1EVbgO3JRhGR',
      _t: Date.now()
    },
    json,
    headers: {
      ...headers,
      'hos-code': hosCode,
    },
  }).json()
  console.log(res);
  return res;

}


export const app = async () => {
  visitDate = '2024-06-14';
  deptCode = '971';
  // deptCode = 996
  hosCode = '02110001';
  const { data, code } = await deptDetail(headers);
  // if (code === 301) {
  //   console.log('无数据 重试 301', Date.now());
  //   getAuth(headers);
  // }
  // else 
  if (data) {
    const hospital = data.list;
    if (hospital && hospital.length > 0) {
      const postList = getPostList(hospital);
      lockList(postList);
    } else {
      console.log('没有号', Date.now());
      setTimeout(function () {
        // body
        app();
      }, 1000);
    }
  } else {
    console.log('无数据 重试', Date.now())
    setTimeout(function () {
      // body
      app();
    }, 1000);
  }
}
