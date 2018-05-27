Page({

//动态绑定数据(对应.wxml文件)
  data:{
    nowTemp : 14,
    nowWeather : "多云"
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
        console.log(res)
        //取出data标签下的result赋值给result（var：全局变量、let：局部(块级)变量、const ：声明常量(块级)）
        let result = res.data.result
        let temp = result.now.temp
        let weather = result.now.weather

        console.log(temp,weather)
      }
    })
  }

})