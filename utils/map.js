//字符映射关系
exports.weatherMap_ = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪',
}

//颜色和天气（映射关系）
exports.weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}


//风向（映射关系）
exports.windDirectionMap = {
  '0': '无持续风向',
  '1': '东北风',
  '2': '东风',
  '3': '东南风',
  '4': '南风',
  '5': '西南风',
  '6': '西风',
  '7': '西北风',
  '8': '北风',
  '9': '旋转风',
}
//风向（映射关系）
exports.windDirectionString2Int = {
  '无持续风向': '0',
  '东北风': '1',
  '东风': '2',
  '东南风': '3',
  '南风': '4',
  '西南风': '5',
  '西风': '6',
  '西北风': '7',
  '北风': '8',
  '旋转风': '9',
}

//风力（映射关系）
exports.windForceMap = {
  '0': '0<3级',
  '1': '3-4级',
  '2': '4-5级',
  '3': '5-6级',
  '4': '6-7级',
  '5': '7-8级',
  '6': '8-9级',
  '7': '9-10级',
  '8': '10-11级',
  '9': '11-12级',
}
//风力（映射关系）
exports.windForceString2Int = {
  '0<3级': '0',
  '3-4级': '1',
  '4-5级': '2',
  '5-6级': '3',
  '6-7级': '4',
  '7-8级': '5',
  '8-9级': '6',
  '9-10级': '7',
  '10-11级': '8',
  '11-12级': '9',
}

//天气（映射关系）
exports.weatherMap = {
  '00': '晴',
  '01': '多云',
  '02': '阴',
  '03': '阵雨',
  '04': '雷阵雨',
  '05': '雷阵雨伴有冰雹',
  '06': '雨夹雪',
  '07': '小雨',
  '08': '中雨',
  '09': '大雨',
  '10': '暴雨',
  '11': '大暴雨',
  '12': '特大暴雨',
  '13': '阵雪',
  '14': '小雪',
  '15': '中雪',
  '16': '大雪',
  '17': '暴雪',
  '18': '雾',
  '19': '冻雨',
  '20': '沙尘暴',
  '21': '小到中雨',
  '22': '中到大雨',
  '23': '大到暴雨',
  '24': '暴雨到大暴雨',
  '25': '小到中雪',
  '26': '中到大雪',
  '27': '大到暴雪',
  '28': '浮尘',
  '29': '扬沙',
  '30': '强沙尘暴',
  '31': '霾',
  '32': '无',

  '010': '暴雨',
  '011': '大暴雨',
  '012': '特大暴雨',
  '013': '阵雪',
  '014': '小雪',
  '015': '中雪',
  '016': '大雪',
  '017': '暴雪',
  '018': '雾',
  '019': '冻雨',
  '020': '沙尘暴',
  '021': '小到中雨',
  '022': '中到大雨',
  '023': '大到暴雨',
  '024': '暴雨到大暴雨',
  '025': '小到中雪',
  '026': '中到大雪',
  '027': '大到暴雪',
  '028': '浮尘',
  '029': '扬沙',
  '030': '强沙尘暴',
  '031': '霾',
  '032': '无',
}
//天气（映射关系）
exports.weatherString2Int = {
  '晴': '00',
  '多云': '01',
  '阴': '02',
  '阵雨': '03',
  '雷阵雨': '04',
  '雷阵雨伴有冰雹': '05',
  '雨夹雪': '06',
  '小雨': '07',
  '中雨': '08',
  '大雨': '09',
  '暴雨': '10',
  '大暴雨': '11',
  '特大暴雨': '12',
  '阵雪': '13',
  '小雪': '14',
  '中雪': '15',
  '大雪': '16',
  '暴雪': '17',
  '雾': '18',
  '冻雨': '19',
  '沙尘暴': '20',
  '小到中雨': '21',
  '中到大雨': '22',
  '大到暴雨': '23',
  '暴雨到大暴雨': '24',
  '小到中雪': '25',
  '中到大雪': '26',
  '大到暴雪': '27',
  '浮尘': '28',
  '扬沙': '29',
  '强沙尘暴': '30',
  '霾': '31',
  '无': '32',

  '暴雨': '010',
  '大暴雨': '011',
  '特大暴雨': '012',
  '阵雪': '013',
  '小雪': '014',
  '中雪': '015',
  '大雪': '016',
  '暴雪': '017',
  '雾': '018',
  '冻雨': '019',
  '沙尘暴': '020',
  '小到中雨': '021',
  '中到大雨': '022',
  '大到暴雨': '023',
  '暴雨到大暴雨': '024',
  '小到中雪': '025',
  '中到大雪': '026',
  '大到暴雪': '027',
  '浮尘': '028',
  '扬沙': '029',
  '强沙尘暴': '030',
  '霾': '031',
  '无': '032',
}