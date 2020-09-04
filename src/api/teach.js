//主题管理 && 年龄段管理
import request from '@/utils/request'

//年龄段列表
export function getAgeGroup(data){
  return request({
    url: '/tutorship/label/age_label_list',
    method: 'post',
    data
  })
}
export function getAgeGroupTutor(data){
  return request({
    url: '/tutorship/Counsellor/age_label_list',
    method: 'post',
    data
  })
}
// 编辑负责人提交
export function personCharge(data){
  return request({
    url: '/tutorship/label/PersonInCharge',
    method: 'post',
    data
  })
}
//通过编辑负责人(查找他所负责的年龄和其他人负责的年龄)
export function getResponsibleAge(data){
  return request({
    url: '/tutorship/label/ResponsibleAge',
    method: 'post',
    data
  })
}

//添加年龄段
// export function addAgeGroup(data){
//   return request({
//     url: '/tutorship/label/add_age_label',
//     method: 'post',
//     data
//   })
// }
//年龄段列表显示隐藏
export function showAgeGroup(data){
  return request({
    url: '/tutorship/label/isshow_age_label',
    method: 'post',
    data
  })
}
//年龄段主题数量中--主题排序修改
export function updateThemeSort(data){
  return request({
    url: '/tutorship/label/age_label_theme_sort',
    method: 'post',
    data
  })
}
//获取年龄段编辑信息
export function editAgeGroup(data){
  return request({
    url: '/tutorship/label/edit_age_label',
    method: 'post',
    data
  })
}
//编辑年龄段提交
export function editSubmitAgeGroup(data){
  return request({
    url: '/tutorship/label/edit_submit_age_label',
    method: 'post',
    data
  })
}
//年龄段列表删除
export function deleteAgeGroup(data){
  return request({
    url: '/tutorship/label/delete_age_label',
    method: 'post',
    data
  })
}
//年龄段管理--排序修改 && 年龄段名称修改
export function nameUpdate(data){
  return request({
    url: '/tutorship/label/age_label_nameupdate',
    method: 'post',
    data
  })
}
//主题数量弹框列表
export function alertAgeList(data){
  return request({
    url: '/tutorship/label/age_label_themeinfo',
    method: 'post',
    data
  })
}
//主题数量弹框的显示隐藏
export function alertShowAgeGroup(data){
  return request({
    url: '/tutorship/label/age_label_theme_isshow',
    method: 'post',
    data
  })
}
//主题数量中主题--单个移除
export function singelDelAgeGroup(data){
  return request({
    url: '/tutorship/label/age_label_theme_delete',
    method: 'post',
    data
  })
}
//主题数量中主题--批量移除
export function muchDelAgeGroup(data){
  return request({
    url: '/tutorship/label/age_label_theme_batchdelete',
    method: 'post',
    data
  })
}


//主题管理--删除一级主题
export function deleteFirstTheam(data){
  return request({
    url: '/tutorship/label/delete_firsttheme',
    method: 'post',
    data
  })
}
//主题管理--添加提交一级主题表单
export function addLevelfirst(data){
  return request({
    url: '/tutorship/label/addsubmit_first_theme',
    method: 'post',
    data
  })
}
//主题管理--修改主题名称
export function updateThemeName(data){
  return request({
    url: '/tutorship/label/update_theme_name',
    method: 'post',
    data
  })
}
//主题管理--关联年龄数详情页
export function firstAgeDetail(data){
  return request({
    url: '/tutorship/label/relation_agethemenum_list',
    method: 'post',
    data
  })
}
//主题管理--一级主题--关联年龄数详情页--移除
export function removeRelationFirst(data){
  return request({
    url: '/tutorship/label/remove_relation_agetheme',
    method: 'post',
    data
  })
}

//主题管理--二级主题--关联年龄数详情页--移除
export function removeRelationTwo(data){
  return request({
    url: '/tutorship/label/remove_relation_id',
    method: 'post',
    data
  })
}


//主题管理--关联年龄数详情页--新增关系页
export function againaddRelationFirst(data){
  return request({
    url: '/tutorship/label/againadd_relation_agetheme',
    method: 'post',
    data
  })
}
//主题管理--关联年龄数详情页--新增关系提交
export function againaddSubmitFirst(data){
  return request({
    url: '/tutorship/label/againadd_submit_relation_agetheme',
    method: 'post',
    data
  })
}
//主题管理--添加提交二级主题
export function addSubmitSecond(data){
  return request({
    url: '/tutorship/label/AddSubmitSecondTheme',
    method: 'post',
    data
  })
}

//主题管理--添加二级主题tree
export function addLevelTwoTree(data){
  return request({
    url: '/tutorship/label/AgeUnderFirstThemeInfo',
    method: 'post',
    data
  })
}

//主题管理--二级主题列表展示
export function twoTeamList(data){
  return request({
    url: '/tutorship/label/second_theme_list',
    method: 'post',
    data
  })
}
//主题管理--一级主题列表展示
export function firstTeamList(data){
  return request({
    url: '/tutorship/label/themelabel_firstlevel_list',
    method: 'post',
    data
  })
}
//主题管理--关联主题数alert
export function secondTheamList(data){
  return request({
    url: '/tutorship/label/relation_theme_numlist',
    method: 'post',
    data
  })
}
//主题管理--添加二级主题列表页
export function addSecondTheamList(data){
  return request({
    url: '/tutorship/label/add_second_theme',
    method: 'post',
    data
  })
}
//主题管理--添加二级主题(通过age_label_id查找一级主题)
export function searchFirstTheme(data){
  return request({
    url: '/tutorship/label/seach_first_theme',
    method: 'post',
    data
  })
}
//主题管理--删除二级主题名称
export function deleteSecondTheme(data){
  return request({
    url: '/tutorship/label/delete_second_theme',
    method: 'post',
    data
  })
}
// 主题管理--修改二级主题名称
// export function updateSecondName(data){
//   return request({
//     url: '/tutorship/label/update_second_themename',
//     method: 'post',
//     data
//   })
// }

//主题管理 - 新增关联关系 通过年龄段查找一级主题
export function ageUnderGetOneTheme(data){
  return request({
    url: '/tutorship/label/AgeUnderGetOnetheme',
    method: 'post',
    data
  })
}
//主题管理--二级主题列表--关联主题数--新增关联关系提交
export function aglianAddSecondTheme(data){
  return request({
    url: '/tutorship/label/AglianAddSecondThemeRelationSubmit',
    method: 'post',
    data
  })
}
