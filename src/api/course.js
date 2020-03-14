import request from '@/utils/request'

export default {
  addCourseInfo(courseInfo) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-course',
      method: 'post',
      //传递对象，如果传递的是Json数据，使用data
      //如果不是json，则用params
      data: courseInfo
    })
  },
  //获取教师信息
  getAllTeacherList() {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-teacher',
      method: 'get',
      //传递对象，如果传递的是Json数据，使用data
      //如果不是json，则用params
    })
  },
  getAllCourseList(id) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-course/getCourseInfo/'+id,
      method: 'get',
      //传递对象，如果传递的是Json数据，使用data
      //如果不是json，则用params
    })
  },
  updateCourse(infoForm) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-course/update',
      method: 'post',
      //传递对象，如果传递的是Json数据，使用data
      //如果不是json，则用params
      data: infoForm
    })
  },
  getPageList(page, limit, searchObj) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-course/'+page+'/'+limit,
      method: 'get',
      //传递对象，如果传递的是Json数据，使用data
      //如果不是json，则用params
      data: searchObj
    })
  },
  deleteCourse(id) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-course/deleteCourse/'+id,
      method: 'delete',
      //传递对象，如果传递的是Json数据，使用data
      //如果不是json，则用params
    })
  },
  getAllCourseInfo(id) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-course/getAllCourseInfo/'+id,
      method: 'get',
      //传递对象，如果传递的是Json数据，使用data
      //如果不是json，则用params
    })
  },
  publishCourse(id) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-course/publishCourse/'+id,
      method: 'post',
      //传递对象，如果传递的是Json数据，使用data
      //如果不是json，则用params
    })
  },
  getUserPage(page,limit) {
    return request({
      url: `/userservice/ucenter-member/${page}/${limit}`,
      method: 'get',
    })
  },
  deleteUserById(id) {
    return request({
      url: `/userservice/ucenter-member/removeUserById/${id}`,
      method: 'delete'
    })
  }
};
