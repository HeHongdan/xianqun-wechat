/**
* 解析中国天气网的工具
* 
* hehongdan
* 20180717
*/

//1导入模块//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import
import { createDay } from '../bean/WeatherDay.js';
import { createHour } from '../bean/WeatherHour.js';
import { weatherString2Int, windDirectionString2Int, windForceString2Int } from '../utils/map.js';
import { getYesterdayFormat } from '../utils/time.js';

//向外暴露模块
module.exports = {
  parseWeather: parseWeather,
}

/**
 * 解析天天气
 * 
 */
function parse(hourAndDayWeather, yesterdayWeather, callback) {

  //缓存天天气数组
  var dayWeatherArray = new Array(8);
  //缓存一天天气
  var dayWeather;
  //缓存小时天气数组
  var hourWeatherArray = {};
  //缓存一小时天气
  var hourWeather;
  //数组追加数据


  //当前操作元素的时间字符串的长度
  var jfLength;
  //当前操作元素的时间的小时数
  var hour;
  //当前操作元素的时间的小时数（整型）
  var cH = parseInt(currentHour);
  //缓存昨天日期
  var date = yesterdayWeather.date;
  //日期字符串长度
  var dateLength = date.length;
  //当前的小时值
  var currentHour;
  //当前的值（赋值处）
  var currentI = 0;
  if (10 === dateLength) {
    currentHour = date.substring(dateLength - 2, dateLength);
    console.log('\n[仙裙] 当前小时=' + currentHour + "\n\n");
  }

  //逐1、3小时══════════════════════════════╗
  //var li = dayWeather.getElementsByTagName("li");
  //逐1、3小时数据开始下标
  var hStart = hourAndDayWeather.indexOf("var");
  //逐1、3小时数据结束下标
  var hEnd = hourAndDayWeather.indexOf(";") + 1;
  //逐1、3小时数据（hour3data）
  var hour = hourAndDayWeather.substr(hStart, (hEnd - hStart));

  var hNStart = hour.indexOf("var ") + 4;
  var hNEnd = hour.indexOf(" = [[{\"");
  //名称一=hour3data
  var hourName = hour.substr(hNStart, (hNEnd - hNStart));

  var hDStart = hour.indexOf("[[{\"");
  var hDEnd = hour.indexOf("}]];") + 3;
  //逐1、3小时数组数据（hour3data）
  var hour3data = hour.substr(hDStart, (hDEnd - hDStart));


  //文本解析为对象
  var hour3 = JSON.parse(hour3data);
  //一天中逐1、3小时天气数据
  var oneDay = hour3[0];
  //一天中逐1、3小时天气数据长度（小时个数）
  var obj1Length = hour3.length;
  //对应（小时）天天气在总数组中的下标
  var index;
  for (var i = 0; i < obj1Length; i++) {
    var oneDay = hour3[i];
    var dayWeatherObject = oneDay.length;
    //console.log('[仙裙]第' + (i + 1) + '天时间节点长度=' + obj1_1Length);
    for (var j = 0; j < dayWeatherObject; j++) {
      var obj1_1_1 = oneDay[j];
      //ja：天气（02阴、07小雨）
      var ja = obj1_1_1.ja;
      //jb：温度（）
      var jb = obj1_1_1.jb;
      //jc：风力（0 <3级、1 3-4级）
      var jc = obj1_1_1.jc;
      //jd：风向（4南风、5西南风）
      var jd = obj1_1_1.jd;
      //jf：年月日时
      var jf = obj1_1_1.jf;

      // console.log('[仙裙] ' + '年月日时=' + jf +
      //   '，温度=' + jb +
      //   '，天气=' + ja +
      //   '，风向=' + jd +
      //   '，风力=' + jc);

      hourWeather = createHour(jf, jb, jb, ja, ja, jd, jd, jc);
      //向数组追加元素
      [].push.apply(hourWeatherArray, [hourWeather]);

      if (i <= 2) {
        jfLength = jf.length;
        if (10 === jfLength) {
          hour = jf.substring(jfLength - 2, jfLength);
          if (currentHour === hour) {
            dayWeather = createDay(jf, jb, jb, ja, ja, jd, jd, jc);
            dayWeatherArray[i + 1] = dayWeather;
            //console.log('[仙裙] 天=' + JSON.stringify(dayWeather));
          }
        }
      } else {
        if ((cH % 3) === 0) {
          dayWeather = createDay(jf, jb, jb, ja, ja, jd, jd, jc);
          dayWeatherArray[i + 1] = dayWeather;
        } else {
          //var index = 72 + ((i - 3) * 8) + (j / 3);
          if (currentI < i) {
            index = 72 + ((i - 3) * 8) - (currentHour - 8);
            //console.log('[仙裙] 当前小时=' + currentHour + '，求余=' + (cH % 3));
            //console.log('[仙裙] 天天气总长度=' + hourWeatherArray.length + "，要取的天天气下标=" + parseInt(index));

            dayWeather = createDay(jf, jb, jb, ja, ja, jd, jd, jc);
            dayWeatherArray[i + 1] = dayWeather;
            currentI = i;
          }
        }
      }
    }
  }
  //逐1、3小时══════════════════════════════╝


  //7天══════════════════════════════╗
  //白天和夜晚数据
  var eventDayAndNight = hourAndDayWeather.substr((hEnd + 1), hourAndDayWeather.length);
  //白天和夜晚数据开始下标
  var eDStart = eventDayAndNight.indexOf("var");
  //白天和夜晚数据结束下标
  var eDEnd = eventDayAndNight.indexOf(";") + 1;
  //白天和夜晚数组数据
  var eventDay = eventDayAndNight.substr(eDStart, (eDEnd - eDStart));
  //console.log('[仙裙] 白天数据=' + eventDay);

  var eDNStart = eventDay.indexOf("var ") + 4;
  var eDNEnd = eventDay.indexOf(" = [\"");
  var eventDayName = eventDay.substr((eDNStart), (eDNEnd - eDNStart));
  //console.log('[仙裙] 白天名称=' + eventDayName);

  var eDDStart = eventDay.indexOf("[\"");
  var eDDEnd = eventDay.indexOf("];") + 1;
  var eventDayData = eventDay.substr(eDDStart, (eDDEnd - eDDStart));
  //console.log('[仙裙] 白天数据=' + eventDayData);


  var eventNight = eventDayAndNight.substr((eDEnd + 1), eventDayAndNight.length);
  //console.log('[仙裙] 夜晚数据=' + eventNight);
  var eNStart = eventNight.indexOf("var");
  var eNEnd = eventNight.indexOf(";") + 1;
  eventNight = eventNight.substr(eNStart, (eNEnd - eNStart));
  //console.log('[仙裙] 夜晚数组数据=' + eventNight);

  var eNNStart = eventNight.indexOf("var ") + 4;
  var eNNEnd = eventNight.indexOf(" = [\"");
  var eventNightName = eventNight.substr((eNNStart), (eNNEnd - eNNStart));
  //console.log('[仙裙] 夜晚名称=' + eventNightName);

  var eNDStart = eventNight.indexOf("[\"");
  var eNDEnd = eventNight.indexOf("];") + 1;
  var eventNightData = eventNight.substr(eNDStart, (eNDEnd - eNDStart));
  //console.log('[仙裙] 夜晚数据=' + eventNightData);


  //JSON 字符串转换为对象
  var eventDayObject = JSON.parse(eventDayData);
  //console.log('[仙裙] 白天天数=' + eventDayObject.length);
  //console.log('[仙裙] 夜晚天数=' + eventDayObject.length + "\n\n");
  var eventNightObject = JSON.parse(eventNightData);
  //白天（高）气温的长度
  var eventDayLength = eventDayObject.length;
  //夜晚（低）气温的长度
  var eventNightLength = eventNightObject.length;
  //缓存天天气数组的长度
  var dWAL = dayWeatherArray.length;
  //白天气温
  var day;
  //夜晚气温
  var night;

  if (eventDayLength === eventNightLength) {
    for (i = 0; i < eventDayLength; i++) {
      day = eventDayObject[i];
      night = eventNightObject[i];
      //console.log('[仙裙] 白天气温=' + day);
      //console.log('[仙裙] 夜晚气温=' + night);
      if (0 === i) {
        yesterdayWeather.tempDay = day;
        yesterdayWeather.tempNight = night;
        dayWeatherArray[0] = yesterdayWeather;
      } else {
        if (dWAL > i) {
          dayWeatherArray[i].tempDay = day;
          dayWeatherArray[i].tempNight = night;
        }
      }
      //console.log('[仙裙] 白天气温=' + day);
      //console.log('[仙裙] 夜晚气温=' + night);
    }
  }

  // var url = url + "，3回调内函数";
  // console.log('[仙裙]' + url);
  // setTimeout(function () {
  //   callback(weatherData.toString);
  // }, 1000 * 2);
  // console.log('[仙裙] 最终返回，天天气长度=' + dayWeatherArray.length +
  //   ',小时天气长度=' + hourWeatherArray.length);
  //7天══════════════════════════════╝


  callback(dayWeatherArray, hourWeatherArray);
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

  var doc = XMLParser.parseFromString(result.data);
  //逐1、3小时&7天
  var blueFor_container;
  //逐1、3小时&7天天气
  var hourAndDayWeather;
  //昨天天气
  var yesterdayWeather;
  //昨天天气1
  var weather1;
  //昨天天气2
  var weather2;
  //昨天风向1
  var wind1;
  //昨天风向2
  var wind2;
  //昨天风力
  var windForce;


  //逐1、3小时&7天══════════════════════════════╗
  var divs = doc.getElementsByTagName("div");
  for (var i = 0; i < divs.length; i++) {
    //返回指定属性名（class）的属性值
    var divClass = divs[i].getAttribute("class");
    if (divClass === "blueFor-container") { //L_weather
      blueFor_container = doc.getElementsByTagName("div")[i];
      //console.log('[仙裙]' + blueFor_container);

      /** 逐1、3小时 */
      hourAndDayWeather = blueFor_container.getElementsByTagName("script").toString();
      //console.log('[仙裙]' + scriptWeather);
      var dWStart = hourAndDayWeather.indexOf("var");
      var dWEnd = hourAndDayWeather.indexOf("</script>");
      hourAndDayWeather = hourAndDayWeather.substr(dWStart, (dWEnd - dWStart));
      //console.log('[仙裙] 小时天气= ' + hourWeather);

      //昨天──────────┐
      var ul = blueFor_container.getElementsByTagName("ul");
      for (var k = 0; k < ul.length; k++) {
        var ulClass = ul[k].getAttribute("class");
        if (ulClass === "blue-container backccc") {
          yesterdayWeather = blueFor_container.getElementsByTagName("ul")[k];
          var li = yesterdayWeather.getElementsByTagName("li");
          for (var l = 0; l < li.length; l++) {
            var liClass = li[l].getAttribute("class");
            //昨天今天...
            if (liClass === "blue-item yesterday") {
              //if (classV4 == "blue-item active") {
              var dayLi = yesterdayWeather.getElementsByTagName("li")[l];
              var i_ = dayLi.getElementsByTagName("i");
              for (var m = 0; m < i_.length; m++) {
                if (m === 0) {
                  weather1 = i_[0].getAttribute("title");
                  weather2 = i_[1].getAttribute("title");
                }
              }
              //固定的下标不用循环取值
              var ulLiDiv = dayLi.getElementsByTagName("div")[0];
              var ulLiI1 = ulLiDiv.getElementsByTagName("i")[0];
              wind1 = ulLiI1.getAttribute("title");
              var ulLiI2 = ulLiDiv.getElementsByTagName("i")[1];
              wind2 = ulLiI2.getAttribute("title");
              var ulLiP = dayLi.getElementsByTagName("p");
              for (var n = 0; n < ulLiP.length; n++) {
                //返回指定属性名（class）的属性值
                var pClass = ulLiP[n].getAttribute("class");
                if (pClass === "wind-info  info-style" && n === 3) {
                  windForce = ulLiP[n] + '';
                  var indexStart = windForce.indexOf("\">") + 2;
                  var indexEnd = windForce.indexOf("</p>");
                  windForce = windForce.substr(indexStart, (indexEnd - indexStart));
                  var replace = /\s|&lt;/g;
                  //替换字符
                  windForce = windForce.replace(replace, '');
                  // console.log('[仙裙] 天气1=' + weather1 +
                  //   '，天气2=' + weather2 +
                  //   '，风向1' + wind1 +
                  //   '，风向2' + wind2 +
                  //   '，风力' + windForce);

                  var yesterday = getYesterdayFormat();
                  weather1 = weatherString2Int[weather1];
                  weather2 = weatherString2Int[weather2];
                  wind1 = windDirectionString2Int[wind1];
                  wind2 = windDirectionString2Int[wind2];
                  windForce = windForceString2Int[windForce];
                  //"ja":"天气","jb":"温度","jc":"风力","风向":"2","年月日时":"2018071708"
                  yesterdayWeather = createDay(yesterday, "-100", "-100", weather1, weather2, wind1, wind1, windForce);
                  //console.log('[仙裙] 昨天对象=' + yesterdayWeather.windForce);
                }
              }
            }
          }
        }
      }
      //昨天──────────┘
    }
  }

  //逐1、3小时&7天══════════════════════════════╝
  parse(hourAndDayWeather, yesterdayWeather, function (dayWeatherArray, hourWeatherArray) { return callback(dayWeatherArray, hourWeatherArray); }); //同等于//getJSON(url, function (data) {return callback(data);});
}

