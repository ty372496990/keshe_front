import request from '@/utils/request'

export default {
  getChapterTreeList(courseId) {
    return request({
      url: '/school_eduservice/edu-chapter/getChapterList/' + courseId,
      method: 'get'
    })
  },
  removeById(id) {
    return request({
      url: '/school_eduservice/edu-chapter/'+ id,
      method: 'delete'
    })
  },

  save(chapter) {
    return request({
      url: '/school_eduservice/edu-chapter/addChapter',
      method: 'post',
      data: chapter
    })
  },

  getById(id) {
    return request({
      url: '/school_eduservice/edu-chapter/getChapter/'+id,
      method: 'get'
    })
  },

  updateById(chapter) {
    return request({
      url: '/school_eduservice/edu-chapter/updateChapter',
      method: 'post',
      data: chapter
    })
  }
}
