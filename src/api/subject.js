import request from '@/utils/request'

export default {
  getNestedTreeList() {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-subject',
      method: 'get',
      //传递对象，如果传递的是Json数据，使用data
      //如果不是json，则用params
    })
  },
  removeById(id) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-subject/' + id,
      method: 'delete'
    })
  },
  addFirstSubject(subject) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-subject/addFirst' ,
      method: 'post',
      data: subject
    })
  },
  addSecondSubject(subject) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-subject/addSecond',
      method: 'post',
      data: subject
    })
  },
}
