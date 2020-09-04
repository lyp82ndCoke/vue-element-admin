//会员训练营模块所有接口
import request from '@/utils/groupRequset'

//获取训练营列表
export function getCampList(params) {
  return request({
    url: '/membership/Camp/getCampList',
    method: 'post',
    params
  })
}

//修改训练营
export function updateCamp(params) {
  return request({
    url: '/membership/Camp/updateCamp',
    method: 'post',
    params
  })
}

//新增训练营
export function addCamp(params) {
  return request({
    url: '/membership/Camp/addCamp',
    method: 'post',
    params
  })
}

//训练营课程资料列表
export function getCampCourseMaterialList(params) {
  return request({
    url: '/membership/Course/getCampCourseMaterialList',
    method: 'post',
    params
  })
}

//训练营新增课程
export function addCampCourse(params) {
  return request({
    url: '/membership/Course/addCampCourse',
    method: 'post',
    params
  })
}

//训练营新增资料
export function addCampMaterial(params) {
  return request({
    url: '/membership/Material/addCampMaterial',
    method: 'post',
    params
  })
}