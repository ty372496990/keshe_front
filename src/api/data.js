import request from '@/utils/request'

export default {
  //生成数据
  createStatistics(day) {
    return request({
      url: `/staservice/statistics-daily/getStatistic/`+day,
      method: 'get'
    })
  },
  //生成图表
  createGraph(searchObj) {
    return request({
      url: `/staservice/statistics-daily/getDataCount/`+searchObj.type+'/'+searchObj.begin+'/'+searchObj.end,
      method: 'get'
    })
  }
}