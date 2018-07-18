/**
* 解析中国天气网的工具
* 
* hehongdan
* 20180717
*/

//1导入模块
import { getYesterdayFormat } from '../utils/time.js';
import { windForceString2Int, windDirectionString2Int, weatherString2Int } from '../utils/map.js';
import { createDay, addDay } from '../bean/WeatherDay.js';
import { createHour, addHour } from '../bean/WeatherHour.js';

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
  var dayWeatherArray = {};
  //缓存一天天气
  var dayWeather;
  //缓存小时天气数组
  var hourWeatherArray = {};
  //缓存一小时天气
  var hourWeather;
  [].push.apply(dayWeatherArray, [yesterdayWeather]);

  //var li = dayWeather.getElementsByTagName("li");
  var hStart = hourAndDayWeather.indexOf("var");
  var hEnd = hourAndDayWeather.indexOf(";") + 1;
  //hour3data
  var hour = hourAndDayWeather.substr(hStart, (hEnd - hStart));

  var hNStart = hour.indexOf("var ") + 4;
  var hNEnd = hour.indexOf(" = [[{\"");
  //名称一=hour3data
  var hourName = hour.substr(hNStart, (hNEnd - hNStart));

  var hDStart = hour.indexOf("[[{\"");
  var hDEnd = hour.indexOf("}]];") + 3;
  //hour3data对应的内容
  var hour3data = hour.substr(hDStart, (hDEnd - hDStart));

  //文本解析为对象
  var hour3 = JSON.parse(hour3data);
  var oneDay = hour3[0];
  var obj1Length = hour3.length;
  //console.log('[仙裙]预报天数=' + obj1Length);

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

      //   console.log('[仙裙] ' + '年月日时=' + jf +
      //     '，温度=' + jb +
      //     '，天气=' + ja +
      //     '，风向=' + jd +
      //     '，风力=' + jc);

      hourWeather = createDay(jf, jb, jb, ja, ja, jd, jd, jc);
      [].push.apply(hourWeatherArray, [hourWeather]);

    }
  }
  //逐1、3小时══════════════════════════════╗

  //逐1、3小时══════════════════════════════╝

  // var url = url + "，3回调内函数";
  // console.log('[仙裙]' + url);
  // setTimeout(function () {
  //   callback(weatherData.toString);
  // }, 1000 * 2);
  console.log('[仙裙] 最终返回，天天气长度=' + dayWeatherArray.length +
    ',小时天气长度=' + hourWeatherArray.length);

  callback(dayWeatherArray, hourWeatherArray);

  // var t2_ = today.substr((hEnd + 1), today.length);
  // var wS2 = t2_.indexOf("var");
  // var wE2 = t2_.indexOf(";") + 1;
  // var t2 = t2_.substr(wS2, (wE2 - wS2));
  // console.log('[仙裙]' + t2)

  // var wS2_name = t2_.indexOf("var ") + 4;
  // var wE2_name = t2_.indexOf(" = [\"");
  // var t2_name = t2_.substr((wS2_name), (wE2_name - wS2_name));

  // var wS2_json = t2_.indexOf("[\"");
  // var wE2_json = t2_.indexOf("];") + 1;
  // var t2_json = t2_.substr(wS2_json, (wE2_json - wS2_json));
  // var obj2 = JSON.parse(t2_json);

  // var t3 = t2_.substr((wE2 + 1), t2_.length);

  // var wS3 = t3.indexOf("var");
  // var wE3 = t3.indexOf(";") + 1;
  // var t3 = t3.substr(wS3, (wE3 - wS3));

  // //定义一数组 
  // var strs = new Array();
  // //字符分割
  // strs = today.split("}");
  // //将符串分割成一个数组
  // //var day = today.split(",");//day
  // for (i = 0; i < strs.length; i++) {
  //   console.log('[仙裙]' + strs[i])
  // }

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

                  //ja：天气（02阴、07小雨）
                  //jb：温度（）
                  //jc：风力（0 <3级、1 3-4级）
                  //jd：风向（4南风、5西南风）
                  //jf：年月日时
                  weather1 = weatherString2Int[weather1];
                  weather2 = weatherString2Int[weather2];
                  wind1 = windDirectionString2Int[wind1];
                  wind2 = windDirectionString2Int[wind2];
                  windForce = windForceString2Int[windForce];
                  var yesterday = getYesterdayFormat();

                  //"ja":"08","jb":"27","jc":"1","jd":"2","jf":"2018071708"
                  var yesterdayData = "\"ja\"" + ":\"" + weather1 +
                    "\"," + "\"jb\"" + ":\"" + weather2 +
                    "\"," + "\"jc\"" + ":\"" + wind2 +
                    "\"," + "\"jd\"" + ":\"" + windForce +
                    "\"," + "\"jf\"" + ":\"" + yesterday + "\"";
                  //console.log('[仙裙] 昨天=' + yesterdayData);
                  yesterdayWeather = createDay(yesterday, "-100", "-100", weather1, weather2, wind1, wind1, windForce);
                  //console.log('[仙裙] 昨天对象=' + yesterdayWeather.date);
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
  parse(hourAndDayWeather, yesterdayWeather, function (data1, data2) { return callback(data1, data2); }); //同等于//getJSON(url, function (data) {return callback(data);});
}

