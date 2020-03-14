import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/school_eduservice/edu-teacher/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/school_eduservice/edu-teacher/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getUserPage(page,limit) {
  return request({
    url: `/userservice/ucenter-member/${page}/${limit}`,
    method: 'get',
  })
}

