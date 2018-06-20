const app = getApp()

const day = []

//字符映射关系
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

//常数变量(腾讯地图)
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
//常数变量(解析xml)
var Parser = require('../../libs/xmldom/dom-parser.js')
//常数变量(解析xml)
//var Json3 = require('../../libs/json3.js')

//常数变量(标记定位权限)
const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

Page({
  /**
   * 页面的初始数据//动态绑定数据(对应.wxml文件)
   */
  data: {
    nowTemp: '・ω・', //•́ ₃ •̀'
    nowWeather: '加载中',
    nowWeatherBackground: '/images/sunny-bg.png',
    hourlyWeather: [],
    todayDate: "",
    todayTemp: "",
    city: '广州市',
    locationAuthType: UNPROMPTED,
    UNAUTHORIZED,
    AUTHORIZED
  },

  /**点击登陆*/
  onTapLogin() {
    app.login({
      success: ({
        userInfo
      }) => {
        console.log("用户信息=" + userInfo)

        //吐司显示
        wx.showToast({
          icon: 'none',
          title: '用户信息=' + userInfo.nickName + userInfo.avatarUrl
        })

        this.setData({
          userInfo
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.checkSession({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo
        })
      }
    });
  },

  //生命周期onLoad
  onLoad() {

    //获取天气来自中国天气网
    this.getWeatherComCn();

    // 实例化腾讯地图API核心类
    this.qqmapsdk = new QQMapWX({
      key: 'MJQBZ-V3K33-ZEY3B-YMHUZ-NB6OV-XVFG6'
    });

    //获取设置定位状态
    wx.getSetting({
      success: res => {
        let auth = res.authSetting['scope.userLocation']
        this.setData({
          //如果已授权定位(auth等于true)就locationAuthType赋值AUTHORIZED，否则再如果未授权定位(auth等于false)就locationAuthType赋值UNAUTHORIZED否则locationAuthType赋值UNPROMPTED
          locationAuthType: auth ? AUTHORIZED : (auth === false) ? UNAUTHORIZED : UNPROMPTED,
        })

        //判断是否权限(授权后才重新获取定位并更新信息)
        if (auth) {
          this.getCityAndWeather()
        } else {
          this.getNow()
          //this.getSX1()
          //this.getSX2()
          //this.getSX3()
        }

      }
    });


  },

  //下拉刷新事件
  onPullDownRefresh() {
    //传入匿名函数
    this.getNow(() => {
      wx.stopPullDownRefresh()
      //console.log("停止下拉刷新")
    })
  },

  //获取服务器数据并设置视图的函数(callback:回调函数)
  getNow(callback) {
    //微信get请求
    wx.request({
      //请求接口
      url: 'https://test-miniprogram.com/api/weather/now',
      //请求参数
      data: {
        city: this.data.city
      },
      //请求成功（箭头函数，参数：res）
      success: res => {
        //打印日志
        //console.log(res)

        //取出data标签下的result赋值给result（var：全局变量、let：局部(块级)变量、const ：声明常量(块级)）
        let result = res.data.result
        this.setNow(result)
        this.setHourlyWeatherresult(result)
        this.setToday(result)
      },

      //执行停止当前页面下拉刷新
      complete: () => {
        //callback不为空执行callb()
        callback && callback()
      }

    })
  },

  //设置当前天气
  setNow(result) {
    //取出当前温度
    let temp = result.now.temp
    //取出当前天气
    let weather = result.now.weather

    //console.log(temp, weather)

    //动态改变导航栏颜色
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })

    //异步改变显示内容
    this.setData({
      //字符拼接
      nowTemp: temp + '°',
      //使用映射关系赋值
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '/images/' + weather + '-bg.png'
    })
  },

  //设置未来24小时天气
  setHourlyWeatherresult(result) {
    /**设置forcast列表**/
    let forecast = result.forecast
    //获取当前小时
    let nowHour = new Date().getHours()
    let hourlyWeather = []
    //for循环设值
    for (let i = 0; i < 8; i += 1) {
      hourlyWeather.push({
        //赋值时间
        time: (i * 3 + nowHour) % 24 + '时',
        //赋值icon
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        //赋值温度
        temp: forecast[i].temp + '℃'
      })
    }
    //设值列表第一项
    hourlyWeather[0].time = '现在'
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },

  //设置今天的天气最低最高温
  setToday(result) {
    //获取当前时间
    let date = new Date()
    this.setData({
      //设置最低最高温
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      //设置今天时间
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`,
    })
  },

  //按钮点击事件
  onTapDayWeather() {
    //跳转事件
    wx.navigateTo({
      url: '/pages/list/list?city=' + this.data.city
    })
  },

  /**
   * 获取定位业务逻辑
   */
  onTapLocation() {
    //判断标记进入不同逻辑
    if (this.data.locationAuthType === UNAUTHORIZED) {
      wx.openSetting({
        success: res => {
          let auth = res.authSetting['scope.userLocation']
          if (auth) {
            this.getCityAndWeather()
          }
        }
      })
    } else {
      this.getCityAndWeather()
    }

  },

  //获取城市(定位)和天气
  getCityAndWeather() {
    //微信接口获取本地(定位)经纬度
    wx.getLocation({
      /** 获取定位成功 */
      success: res => {
        this.setData({
          locationAuthType: AUTHORIZED,
        })
        //console.log(res.latitude, res.longitude)
        //腾讯地图接口根据本地(定位)经纬度逆地址解析城市
        this.qqmapsdk.reverseGeocoder({
          location: {
            //经度
            latitude: res.latitude, //31.23772,//
            //纬度
            longitude: res.longitude //121.47772 //
          },
          success: res => {
            let city = res.result.address_component.city
            //console.log(city)
            //赋值城市和提示
            this.setData({
              city: city,
            })

            //重新获取并设置数据
            this.getNow()

            //吐司显示
            wx.showToast({
              title: city,
              icon: 'succes',
              duration: 1000,
              mask: true
            })

          },
        })

      },

      /** 获取定位失败 */
      fail: () => {
        //改变标记及提示内容
        this.setData({
          locationAuthType: UNAUTHORIZED,
        })



        //吐司显示
        wx.showToast({
          title: "定位失败",
          icon: 'loading',
          duration: 1000,
          mask: true
        })
      },

    })
  },


  getWeatherComCn() {
    var XMLParser = new Parser.DOMParser();
    wx.request({
      //请求接口
      url: 'http://forecast.weather.com.cn/town/weathern/101281007009.shtml',
      //请求成功（箭头函数，参数：res）
      success: res => {
        var doc = XMLParser.parseFromString(res.data);
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

                var scriptWeather = weather_7d.getElementsByTagName("script"); //divs
                for (var k = 0; k < scriptWeather.length; k++) {
                  var classV3 = scriptWeather[k].getAttribute("class");
                  if (classV3 == "" && k == 0) {
                    //这是一字符串 
                    var today = container.getElementsByTagName("script")[k].toString();

                    var wS = today.indexOf("var");
                    var wE = today.indexOf(";") + 1;
                    var today1 = today.substr(wS, (wE - wS));
                    //console.log('仙裙' + today1);

                    var wS_name1_1 = today1.indexOf("var ") + 4;
                    var wE_name1_1 = today1.indexOf(" = [[{\"");
                    var name1_1 = today1.substr(wS_name1_1, (wE_name1_1 - wS_name1_1));
                    var wS_json1_1 = today1.indexOf("[[{\"");
                    var wE_json1_1 = today1.indexOf("}]];") + 3;
                    var json1_1 = today1.substr(wS_json1_1, (wE_json1_1 - wS_json1_1));
                    var obj1 = JSON.parse(json1_1);
                    var obj1_1 = obj1[0];

                    console.log(' ');
                    var obj1Length = obj1.length;
                    console.log('[仙裙]预报天数=' + obj1Length);
                    for (var i = 0; i < obj1Length; i++) {
                      var obj1_1 = obj1[i];
                      var obj1_1Length = obj1_1.length;
                      console.log('[仙裙]第' + (i + 1) + '天时间节点长度=' + obj1_1Length);
                      for (var j = 0; j < obj1_1Length; j++) {
                        var obj1_1_1 = obj1_1[j];
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


                        console.log(
                          '[仙裙]年月日时 =' + jf +
                          '，天气=' + ja +
                          '，温度=' + jb +
                          '，风力=' + jc +
                          '，风向=' + jd
                        );
                      }
                    }



                    //console.log('[仙裙]第一个转字符串= ' + obj1_1.toJSONString());

                    /*
                    //console.log('仙裙 名称=' + today1_name);
                    //JSON要解析的对象
                    var obj1 = JSON.parse(today1_json);
                    //var obj1 = today1_json.parseJSON();
                    console.log(today1_name + ' = ' + obj1);*/

                    var t2_ = today.substr((wE + 1), today.length);
                    var wS2 = t2_.indexOf("var");
                    var wE2 = t2_.indexOf(";") + 1;
                    var t2 = t2_.substr(wS2, (wE2 - wS2));

                    var wS2_name = t2_.indexOf("var ") + 4;
                    var wE2_name = t2_.indexOf(" = [\"");
                    var t2_name = t2_.substr((wS2_name), (wE2_name - wS2_name));

                    var wS2_json = t2_.indexOf("[\"");
                    var wE2_json = t2_.indexOf("];") + 1;
                    var t2_json = t2_.substr(wS2_json, (wE2_json - wS2_json));
                    var obj2 = JSON.parse(t2_json);

                    var t3 = t2_.substr((wE2 + 1), t2_.length);

                    var wS3 = t3.indexOf("var");
                    var wE3 = t3.indexOf(";") + 1;
                    var t3 = t3.substr(wS3, (wE3 - wS3));

                    console.log(t2_name + ' = ' + obj2);
                    console.log('[仙裙]白天气温=' + t2);
                    console.log('[仙裙]夜间气温=' + t3);


                    //console.log(k + '[仙裙]' + today.textContent)
                    //定义一数组 
                    var strs = new Array();
                    //字符分割
                    strs = today.split("}");
                    //将符串分割成一个数组
                    //var day = today.split(",");//day
                    for (i = 0; i < strs.length; i++) {
                      //console.log('仙裙' + strs[i])
                    }


                  }
                }
              }
            }
          }


        }


      }
    });
  },


  //═══════════════════════════════════════════════════════════════════════════════════════════════════════╗
  //获取天气来自中国天气网
  getWeatherComCn1dn() {

    //测试解析xml数组
    var xml = "<?xml version=\"1.0\" encoding=\"utf-8\" ?><DongFang><Company><cNname>1</cNname><cIP>1</cIP></Company><Company><cNname>2</cNname><cIP>2</cIP></Company><Company><cNname>3</cNname><cIP>3</cIP></Company><Company><cNname>4</cNname><cIP>4</cIP></Company><Company><cNname>5</cNname><cIP>5</cIP></Company><Company><cNname>6</cNname><cIP>6</cIP></Company></DongFang>"
    var XMLParser = new Parser.DOMParser();
    //var doc = XMLParser.parseFromString(xml)

    //var x0 = doc.getElementsByTagName('PARAM')[0]
    /*var elements = doc.getElementsByTagName("Company");
   for (var i = 0; i < elements.length; i++) {
    var name = elements[i].getElementsByTagName("cNname")[0].firstChild.nodeValue;
    var ip = elements[i].getElementsByTagName("cIP")[0].firstChild.nodeValue;
    console.log(name + '' + ip)
  }*/

    //微信get请求
    wx.request({
      //请求接口
      url: 'http://forecast.weather.com.cn/town/weather1dn/101281007009.shtml',
      //请求成功（箭头函数，参数：res）
      success: res => {
        var doc = XMLParser.parseFromString(res.data);
        var divs = doc.getElementsByTagName("div");

        //var divs = doc.getElementsByTagName("div")[0].getAttribute("class");
        //var divs = doc.getElementById("town");
        //var divs = doc.getElementsByTagName("input").length;

        //var divs = doc.getElementsByTagName("div");
        //var child = divs.childNodes[0];

        //console.log('圈群by何洪丹' + divs)
        //console.log('仙裙' + child.nodeValue)

        for (var i = 0; i < divs.length; i++) {
          //返回指定属性名（class）的属性值
          var classV1 = divs[i].getAttribute("class");
          if (classV1 == "L_weather") {
            //console.log(i + '仙裙' + classV1)

            var L_weather = doc.getElementsByTagName("div")[i];
            //console.log('仙裙' + L_weather)
            var divsL_weather = L_weather.getElementsByTagName("div");
            for (var j = 0; j < divsL_weather.length; j++) {
              var classV2 = divs[j].getAttribute("class");
              if (classV2 == "todayRight") {

                var todayRight = doc.getElementsByTagName("div")[j];
                //console.log('仙裙' + todayRight)
                var divsTodayRightr = todayRight.getElementsByTagName("div");
                for (var k = 0; k < divsTodayRightr.length; k++) {
                  var classV3 = divs[k].getAttribute("class");
                  if (classV3 == "todayCharts") {
                    var todayCharts = doc.getElementsByTagName("div")[k];

                    //同时设几个变量(数组，全部html，时间，天气，风向，风力)
                    var data = [],
                      html, time, housr_icons_w, wind, windL;
                    var weatherALL = todayCharts.getElementsByTagName('ul')[0];
                    var weatherALLs = weatherALL.getElementsByTagName('li');
                    //打印标签之间的内容，包括标签和文本信息
                    //console.log('仙裙' + weatherALL.innerHtml)

                    for (var l = 0; l < weatherALLs.length; l++) {
                      var classV5 = weatherALLs[l];
                      var c1 = classV5.getAttribute("class");
                      //当前所在小时的预报情况
                      //if (c1 == "cur") {

                      var divsHousrWeather = classV5.getElementsByTagName("div");
                      for (var m = 0; m < divsHousrWeather.length; m++) {
                        var classV6 = divsHousrWeather[m].getAttribute("class");
                        //当前时间(小时)
                        if (classV6 == "time") {
                          console.log('[仙裙]' + divsHousrWeather[m].textContent)
                        }

                        //温度
                        if (classV6 == "charts") {
                          console.log('[仙裙]' + divsHousrWeather[m].textContent)
                        }
                        //风向
                        if (classV6 == "wind") {
                          console.log('[仙裙]' + divsHousrWeather[m].textContent)
                        }
                        //风力
                        if (classV6 == "windL") {
                          //打印标签之间的纯文本信息，会将标签过滤掉
                          //console.log('仙裙' + divsHousrWeather[m].innerText)
                          //console.log('仙裙' + divsHousrWeather[m].getText)
                          console.log('[仙裙]' + divsHousrWeather[m].textContent)
                        }
                      }

                      var iHousr_icons_w = classV5.getElementsByTagName("i");
                      for (var m1 = 0; m1 < iHousr_icons_w.length; m1++) {
                        var classV6 = iHousr_icons_w[m1].getAttribute("class");
                        var titleV6 = iHousr_icons_w[m1].getAttribute("title");
                        //天气
                        if (classV6 == "weather housr_icons_w d07") {
                          console.log('[仙裙]' + titleV6)
                        }
                      }

                      console.log(" ")
                    }
                  }
                }
              }
            }
          }
        }
      },
    })

    /** 
        var x1 = doc.getElementsByTagName('DBID')[0]
        var x2 = doc.getElementsByTagName('SEQUENCE')[0]
        var x3 = doc.getElementsByTagName('MAXNS')[0]
        var x4 = doc.getElementsByTagName('MINIDENTITIES')[0]
        var x5 = doc.getElementsByTagName('MAXEVALUE')[0]
        var x6 = doc.getElementsByTagName('USERNAME')[0]
        var x7 = doc.getElementsByTagName('PASSWORD')[0]
        var x8 = doc.getElementsByTagName('TYPE')[0]
        var x9 = doc.getElementsByTagName('RETURN_TYPE')[0].firstChild.nodeValue
        */

    //console.log(x0+'')
    //console.log(x1+'')
    //console.log(x2.firstChild.nodeValue)
    //console.log(x3.firstChild.nodeValue)
  },
  //═══════════════════════════════════════════════════════════════════════════════════════════════════════╝






  //═══════════════════════════════════════════════════════════════════════════════════════════════════════╗
  //中国天气网API获取遂溪天气
  getSX1() {
    //微信get请求
    wx.request({
      //请求接口
      url: 'http://www.weather.com.cn/data/sk/101281007.html',
      //url: 'http://www.weather.com.cn/data/cityinfo/101281007.html',
      //url: 'http://mobile.weather.com.cn/data/forecast/101281007.html?_=1381891660081',
      //请求成功（箭头函数，参数：res）
      success: res => {
        //打印日志
        console.log("遂溪1")
        console.log(res)
      },
    })
  },
  //═══════════════════════════════════════════════════════════════════════════════════════════════════════╝


})