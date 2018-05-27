Page({
  
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

        let result = res.data.result
        let temp = result.now.temp
        let weather = result.now.weather

        console.log(temp,weather)
      }
    })
  }

})