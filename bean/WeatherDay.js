/** 
 * 每天天气
 * 
 * 何洪丹
 * 20180710
 */

//将模块接口暴露出来
//转化成小程序模板语言
module.exports = {
  createDay: create,
  addDay: add,
};

export default Behavior({
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
  },
});

/**
 * 工厂模式创建对象 * 一天的天气
 * date 日期
 * tempDay 温度(高)
 * tempNight 温度(低)
 * weather1 天气情况1
 * weather2 天气情况1
 * wind1 风向1
 * wind2 风向1
 * windForce 风力
 * 
 * 返回一天的天气对象
*/
function create(date, tempDay, tempNight, weather1, weather2, wind1, wind2, windForce) {
  var weatherDay = new Object();
  weatherDay.date = date;
  weatherDay.tempDay = tempDay;
  weatherDay.tempNight = tempNight;
  weatherDay.weather1 = weather1;
  weatherDay.weather2 = weather2;
  weatherDay.wind1 = wind1;
  weatherDay.wind2 = wind2;
  weatherDay.windForce = windForce;

  // o.sayName = function() {
  //   alert(this.name);
  // }
  return weatherDay;　　
};

/** 
 * 向服务器新增一行记录（Bmob）
 * 
 * 服务器工具
 * 一天的天气对象
 */
function add(query, weatherDay){
  //const query = Bmob.Query('WeatherDay');
  query.set("date", weatherDay.date)
  query.set("tempDay", weatherDay.tempDay)
  query.set("tempNight", weatherDay.tempNight)
  query.set("weather1", weatherDay.weather1)
  query.set("weather2", weatherDay.weather2)
  query.set("wind1", weatherDay.wind1)
  query.set("wind2", weatherDay.wind2)
  query.set("windForce", weatherDay.windForce)
  query.save().then(res => {
    //console.log('一天天气新增成功=')
    //console.log(res)
  }).catch(err => {
    //console.log('一天天气新增失败=')
    //console.log(err)
  });
};