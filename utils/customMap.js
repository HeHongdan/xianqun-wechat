/** 
 * 自定义地图工具
 * 
 * 何洪丹
 * 20180707
*/

//将模块接口暴露出来
//转化成小程序模板语言
module.exports = {
  latitude: latitude,
  longitude: longitude,
  calculateDistance: calculateDistance,
}

//江洪镇客运站纬度
var latitude = 21.03079
//江洪镇客运站经度
var longitude = 109.707848
//"仙裙岛"
//{ lng: 109.704185, lat: 21.024023 }

/**
 * 计算两坐标点之间的距离
 * 
 * lat1 地点1的纬度
 * lng1 地点1的经度
 * lat2 地点2的纬度
 * lng2 地点2的经度
 * 
 * 返回两地距离（定位=米）
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  lat1 = lat1 || 0;
  lng1 = lng1 || 0;
  lat2 = lat2 || 0;
  lng2 = lng2 || 0;
  var rad1 = lat1 * Math.PI / 180.0;
  var rad2 = lat2 * Math.PI / 180.0;
  var a = rad1 - rad2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var r = 6378137;
  return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0);
}