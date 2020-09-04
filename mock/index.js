import Mock from 'mockjs'
import userAPI from './user'
// import tableAPI from './table'
// import staffAPI from './staff'
// import menuAPI from './meun'

// Fix an issue with setting withCredentials = true, cross-domain request lost cookies
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function () {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}
// Mock.setup({
//   timeout: '350-600'
// })
// User
// Mock.mock(/\/system\/Login\/login/, 'post', userAPI.login)
// Mock.mock(/\/user\/info/, 'post', userAPI.getInfo)
Mock.mock(/\/user\/logout/, 'post', userAPI.logout)

// Table
// Mock.mock(/\/table\/list/, 'get', tableAPI.list)
// Mock.mock(/\/staff\/list/, 'get', staffAPI.list)
// Mock.mock(/\/system\/User\/getLoginUser/, 'post', userAPI.getInfo)
// Mock.mock(/\/meun\/list/, 'get', menuAPI.list)

// 角色相关
// 获取
// Mock.mock(/\/meun\/list/, 'get', menuAPI.list)

//Activity
// Mock.mock(/\/activity\/list/, 'get', activityAPI.list)


export default Mock
