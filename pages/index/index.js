/** 
 * 解析XML天气数据（中国天气网）
 * 
 * 何洪丹
 * 20180710
 */

//导入模块（解析天气工具）
import { parseWeather } from '../../utils/parseWeather.js';
/**引用外部的js文件*/
//小时天气bean
var weatherHourBean = require('../../bean/WeatherHour.js');
//天天气bean
var weatherDayBean = require('../../bean/WeatherDay.js');
//自定义地图工具
var customMapUtil = require('../../utils/customMap.js');
//字符映射关系
var mapUtil = require('../../utils/map.js');
//获取Bmob实例
var Bmob = require('../../libs/bmob/Bmob-1.6.1.min.js');
//常数变量(腾讯地图)
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
//常数变量(解析xml)
var Parser = require('../../libs/xmldom/dom-parser.js');

//常数变量(标记定位权限)
const UNPROMPTED = 0;
const UNAUTHORIZED = 1;
const AUTHORIZED = 2;
//导入（获取）App对象
const app = getApp();
//江洪镇天气网址（中国天气网）
const weatherUrlJiangHong = 'http://forecast.weather.com.cn/town/weathern/101281007009.shtml';
//获取天气服务器（优达）
const weatherUrlUdacity = 'https://test-miniprogram.com/api/weather/now';
/** 用户填写照片米数 */
var remainder = 520;


