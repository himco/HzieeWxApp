function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function getYM(data) {

  var year = data.getFullYear();
  var month = data.getMonth() + 1;
  return [year, month].map(formatNumber).join('-');
}

function getYMD(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

function getHM(date) {
  var hour = date.getHours()
  var minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
}

function getW(date) {
  var d = date.getDay();
  var arr = ['日', '一', '二', '三', '四', '五', '六'];

  return '星期' + arr[d];
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function timeStamp2Time(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}


module.exports = {
  formatNumber: formatNumber,
  formatTime: formatTime,
  getYMD: getYMD,
  getYM: getYM,
  getHM: getHM,
  getW: getW,
  timeStamp2Time: timeStamp2Time
}
