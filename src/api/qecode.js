//训练营(群)
//二维案管理 && 订单管理 && 商品管理
import request from '@/utils/groupRequset'

//获取二维码 列表
export function getSourcesList(params) {
  return request({
    url: '/service/chatroomdis/chatroom/get_sources_list',
    method: 'get',
    params
  })
}
/*
  添加二维码
  | 请求参数 | 是否必须 | 说明
  | qr_code_name | Y | 二维码名称
  | qr_code_type | Y | 二维码类型 1群 2管理员
  | qr_code_url | Y | 二维码URL
*/
export function addSources(data) {
  return request({
    url: '/service/chatroomdis/chatroom/add_sources',
    method: 'post',
    data
  })
}
/*
  修改二维码
  | 请求参数 | 是否必须 | 说明
  | qr_code_id | Y | 二维码ID
  | qr_code_name | Y | 二维码名称
  | qr_code_type | Y | 二维码类型 1群 2管理员
  | qr_code_url | Y | 二维码URL
*/
export function updateSources(data) {
  return request({
    url: '/service/chatroomdis/chatroom/update_sources',
    method: 'post',
    data
  })
}

//查询SKU规格项列表
export function getSkuList(params) {
  return request({
    url: '/service/shop/item/get_sku_k_list',
    method: 'get',
    params
  })
}
/*
  添加SKU规格项
  | 请求参数 | 是否必须 | 说明
  | sku_k | Y | 规格名称
 */
export function addSkuProject(data) {
  return request({
    url: '/service/shop/item/add_sku_k',
    method: 'post',
    data
  })
}
/*
  添加SKU规格值
  | 请求参数 | 是否必须 | 说明
  | sku_kid | Y | 规格ID
  | sku_v | Y | 规格值
 */
export function addSkuValue(data) {
  return request({
    url: '/service/shop/item/add_sku_v',
    method: 'post',
    data
  })
}
/*
  查询SKU规格值列表
  | 请求参数 | 是否必须 | 说明
  | sku_kid | Y | 规格ID
 */
export function getSkuValueList(params) {
  return request({
    url: '/service/shop/item/get_sku_v_list',
    method: 'get',
    params
  })
}

//商品管理 商品列表
export function getItemList(params) {
  return request({
    url: '/service/chatroomdis/chatroom/get_item_list',
    method: 'get',
    params
  })
}
//添加商品信息
export function addItemInfo(data) {
  return request({
    url: '/service/shop/item/add_item',
    method: 'POST',
    data
  })
}
/*
  添加商品详情信息
  | 请求参数 | 是否必须 | 说明
  | item_content | Y | 商品详情页面信息
  | item_id | Y | 商品ID
 */
export function addItemContent(data) {
  return request({
    url: '/service/shop/item/add_item_content',
    method: 'POST',
    data
  })
}

//修改商品信息
export function updateItem(data) {
  return request({
    url: '/service/shop/item/update_item',
    method: 'POST',
    data
  })
}
//获取商品规格对应小程序商品ＩＤ
export function getEduGoods(params) {
  return request({
    url: '/service/shop/item/get_xiao_item_list',
    // http://zuoye-api.dawennet.com/edu_goods/yz_list
    method: 'get',
    params
  })
}

//添加商品规格明细表
export function addItemSkuDetail(data) {
  return request({
    url: 'service/shop/item/add_item_sku_detail_json',
    method: 'POST',
    data
  })
}

//获取商品规格明细表
export function getGoodsSkus(params) {
  return request({
    url: 'service/shop/item/get_item_info',
    method: 'get',
    params
  })
}
