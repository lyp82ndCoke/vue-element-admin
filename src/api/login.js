import request from '@/utils/request'
// 登录
export function login(mobile, password) {
  return request({
    url: 'system/Login/login',
    method: 'post',
    data: {
      mobile,
      password
    }
  })
}
// 获取用户信息
export function getInfo(token) {
  return request({
    url: 'system/User/getLoginUser',
    method: 'post',
    data: { token }
  })
}
// 获取unionid
export function getWxUnionid(code) {
  return request({
    url: `https://xdata.zmedc.com/service/basedata/wx/get_user_info_by_code`,
    method: 'get',
    params: { code }
  })
}
// 绑定微信unionid
export function bindWxUnionid(data) {
  // alert(user_id, wx_unionid)
  return request({
    url: 'system/User/saveUserWxUnionid',
    method: 'post',
    data
  })
}
// 登出
export function logout() {
  return request({
    url: 'system/Login/cancelLogin',
    method: 'post'
  })
}




/* 
  辅导员首次登录 获取 counsellor_request_id 
  参数名称 | 是否必填 | 描述
  request_type | Y | 1:登录   2:结束
  request_project | Y | 1:后台  2:h5
  request_project_path | Y | 请求路径
  request_param | Y | 请求带的参数

  注销 || 浏览器关闭
  参数名称 | 是否必填 | 描述
  request_type | Y | 1:登录   2:结束
  request_project | Y | 1:后台  2:h5
  counsellor_request_id | N | 辅导员首次登录返回的id
  request_project_path | Y | 请求路径
  request_param | Y | 请求带的参数
*/

export function counsellorRequestId(data) {
  return request({
    url: 'tutorship/action/counselloerRequestAction',
    method: 'post',
    data
  })
}
