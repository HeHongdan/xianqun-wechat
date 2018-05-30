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

//常数变量(标记定位权限)
const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

const UNPROMPTED_TIPS = "点击获取当前位置"
const UNAUTHORIZED_TIPS = "点击开启位置权限"
const AUTHORIZED_TIPS = ""

Page({
  /**
   * 页面的初始数据//动态绑定数据(对应.wxml文件)
   */
  data: {
    nowTemp: '100°',
    nowWeather: '超时',
    nowWeatherBackground: '/images/sunny-bg.png',
    hourlyWeather: [],
    todayDate: "",
    todayTemp: "",
    city: '广州市',
    locationTipsText: "点击获取当前位置",
    locationAuthType: UNPROMPTED, UNAUTHORIZED, AUTHORIZED
  },

  //生命周期onLoad
  onLoad() {
    // 实例化腾讯地图API核心类
    this.qqmapsdk = new QQMapWX({
      key: 'MJQBZ-V3K33-ZEY3B-YMHUZ-NB6OV-XVFG6'
    })
    this.getNow()
    //this.getSX1()
    //this.getSX2()
    //this.getSX3()
  },

  //下拉刷新事件
  onPullDownRefresh() {
    //传入匿名函数
    this.getNow(() => {
      wx.stopPullDownRefresh()
      console.log("停止下拉刷新")
    })
  },



  //中国天气网API获取遂溪天气
  getSX1() {
    //微信get请求
    wx.request({
      //请求接口
      url: 'http://www.weather.com.cn/data/sk/101281007.html',
      //请求成功（箭头函数，参数：res）
      success: res => {
        //打印日志
        console.log("遂溪1")
        console.log(res)
      },
    })
  },
  getSX2() {
    //微信get请求
    wx.request({
      //请求接口
      url: 'http://www.weather.com.cn/data/cityinfo/101281007.html',
      //请求成功（箭头函数，参数：res）
      success: res => {
        //打印日志
        console.log("遂溪2")
        console.log(res)
      },
    })
  },
  getSX3() {
    //微信get请求
    wx.request({
      //请求接口
      url: 'http://mobile.weather.com.cn/data/forecast/101281007.html?_=1381891660081',
      //请求成功（箭头函数，参数：res）
      success: res => {
        //打印日志
        console.log("遂溪3")
        console.log(res)
      },
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
        console.log(res)

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
    if (this.data.locationAuthType === UNAUTHORIZED)
      wx.openSetting()
    else
      this.getLocation()
  },

  //获取(定位)经纬度
  getLocation() {
    //微信接口获取本地(定位)经纬度
    wx.getLocation({
      /** 获取定位成功 */
      success: res => {
        this.setData({
          locationAuthType: AUTHORIZED,
          locationTipsText: AUTHORIZED_TIPS,
        })
        console.log(res.latitude, res.longitude)
        //腾讯地图接口根据本地(定位)经纬度逆地址解析城市
        this.qqmapsdk.reverseGeocoder({
          location: {
            //经度
            latitude: res.latitude,//31.23772,//
            //纬度
            longitude: res.longitude//121.47772 //
          },
          success: res => {
            let city = res.result.address_component.city
            console.log(city)
            //赋值城市和提示
            this.setData({
              city: city,
              locationTipsText: ""
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
          locationTipsText: UNAUTHORIZED_TIPS,
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
  }


})