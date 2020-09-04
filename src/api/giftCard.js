// 营销工具 

// 1.礼品卡
import request from '@/utils/mallRequest'
/*
  添加礼品卡信息
  | 请求参数 | 是否必须 | 说明
*/
export function addItemInfo(data) {
  return request({
    url: '/service/shop/giftcard/add_item',
    method: 'post',
    data
  })
}
/*
  修改礼品卡信息
  | 请求参数 | 是否必须 | 说明
*/
export function updateItem(data) {
  return request({
    url: '/service/shop/giftcard/update_gift_card',
    method: 'post',
    data
  })
}
//查询SKU规格项列表
export function getSkuList(params) {
  return request({
    url: '/service/shop/giftcard/get_sku_k_list',
    method: 'get',
    params
  })
}
/*
  查询SKU规格值列表
  | 请求参数 | 是否必须 | 说明
  | sku_kid | Y | 规格ID
 */
export function getSkuValueList(params) {
  return request({
    url: '/service/shop/giftcard/get_sku_v_list',
    method: 'get',
    params
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
    url: '/service/shop/giftcard/add_item_content',
    method: 'POST',
    data
  })
}
/*
  添加SKU规格项
  | 请求参数 | 是否必须 | 说明
  | sku_k | Y | 规格名称
 */
export function addSkuProject(data) {
  return request({
    url: '/service/shop/giftcard/add_sku_k',
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
    url: '/service/shop/giftcard/add_sku_v',
    method: 'post',
    data
  })
}
//添加商品规格明细表
export function addItemSkuDetail(data) {
  return request({
    url: '/service/shop/giftcard/add_item_sku_detail_json',
    method: 'POST',
    data
  })
}
//获取商品规格明细表
export function getGoodsSkus(params) {
  return request({
    url: '/service/shop/giftcard/get_item_info',
    method: 'get',
    params
  })
}

//查询标签列表
export function getLabelList(params) {
  return request({
    url: '/service/basedata/label/get_lable_list',
    method: 'get',
    params
  })
}

//查询标签列表
export function getItemList(params) {
  return request({
    url: '/service/shop/giftcard/get_item_list',
    method: 'get',
    params
  })
}

//领卡记录
export function getReceiveList(params) {
  return request({
    url: '/service/shop/giftcard/get_receive_gift_card_list',
    method: 'get',
    params
  })
}

//购卡记录
export function getTradeList(params) {
  return request({
    url: '/service/shop/trades/get_trade_list',
    method: 'get',
    params
  })
}

// 2.阶梯涨价
// 获取规格列表
export function getRuleList(params) {
  return request({
    url: '/service/shop/price/increase/get_price_increase_rule_list',
    method: 'get',
    params
  })
}
// 失效活动
export function increaseRule(params) {
  return request({
    url: '/service/shop/price/increase/update_price_increase_rule_status',
    method: 'get',
    params
  })
}

// 获取商品list
export function getGoods(params) {
  return request({
    url: '/service/shop/price/increase/get_price_increase_item_list',
    method: 'get',
    params
  })
}
// 新建保存活动
export function saveRule(data) {
  return request({
    url: '/service/shop/price/increase/add_price_increase_rule',
    method: 'post',
    data
  })
}
// 编辑保存活动
export function editSaveRule(data) {
  return request({
    url: '/service/shop/price/increase/update_price_increase_rule',
    method: 'post',
    data
  })
}

// 3.优惠券
// 优惠券列表
export function getPromoList(params) {
  return request({
    url: '/service/shop/promocard/get_promo_card_list',
    method: 'get',
    params
  })
}
// 创建优惠券
export function addPromo(data) {
  return request({
    url: '/service/shop/promocard/add_promo_card',
    method: 'post',
    data
  })
}
// 修改优惠券
export function updatePromo(data) {
  return request({
    url: '/service/shop/promocard/update_promo_card',
    method: 'post',
    data
  })
}
// 查询优惠券详细信息
export function getPromoInfo(params) {
  return request({
    url: '/service/shop/promocard/get_promo_card_info',
    method: 'get',
    params
  })
}
// 获取用户优惠券列表
export function getUserPromo(params) {
  return request({
    url: '/service/shop/promocard/get_user_promo_card_list',
    method: 'get',
    params
  })
}

// 选择适用商品列表 
export function getgoodsList(params) {
  return request({
    url: '/service/shop/item/get_item_list',
    method: 'get',
    params
  })
}

// 修改优惠券状态
export function updateCardStatus(params) {
  return request({
    url: '/service/shop/promocard/update_promo_card_status',
    method: 'get',
    params
  })
}

// 生成优惠卷海报
export function promocardCreateQr(params) {
  return request({
    url: '/service/shop/promocard/create_qr',
    method: 'get',
    params
  })
}

// 优惠券领取记录
export function getPromocardList(params) {
  return request({
    url: '/service/shop/promocard/get_user_receive_promo_card_list',
    method: 'get',
    params
  })
}

