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
    nowWeatherBackground: '/images/sunny-bg.png'
  },

  //生命周期onLoad
  onLoad() {
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

      }
    })
  }

})