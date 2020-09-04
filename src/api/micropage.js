// 商城-微页面
import request from '@/utils/request'

/*  获取微页面详情
*/
export function getPage(data) {
  return request({
    url: '/micropage/Page/getPage',
    method: 'post',
    data
  })
}

/*  新增微页面
*/
export function insertPage(data) {
  return request({
    url: '/micropage/Page/insertPage',
    method: 'post',
    data
  })
}

/*  编辑微页面
*/
export function updatePage(data) {
  return request({
    url: '/micropage/Page/updatePage',
    method: 'post',
    data
  })
}


/*  后台获取微页面列表
*/
export function getPageList(data) {
  return request({
    url: '/micropage/page/getPageList',
    method: 'post',
    data
  })
}

/*  后台微页面上架
*/
export function updateStatus(data) {
  return request({
    url: '/micropage/page/updateStatus',
    method: 'post',
    data
  })
}

/*  后台微页面设为首页
*/
export function updateIndex(data) {
  return request({
    url: '/micropage/page/updateIndex',
    method: 'post',
    data
  })
}