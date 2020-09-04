import request from '@/utils/request'
// 获取菜单树形结构
export function getMeunTree(data){
  return request({
    url:'system/Menu/getMenuList',
    method:'post',
    data
  })
}
// 获取角色list
export function getRoles(data){
  return request({
    url:'system/Role/getGroupList',
    method:'post',
    data
  })
}
// 修改密码 system/User/updatePassword
export function changePassword(data){
  return request({
    url:'system/User/updatePassword',
    method:'post',
    data
  })
}
// 新增用户
export function addUser(data){
  return request({
    url:'system/User/createUser',
    method:'post',
    data
  })
}
// 更新用户信息: system/User/updateUserInfo
export function updateUser(data){
  return request({
    url:'system/User/updateUserInfo',
    method:'post',
    data
  })
}
// 获取用户列表
export function getUsers(data){
  return request({
    url:'system/User/getUserList',
    method:'post',
    data
  })
}
// 获取用户信息
export function getUser(data){
  return request({
    url:'system/User/getUser',
    method:'post',
    data
  })
}
// 重置用户密码: system/User/resetPassword
export function resetPassword(data){
  return request({
    url:'system/User/resetPassword',
    method:'post',
    data
  })
}
// 关停用户:system/User/updateUserStatus
export function stopUser(data){
  return request({
    url:'system/User/updateUserStatus',
    method:'post',
    data
  })
}
// 获取菜单system/Menu/getMenuList
export function getMenuList(data){
  return request({
    url:'system/Menu/getMenuList',
    method:'post',
    data
  })
}
// 获取角色详情system/Role/getGroup
export function getGroup(data){
  return request({
    url:'system/Role/getGroup',
    method:'post',
    data
  })
}
// system/Role/createGroup  创建角色
export function addRole(data){
  return request({
    url:'system/Role/createGroup',
    method:'post',
    data
  })
}
// system/Role/updateGroup 更新角色
export function updateRole(data){
  return request({
    url:'system/Role/updateGroup',
    method:'post',
    data
  })
}

