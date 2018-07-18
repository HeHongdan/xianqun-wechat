/** 
 * 解析XML天气数据（中国天气网）
 * 
 * 何洪丹
 * 20180710
 */

//1导入模块
import {getUsefulContents} from '../bean/test.js';
import {create} from '../bean/WeatherDay.js';

//将模块接口暴露出来
//转化成小程序模板语言
module.exports = {
  parse_: parse_,
  parse: parse,
}

function parse_() {
  var url = url + "，2调用回调";
  };


//3回调后执行函数
function doSomethingUseful(data) {
  console.log('[仙裙]' + "函数回调=" + data);
};



/**
 * 解析天天气
 * 
 */
function parseDay(url, callback) {
  var url = url + "，3回调内部";
  callback("回调结果");
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
function parse(XMLParser, result, callback) {
  
  var url = url + "，2调用回调";
  console.log('[仙裙]' + url);
  parseDay(url, data => callback(data));//同等于//getJSON(url, function (data) {return callback(data);});



  var doc = XMLParser.parseFromString(result.data);
  var divs = doc.getElementsByTagName("div");
  for (var i = 0; i < divs.length; i++) {
    //返回指定属性名（class）的属性值
    var classV1 = divs[i].getAttribute("class");
    if (classV1 == "weather_7d") { //L_weather
      var weather_7d = doc.getElementsByTagName("div")[i]; //doc
      
      var divsWeather_7d = weather_7d.getElementsByTagName("div"); //divs
      for (var j = 0; j < divsWeather_7d.length; j++) {
        var classV2 = divsWeather_7d[j].getAttribute("class");
        if (classV2 == "blueFor-container") { //todayRight
          var container = weather_7d.getElementsByTagName("div")[j]; //doc
          //console.log('仙裙' + container)
          //7天═══════════════════════════════════════════════════════════════════════════════════════════════════════╗
          var ul = weather_7d.getElementsByTagName("ul"); //divs
          for (var k = 0; k < ul.length; k++) {
            var classV3 = ul[k].getAttribute("class");
            if (classV3 == "blue-container backccc") {
              var todayUl = container.getElementsByTagName("ul")[k];

              var li = weather_7d.getElementsByTagName("li");
              for (var l = 0; l < li.length; l++) {
                var classV4 = li[l].getAttribute("class");
                //昨天今天...
                if (classV4 == "blue-item yesterday") {
                  //if (classV4 == "blue-item active") {
                  var todayLi = container.getElementsByTagName("li")[l];

                  var i_ = todayLi.getElementsByTagName("i");
                  for (var m = 0; m < i_.length; m++) {
                    if (m == 0) {
                      weatherDayBean.weather1 = i_[0].getAttribute("title");
                      //weatherDay.weather1 = weather1;
                      //console.log('[仙裙]' + weather1);
                      weatherDayBean.weather2 = i_[1].getAttribute("title");
                      //weatherDay.weather2 = weather2;
                      //console.log('[仙裙]' + weather2);
                    }
                  }

                  //知道个数不用循环取值
                  var div_ = todayLi.getElementsByTagName("div")[0];
                  var div_i0 = div_.getElementsByTagName("i")[0];
                  weatherDayBean.wind1 = div_i0.getAttribute("title");
                  //weatherDay.wind1 = wind1;
                  //console.log('[仙裙]' + wind1);
                  var div_i1 = div_.getElementsByTagName("i")[1];
                  weatherDayBean.wind2 = div_i1.getAttribute("title");
                  //weatherDay.wind2 = wind2;
                  //console.log('[仙裙]' + wind2);


                  var div_p = todayLi.getElementsByTagName("p");
                  for (var n = 0; n < div_p.length; n++) {
                    //返回指定属性名（class）的属性值
                    var class_p = div_p[n].getAttribute("class");

                    var fengLi;
                    //昨天
                    if (class_p == "wind-info  info-style" && n == 3) {
                      fengLi = div_p[n] + "";
                      //console.log(n + '[仙裙]' + fengLi);

                      var indexStart = fengLi.indexOf("\">") + 2;
                      var indexEnd = fengLi.indexOf("</p>");
                      var fengLi_ = fengLi.substr(indexStart, (indexEnd - indexStart));
                      //console.log(indexStart + "," + indexEnd + '[仙裙]' + fengLi_);
                      var re = /\s|&lt;/g;
                      //替换字符
                      weatherDayBean.windForce = fengLi_.replace(re, '');
                      //weatherDay.windForce = windForce;
                      //console.log('[仙裙]' + windForce);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

  }








  var url = url + "，2回调函数";
  console.log('[仙裙]' + url);
  parseDay(url, data => callback(data)); //同等于//getJSON(url, function (data) {return callback(data);});
  parseHour(url, function(data) {
    return callback(data);
  });
}

function parse_(XMLParser, result, weatherDayBean) {
  var doc = XMLParser.parseFromString(result.data);
  var divs = doc.getElementsByTagName("div");

  for (var i = 0; i < divs.length; i++) {
    //返回指定属性名（class）的属性值
    var classV1 = divs[i].getAttribute("class");
    if (classV1 == "weather_7d") { //L_weather
      var weather_7d = doc.getElementsByTagName("div")[i]; //doc
      var divsWeather_7d = weather_7d.getElementsByTagName("div"); //divs
      for (var j = 0; j < divsWeather_7d.length; j++) {
        var classV2 = divsWeather_7d[j].getAttribute("class");
        if (classV2 == "blueFor-container") { //todayRight
          var container = weather_7d.getElementsByTagName("div")[j]; //doc
          //console.log('仙裙' + container)
          //7天═══════════════════════════════════════════════════════════════════════════════════════════════════════╗
          var ul = weather_7d.getElementsByTagName("ul"); //divs
          for (var k = 0; k < ul.length; k++) {
            var classV3 = ul[k].getAttribute("class");
            if (classV3 == "blue-container backccc") {
              var todayUl = container.getElementsByTagName("ul")[k];

              var li = weather_7d.getElementsByTagName("li");
              for (var l = 0; l < li.length; l++) {
                var classV4 = li[l].getAttribute("class");
                //昨天今天...
                if (classV4 == "blue-item yesterday") {
                  //if (classV4 == "blue-item active") {
                  var todayLi = container.getElementsByTagName("li")[l];

                  var i_ = todayLi.getElementsByTagName("i");
                  for (var m = 0; m < i_.length; m++) {
                    if (m == 0) {
                      weatherDayBean.weather1 = i_[0].getAttribute("title");
                      //weatherDay.weather1 = weather1;
                      //console.log('[仙裙]' + weather1);
                      weatherDayBean.weather2 = i_[1].getAttribute("title");
                      //weatherDay.weather2 = weather2;
                      //console.log('[仙裙]' + weather2);
                    }
                  }

                  //知道个数不用循环取值
                  var div_ = todayLi.getElementsByTagName("div")[0];
                  var div_i0 = div_.getElementsByTagName("i")[0];
                  weatherDayBean.wind1 = div_i0.getAttribute("title");
                  //weatherDay.wind1 = wind1;
                  //console.log('[仙裙]' + wind1);
                  var div_i1 = div_.getElementsByTagName("i")[1];
                  weatherDayBean.wind2 = div_i1.getAttribute("title");
                  //weatherDay.wind2 = wind2;
                  //console.log('[仙裙]' + wind2);


                  var div_p = todayLi.getElementsByTagName("p");
                  for (var n = 0; n < div_p.length; n++) {
                    //返回指定属性名（class）的属性值
                    var class_p = div_p[n].getAttribute("class");

                    var fengLi;
                    //昨天
                    if (class_p == "wind-info  info-style" && n == 3) {
                      fengLi = div_p[n] + "";
                      //console.log(n + '[仙裙]' + fengLi);

                      var indexStart = fengLi.indexOf("\">") + 2;
                      var indexEnd = fengLi.indexOf("</p>");
                      var fengLi_ = fengLi.substr(indexStart, (indexEnd - indexStart));
                      //console.log(indexStart + "," + indexEnd + '[仙裙]' + fengLi_);
                      var re = /\s|&lt;/g;
                      //替换字符
                      weatherDayBean.windForce = fengLi_.replace(re, '');
                      //weatherDay.windForce = windForce;
                      //console.log('[仙裙]' + windForce);
                    }
                  }

                }
              }
            }
          }
          // console.log(
          //   "日期=" + weatherDay.date +
          //   "，温度高=" + weatherDay.tempDay +
          //   "，温度低=" + weatherDay.tempNight +

          //   "，天气1=" + weatherDay.weather1 +
          //   "，天气2=" + weatherDay.weather2 +
          //   "，风向1=" + weatherDay.wind1 +
          //   "，风向2=" + weatherDay.wind2 +
          //   "，风力=" + weatherDay.windForce);


          //const query = Bmob.Query('WeatherDay');
          //weatherDay_.add(query, wd);


          //7天═══════════════════════════════════════════════════════════════════════════════════════════════════════╝











          // //逐1、3小时═══════════════════════════════════════════════════════════════════════════════════════════════════════╗

          // var scriptWeather = weather_7d.getElementsByTagName("script"); //divs
          // for (var k = 0; k < scriptWeather.length; k++) {
          //   var classV3 = scriptWeather[k].getAttribute("class");
          //   if (classV3 == "" && k == 0) {
          //     //这是一字符串 
          //     var today = container.getElementsByTagName("script")[k].toString();

          //     var wS = today.indexOf("var");
          //     var wE = today.indexOf(";") + 1;
          //     var today1 = today.substr(wS, (wE - wS));
          //     //console.log('仙裙' + today1);

          //     var wS_name1_1 = today1.indexOf("var ") + 4;
          //     var wE_name1_1 = today1.indexOf(" = [[{\"");
          //     var name1_1 = today1.substr(wS_name1_1, (wE_name1_1 - wS_name1_1));
          //     var wS_json1_1 = today1.indexOf("[[{\"");
          //     var wE_json1_1 = today1.indexOf("}]];") + 3;
          //     var json1_1 = today1.substr(wS_json1_1, (wE_json1_1 - wS_json1_1));
          //     var obj1 = JSON.parse(json1_1);
          //     var obj1_1 = obj1[0];

          //     console.log(' ');
          //     var obj1Length = obj1.length;
          //     //console.log('[仙裙]预报天数=' + obj1Length);
          //     for (var i = 0; i < obj1Length; i++) {
          //       var obj1_1 = obj1[i];
          //       var obj1_1Length = obj1_1.length;
          //       //console.log('[仙裙]第' + (i + 1) + '天时间节点长度=' + obj1_1Length);
          //       for (var j = 0; j < obj1_1Length; j++) {
          //         var obj1_1_1 = obj1_1[j];
          //         //ja：天气（02阴、07小雨）
          //         var ja = obj1_1_1.ja;
          //         //jb：温度（）
          //         var jb = obj1_1_1.jb;
          //         //jc：风力（0 <3级、1 3-4级）
          //         var jc = obj1_1_1.jc;
          //         //jd：风向（4南风、5西南风）
          //         var jd = obj1_1_1.jd;
          //         //jf：年月日时
          //         var jf = obj1_1_1.jf;

          //         weatherHour.time = jf;
          //         weatherHour.temp = jb;
          //         weatherHour.weather = mapUtil.weatherMap[ja];
          //         weatherHour.wind = mapUtil.windDirectionMap[jd];
          //         weatherHour.windForce = mapUtil.windForceMap[jc];

          //         if (i === 0) {
          //           houerWeather[j] = weatherHour;
          //           // console.log(
          //           //   j + '[仙裙]年月日时=' + houerWeather[j].time +
          //           //   '，温度=' + houerWeather[j].temp +
          //           //   '，天气=' + houerWeather[j].weather +
          //           //   '，风向=' + houerWeather[j].wind +
          //           //   '，风力=' + houerWeather[j].windForce
          //           // );
          //         }
          //       }
          //     }

          //     var t2_ = today.substr((wE + 1), today.length);
          //     var wS2 = t2_.indexOf("var");
          //     var wE2 = t2_.indexOf(";") + 1;
          //     var t2 = t2_.substr(wS2, (wE2 - wS2));

          //     var wS2_name = t2_.indexOf("var ") + 4;
          //     var wE2_name = t2_.indexOf(" = [\"");
          //     var t2_name = t2_.substr((wS2_name), (wE2_name - wS2_name));

          //     var wS2_json = t2_.indexOf("[\"");
          //     var wE2_json = t2_.indexOf("];") + 1;
          //     var t2_json = t2_.substr(wS2_json, (wE2_json - wS2_json));
          //     var obj2 = JSON.parse(t2_json);

          //     var t3 = t2_.substr((wE2 + 1), t2_.length);

          //     var wS3 = t3.indexOf("var");
          //     var wE3 = t3.indexOf(";") + 1;
          //     var t3 = t3.substr(wS3, (wE3 - wS3));

          //     //定义一数组 
          //     var strs = new Array();
          //     //字符分割
          //     strs = today.split("}");
          //     //将符串分割成一个数组
          //     //var day = today.split(",");//day
          //     for (i = 0; i < strs.length; i++) {
          //       //console.log('仙裙' + strs[i])
          //     }
          //   }
          // }
          // //逐1、3小时═══════════════════════════════════════════════════════════════════════════════════════════════════════╝












          //return wD;
        }
      }
    }

  }


  // var url = '1主函数';
  // console.log('[仙裙]' + url);
  // //2调用回调
  // //getUsefulContents(url, data => {doSomethingUseful(data)});
  // getUsefulContents(url, function(data) {
  //   doSomethingUseful(data);
  // });

  return weatherDayBean;
};
//   var wd;
//   var weather1;
//   var weather2;
//   var wind1;
//   var wind2;
//   var windForce;