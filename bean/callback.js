module.exports = {
  parseWeather: parseWeather,
}

/**
 * 解析天天气
 * 
 */
function parseDay(url, callback) {
  var url = url + "，3回调内函数";
  console.log('[仙裙]' + url);
  setTimeout(function(){
    callback("天天气");
  },1000 * 2);
}

/**
 * 解析小时天气
 * 
 */
function parseHour(url, callback) {
  var url = url + "，3回调内函数";
  callback("结果");
}

/**
 * 解析中国天气信息
 * 
 * 解析工具
 * XML数据
 * 一天的天气对象
 * 
 * 返回7天气数组
 */
function parseWeather(XMLParser, result, callback) {
  var url = "2回调函数";
  console.log('[仙裙]' + url);
  parseDay(url, data => callback(data));//同等于//getJSON(url, function (data) {return callback(data);});
}