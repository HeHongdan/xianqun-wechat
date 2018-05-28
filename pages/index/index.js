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

Page({

  //动态绑定数据(对应.wxml文件)
  data: {
    nowTemp: '14℃',
    nowWeather: '多云',
    nowWeatherBackground: '/images/sunny-bg.png',
    hourlyWeather: []
  },

  //生命周期onLoad
  onLoad() {
    this.getNow()
    this.getSX1()
    this.getSX2()
    this.getSX3()
  },

  //下拉刷新事件
  onPullDownRefresh(){
    //传入匿名函数
    this.getNow(()=>{
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
  getSX3(){
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
  getNow(callback){
    //微信get请求
    wx.request({
      //请求接口
      url: 'https://test-miniprogram.com/api/weather/now',
      //请求参数
      data: {
        city: '广州市'
      },
      //请求成功（箭头函数，参数：res）
      success: res => {
        //打印日志
        console.log(res)

        //取出data标签下的result赋值给result（var：全局变量、let：局部(块级)变量、const ：声明常量(块级)）
        let result = res.data.result
        let temp = result.now.temp
        let weather = result.now.weather

        console.log(temp, weather)

        //异步改变显示内容
        this.setData({
          //字符拼接
          nowTemp: temp + '℃',
          //使用映射关系赋值
          nowWeather: weatherMap[weather],
          nowWeatherBackground: '/images/' + weather + '-bg.png'
        })

        //动态改变导航栏颜色
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        })

        /**设置forcast列表**/
        let forecast = result.forecast
        //获取当前小时
        let nowHour = new Date().getHours()
        let hourlyWeather = []
        //for循环设值
        for(let i = 0; i<24;i+=3){
          hourlyWeather.push({
            //赋值时间
            time: (i+nowHour) % 24 + '时',
            //赋值icon
            iconPath: '/images/' + forecast[i / 3].weather + '-icon.png',
            //赋值温度
            temp: forecast[i/3].temp+'℃'
          })
        }
        //设值列表第一项
        hourlyWeather[0].time = '现在'
        this.setData({
          hourlyWeather: hourlyWeather
        })

      },

      //执行停止当前页面下拉刷新
      complete: ()=>{
        //callback不为空执行callb()
        callback && callback()
      }

    })
  }

})