Page({
  //页面的初始数据//动态绑定数据(对应.wxml文件)
  data: {
    nowTemp: '・ω・', //•́ ₃ •̀'
    nowWeather: '加载中',
    nowWeatherBackground: '/images/sunny-bg.png',
    hourlyWeather: [],
    todayDate: "",
    todayTemp: "",
    city: '仙裙岛',
    locationAuthType: UNPROMPTED,
    UNAUTHORIZED,
    AUTHORIZED
  },

  /**
   * 生命周期onLoad
   */
  onLoad() {
    //QQMapWX获取位置信息
    this.getLocationByQQMapWX();
    //获取定位信息计算照片距离
    this.getLocation(remainder);
    //获取天气来自中国天气网
    this.getWeatherComCn(weatherUrlJiangHong);
    //测试Bmob数据库
    //this.getBmobData();
  },

  /**
   * 下拉刷新事件
   */
  onPullDownRefresh() {
    //传入匿名函数
    this.getNow(weatherUrlUdacity, () => {
      //停止当前页面下拉刷新
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 获取服务器数据并设置视图的函数
   * 
   * @param {*} url 天气Url
   * @param {*} callback 传入回调函数
   */
  getNow(url, callback) {
    //微信get请求
    wx.request({
      //请求接口
      url: url,
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

      //执行回调函数
      complete: () => {
        //callback不为空执行callb()
        callback && callback()
      }
    })
  },

  /**
   * 设置当前天气及视图状态
   * 
   * @param {*} result 天气结果
   */
  setNow(result) {
    //取出当前温度
    let temp = result.now.temp
    //取出当前天气
    let weather = result.now.weather

    //console.log(temp, weather)

    //动态改变导航栏颜色
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: mapUtil.weatherColorMap[weather],
    })

    //异步改变显示内容
    this.setData({
      //字符拼接
      nowTemp: temp + '°',
      //使用映射关系赋值
      nowWeather: mapUtil.weatherMap_[weather],
      nowWeatherBackground: '/images/' + weather + '-bg.png'
    })
  },

  /**
   * 设置未来24小时天气
   * 
   * @param {*} result 天气结果
   */
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

  /**
   * 设置今天的天气最低最高温
   * @param {*} result 天气结果
   */
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

  /**
   * 按钮事件（跳转页面）
   */
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

  /**
   * 获取定位信息计算照片距离(江洪)
   * 
   * @param {*} remainder 照片与江洪客运站的距离
   */
  getLocation(remainder) {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        //距离计算
        var cMU = customMapUtil.calculateDistance(customMapUtil.latitude, customMapUtil.longitude, latitude, longitude);
        console.log("自定义计算距离=" + cMU);
        console.log("经度=" + longitude + "1纬度=" + latitude)
        //吐司显示
        wx.showToast({
          title: Math.round(cMU / 1000) + "公里+" + remainder + "米",
          duration: 5000,
          mask: true
        })
      }
    });
  },

  /**
   * 根据QQMapWX位置信息获取天气（伪数据）
   */
  getLocationByQQMapWX() {
    // 实例化腾讯地图API核心类（建议调到APP.js）
    this.qqmapsdk = new QQMapWX({
      key: 'MJQBZ-V3K33-ZEY3B-YMHUZ-NB6OV-XVFG6'
    });
    //地址解析（地址转坐标）
    // this.qqmapsdk.geocoder({
    //   address: '广东省湛江市遂溪县仙裙岛',
    //   success: function (res) {
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   },
    //   complete: function (res) {
    //     console.log(res);
    //   }
    // });

    //
    // this.qqmapsdk.reverseGeocoder({
    //   location: {
    //     latitude: 21.030784,
    //     longitude: 109.707853
    //   },
    //   success: function (res) {
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   },
    //   complete: function (res) {
    //     console.log(res);
    //   }
    // });

    /**
     * 获取设置定位状态
     */
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
          this.getNow(weatherUrlUdacity)
        }

      }
    });
  },

  /**
   * 获取中国天气网(江洪)
   */
  getWeatherComCn(url) {
    var XMLParser = new Parser.DOMParser();

    wx.request({
      //请求接口
      url: url,
      //请求成功（箭头函数，参数：res）
      success: res => {
        //weatherUtil.parse(XMLParser, res, WDB).date;

        parseWeather(XMLParser, res, function (dayWeatherArray, hourWeatherArray) {
          //添加天天气的工具（Bmob）
          const queryWeatherDay = Bmob.Query('WeatherDay');
          //添加小时天气的工具（Bmob）
          const queryWeatherHour = Bmob.Query('WeatherHour');
          //缓存一天天气
          var weatherDay;
          //缓存一小时天气
          var weatherHour;

          for (var i = 0; i < dayWeatherArray.length; i++) {
            //console.log('[仙裙] 回调数组' + data[i].date);
            weatherDay = dayWeatherArray[i];
            //weatherDayBean.create(ad.date, tempDay, tempNight, weather1, weather2, wind1, wind2, windForce);
            // console.log('[仙裙] 回调数组：时间=' + weatherDay.date +
            //         '，天气1=' + weatherDay.weather1 +
            //         '，天气2=' + weatherDay.weather2 +
            //         '，温度1=' + weatherDay.tempDay +
            //         '，温度2=' + weatherDay.tempNight +
            //         '，风向1=' + weatherDay.wind1 +
            //         '，风向2=' + weatherDay.wind2 +
            //         '，风力=' + weatherDay.windForce);
            weatherDayBean.add(queryWeatherDay, weatherDay);
            console.log('[仙裙] 回调数组：天=' + JSON.stringify(weatherDay));
          }

          for (var j = 0; j < hourWeatherArray.length; j++) {
            weatherHour = hourWeatherArray[j];
            weatherHourBean.add(queryWeatherHour, weatherHour);
            console.log('[仙裙] 回调数组：小时=' + JSON.stringify(weatherHour));
          }



          wx.showToast({
            title: "回调处理 " + dayWeatherArray,
            duration: 5000,
            mask: true
          })
        });

      }
    });
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
  onShow: function () {
    //登录
    // app.checkSession({
    //   success: ({
    //     userInfo
    //   }) => {
    //     this.setData({
    //       userInfo
    //     })
    //   }
    // });
  },

  /**
   * 获取城市(定位)和天气（伪数据）
  */
  getCityAndWeather() {
    //纬度
    //var lat;
    //经度
    //var lng;

    //微信接口获取本地(定位)经纬度
    wx.getLocation({
      /** 获取定位成功 */
      success: res => {
        this.setData({
          locationAuthType: AUTHORIZED,
        })
        //lat = res.latitude;
        //lng = res.longitude;
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

            //距离计算
            //var cMU = customMapUtil.calculateDistance(21.03079, 109.707848, lat, lng);
            //console.log("自定义计算距离=" + cMU);
            //console.log("经度=" + lng + "纬度=" + lat)

            //console.log(city)
            //赋值城市和提示
            this.setData({
              city: city,
            })

            //重新获取并设置数据
            this.getNow(weatherUrlUdacity)

            //吐司显示
            // wx.showToast({
            //   title: city,
            //   icon: 'succes',
            //   duration: 1000,
            //   mask: true
            // })

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

  /**
   * 测试Bmob增删改查
   */
  getBmobData() {
    //Bmob----------------------------------------------------------------------
    //注册
    // let params = {
    //   username: '何洪丹',
    //   password: 'hehongdan',
    //   email: 'hehongdan@126.com',
    //   phone: '18022647864',
    // }
    // Bmob.User.register(params).then(res => {
    //   console.log('Bmob注册成功=')
    //   console.log(res)
    // }).catch(err => {
    //   console.log('Bmob注册失败=')
    //   console.log(err)
    // });
    //登陆
    Bmob.User.login('何洪丹', 'hehongdan').then(res => {
      console.log('Bmob登录成功=')
      console.log(res)
    }).catch(err => {
      console.log('Bmob登录失败=')
      console.log(err)
    });
    /** 更新用户缓存 */
    // Bmob.User.updateStorage('objectId').then(res => {
    //   console.log(res)
    // }).catch(err => {
    //   console.log(err)
    // });
    /** 验证 Email */
    // Bmob.User.requestEmailVerify('bmob2018@bmob.cn').then(res => {
    //   console.log(res)
    // }).catch(err => {
    //   console.log(err)
    // });

    /** 密码重置 */
    // let data = {
    //   email: 'hehongdan@126.com'
    // }
    // Bmob.requestPasswordReset(data).then(res => {
    //   console.log(res)
    // }).catch(err => {
    //   console.log(err)
    // });

    /** 新增一行记录 */
    const query = Bmob.Query('WeatherDay');
    query.set("date", "20180000")
    query.set("tempDay", -1)
    query.set("tempNight", 30)
    query.set("weather1", "阴")
    query.set("weather2", "晴")
    query.set("wind1", "北风")
    query.set("wind2", "南风")
    query.set("windForce", "12级")
    query.save().then(res => {
      console.log('Bmob新增成功=')
      console.log(res)
    }).catch(err => {
      console.log('Bmob新增失败=')
      console.log(err)
    });
    /** 查询所有数据 */
    //const query = Bmob.Query("WeatherDay");
    query.find().then(res => {
      console.log('Bmob查询所有数据，总数=' + res.length)
      console.log(res)
      for (var i = 0; i < res.length; i++) {
        //var object = res[i];
        //console.log('Bmob查询所有数据，第'+object.id + '条的时间=' + object.get('date'));
        if (i === 0) {
          var object = res[i];
          console.log('Bmob指定查询，ID=' + object.objectId + "，日期=" + object.date)
        }
      }
    });
    /** 获取一行记录 */
    //const query = Bmob.Query('tableName');
    query.get('f6bec20b3f').then(res => {
      console.log('Bmob单条查询成功=')
      console.log(res)
    }).catch(err => {
      console.log('Bmob查询失败=')
      console.log(err)
    });



    /** 支持批量上传 */
    // wx.chooseImage({
    //   success: function (res) {
    //     console.log(res)
    //     var tempFilePaths = res.tempFilePaths
    //     var file;
    //     for (let item of tempFilePaths) {
    //       console.log('itemn', item)
    //       file = Bmob.File('abc.jpg', item);
    //     }
    //     file.save().then(res => {
    //       console.log(res.length);
    //       console.log(res);
    //     })
    //   }
    // });


    /** 添加地理位置 */
    // const point = Bmob.GeoPoint({ latitude: 23.052033, longitude: 113.405447 })
    // const query = Bmob.Query('tableName');
    // query.set("字段名称", point)
    // query.save().then(res => {
    //   console.log(res)
    // }).catch(err => {
    //   console.log(err)
    // });
    /** 查询地理位置 */
    // const query = Bmob.Query("tableName");
    // query.withinKilometers("字段名", point, 10);  //10指的是公里
    // query.find().then(res => {
    //   console.log(res)
    // });
    //----------------------------------------------------------------------
  },


})