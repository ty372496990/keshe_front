import request from '@/utils/request'

export default {
  saveVideoInfo(videoInfo) {
    return request({
      url: `/school_eduservice/edu-video/addVideo`,
      method: 'post',
      data: videoInfo
    })
  },

  getVideoInfoById(id) {
    return request({
      url: `/school_eduservice/edu-video/`+ id,
      method: 'get'
    })
  },

  updateVideoInfoById(videoInfo) {
    return request({
      url: `/school_eduservice/edu-video/updateVideo`,
      method: 'post',
      data: videoInfo
    })
  },

  removeById(id) {
    return request({
      url: `/school_eduservice/edu-video/deleteVideo/`+id,
      method: 'delete'
    })
  },
  removeVideoById(id) {
    return request({
      url: `/school_videoservice/video/` + id,
      method: 'delete'
    })
  }
}
