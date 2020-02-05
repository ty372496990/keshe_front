import request from '@/utils/request'

export default {
  //分页查询的函数
  //当前页，每页记录数，条件封装对象
  getTeacherPageList(page, limit, searchObj) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-teacher/moreConditionPageList/' + page + '/' + limit,
      method: 'post',
      //传递对象，如果传递的是Json数据，使用data
      //如果不是json，则用params
      data: searchObj
    })
  },
  deleteTeacher(id) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-teacher/' + id,
      method: 'delete'
    })
  },
  saveTeacher(teacher) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-teacher/addTeacher',
      method: 'post',
      data: teacher
    })
  },
  getTeacherById(id) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-teacher/getTeacher/'+id,
      method: 'get'
    })
  },
  //修改讲师
  updateTeacherById(id,teacher) {
    return request({
      //后台Controller里面的路径
      url: '/school_eduservice/edu-teacher/upDateTeacher/'+id,
      method: 'post',
      data: teacher
    })
  }
}
