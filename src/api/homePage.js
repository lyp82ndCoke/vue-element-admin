// 无痕养育成长营  
// 文章设置 & 金句设置 & 首页广告图 & 评论管理 & 成长墙 & 使用帮助 & 用户管理 & 任务库 & 任务管理
import request from '@/utils/request' 

// 文章设置
// 1.文章列表
export function getTraningArticle(data){
  return request({
    url: '/edu/Article/article_list',
    method: 'post',
    data
  })
}
/*
  2.获取 类别、标签、年龄 列表
  参数名称 | 是否必须 | 说明
  tag_type | Y | 1类别 2标签 3个性化标签 4年龄
*/ 
export function getTagList(data){
  return request({
    url: '/edu/Tag/tag_list',
    method: 'post',
    data
  })
}
/*
  3.添加提交 类别、标签、年龄 列表
  参数名称 | 是否必须 | 说明
  tag_type | Y | 1类别 2标签 3个性化标签 4年龄
  tag_name | Y | 标签名称
*/ 
export function addTagSubmit(data){
  return request({
    url: '/edu/Tag/add_tag_submit',
    method: 'post',
    data
  })
}
/*
  4.创建提交 文章
*/ 
export function addArticleSubmit(data){
  return request({
    url: '/edu/Article/add_article_submit',
    method: 'post',
    data
  })
}
/*
  5.文章/群聊/好文/金句显示或隐藏
  参数名称 | 是否必须 | 说明
  article_id | Y | 文章/群聊/好文/金句ID
  is_show | Y | 是否显示1.显示 2.隐藏
*/ 
export function articleShow(data){
  return request({
    url: '/edu/Article/article_show_display',
    method: 'post',
    data
  })
}
/*
  6.文章/群聊/好文/金句删除
  参数名称 | 是否必须 | 说明
  article_id | Y | 文章/群聊/好文/金句ID
*/ 
export function articleDelete(data){
  return request({
    url: '/edu/Article/article_delete',
    method: 'post',
    data
  })
}
/*
  7.编辑文章
  参数名称 | 是否必须 | 说明
  article_id | Y | 文章ID
  target_type | Y | 2编辑文章 3公总号文章
*/ 
export function getEditArticle(data){
  return request({
    url: '/edu/Article/edit_article',
    method: 'post',
    data
  })
}
/*
  8.编辑提交文章
*/ 
export function editArticleSubmit(data){
  return request({
    url: '/edu/Article/edit_article_submit',
    method: 'post',
    data
  })
}


// 金句设置
// 1.金句列表
export function getGoldsayList(data){
  return request({
    url: '/edu/Goldsaying/goldsay_list',
    method: 'post',
    data
  })
}
/*
  2.创建提交 金句
*/ 
export function addGoldsay(data){
  return request({
    url: '/edu/Goldsaying/add_submit_goldsay',
    method: 'post',
    data
  })
}
/*
  3.编辑金句
  参数名称 | 是否必须 | 说明
  article_id | Y | 金句ID
  article_type | Y | 默认3金句
*/ 
export function getEditGoldsay(data){
  return request({
    url: '/edu/Goldsaying/edit_goldsay',
    method: 'post',
    data
  })
}
/*
  4.编辑提交金句
*/ 
export function editGoldsaySubmit(data){
  return request({
    url: '/edu/Goldsaying/edit_submit_goldsay',
    method: 'post',
    data
  })
}
/*
  5.金句首页显示或隐藏
*/ 
export function goldsayIndexShow(data){
  return request({
    url: '/edu/Goldsaying/goldsaying_show_index',
    method: 'post',
    data
  })
}


// 首页广告图
/*
  1. 广告图列表/bananer图列表
  参数名称 | 是否必须 | 说明
  type | Y | 1轮播图   2首页广告图
*/ 
export function adList(data){
  return request({
    url: '/edu/Ad/ad_list',
    method: 'post',
    data
  })
}
/*
  2.广告图或轮播图的删除
*/ 
export function deleteAdv(data){
  return request({
    url: '/edu/Ad/delete_ad',
    method: 'post',
    data
  })
}
/*
  3.广告图或轮播图的上下架
*/ 
export function statusAdv(data){
  return request({
    url: '/edu/Ad/ad_show_display',
    method: 'post',
    data
  })
}
/*
  4.获取广告页/轮播图页详情
*/ 
export function getEditAdv(data){
  return request({
    url: '/edu/Ad/edit_ad',
    method: 'post',
    data
  })
}
/*
  5.添加提交广告页/轮播图
*/ 
export function addSubmitAd(data){
  return request({
    url: '/edu/Ad/add_submit_ad',
    method: 'post',
    data
  })
}
/*
  6.添加提交广告页/轮播图
*/ 
export function editSubmitAd(data){
  return request({
    url: '/edu/Ad/edit_submit_ad',
    method: 'post',
    data
  })
}

// 使用帮助
/*
  1.使用帮助列表
*/ 
export function usehelpList(data){
  return request({
    url: '/edu/Usehelp/usehelp_list',
    method: 'post',
    data
  })
}
/*
  2.添加提交使用帮助
*/ 
export function addSubmitUsehelp(data){
  return request({
    url: '/edu/Usehelp/add_submit_usehelp',
    method: 'post',
    data
  })
}
/*
  3.获取使用帮助详情
*/ 
export function getEditHelp(data){
  return request({
    url: '/edu/Usehelp/edit_usehelp',
    method: 'post',
    data
  })
}
/*
  4.使用帮助 - 编辑提交
*/ 
export function editSubmitUsehelp(data){
  return request({
    url: '/edu/Usehelp/edit_submit_usehelp',
    method: 'post',
    data
  })
}
/*
  5.使用帮助 - 删除
*/ 
export function deleteUsehelp(data){
  return request({
    url: '/edu/Usehelp/delete_usehelp',
    method: 'post',
    data
  })
}



// 用户管理
/*
  1.用户管理列表
*/ 
export function getUserList(data){
  return request({
    url: 'edu/User/userList',
    method: 'post',
    data
  })
}


// 成长墙
/*
  1.成长墙列表
*/ 
// export function growthWallList(data){
//   return request({
//     url: 'edu/Growthwall/growthWallList',
//     method: 'post',
//     data
//   })
// }
/*
  2.成长墙上下架
*/ 
// export function growthWallStatus(data){
//   return request({
//     url: 'edu/Growthwall/upLowerGrowthwall',
//     method: 'post',
//     data
//   })
// }


// 评论管理
/*
  1.评论管理列表
  参数名称 | 是否必须 | 说明
  type | Y | 类型 1好文 2群聊 3金句  4课程 5成长墙
  title | N | 搜索标题
*/ 
export function getCommentList(data){
  return request({
    url: 'edu/Comment/comment_list',
    method: 'post',
    data
  })
}

/*
  2.评论管理 - 查看更多
  参数名称 | 是否必须 | 说明
  type | Y | 类型 1好文 2群聊 3金句  4课程 5成长墙
  identify_id | Y | 版块条目id
*/ 
export function getCommentMoreList(data){
  return request({
    url: 'edu/Comment/comment_more_list',
    method: 'post',
    data
  })
}

/*
  3.评论管理 - 查看更多-隐藏/展示
  参数名称 | 是否必须 | 说明
  comment_id | Y | 评论ID
  is_show | Y | 是否展示 1.展示 2.隐藏
*/ 
export function commentShowDisplay(data){
  return request({
    url: 'edu/Comment/comment_show_display',
    method: 'post',
    data
  })
}

/*
  4.评论管理 - 查看更多--批量展示
  参数名称 | 是否必须 | 说明
  comment_ids | Y | 评论IDs (一维数组)
*/ 
export function commentBatchShow(data){
  return request({
    url: 'edu/Comment/comment_batch_show',
    method: 'post',
    data
  })
}

/*
  4.评论管理 - 查看更多--设置置顶
  参数名称 | 是否必须 | 说明
  comment_ids | Y | 评论IDs (一维数组)
  is_featured | Y | 当前置顶状态
*/ 
export function commentFeatured(data){
  return request({
    url: 'edu/Comment/comment_featured',
    method: 'post',
    data
  })
}


// 任务库
// 1.任务列表
export function taskLibraryList(data){
  return request({
    url: 'edu/task_library/taskLibraryList',
    method: 'post',
    data
  })
}
// 2.创建任务
export function addTask(data){
  return request({
    url: 'edu/task_library/addTask',
    method: 'post',
    data
  })
}
// 3.编辑任务
export function updateTask(data){
  return request({
    url: 'edu/task_library/updateTask',
    method: 'post',
    data
  })
}
// 4.删除任务
export function delTask(data){
  return request({
    url: 'edu/task_library/delTask',
    method: 'post',
    data
  })
}

// 任务管理
// 1.任务管理列表
export function taskManageList(data){
  return request({
    url: 'edu/times_task/taskManageList',
    method: 'post',
    data
  })
}
// 2.查看明细(用户明细)
export function taskUserCompleted(data){
  return request({
    url: 'edu/times_task/TaskUserCompleted',
    method: 'post',
    data
  })
}
// 3.设为精选
export function setUserDeposit(data){
  return request({
    url: 'edu/times_task/SetEssence',
    method: 'post',
    data
  })
}
// 4.排行榜
export function getRankingList(data){
  return request({
    url: 'edu/times_task/TaskUserRank',
    method: 'post',
    data
  })
}
// 5.押金
export function getUserDepositList(data){
  return request({
    url: 'edu/Sign/getUserDepositList',
    method: 'post',
    data
  })
}
// 6.评论
export function taskManageComment(data){
  return request({
    url: 'edu/times_task/taskManageComment',
    method: 'post',
    data
  })
}
// 7.评论搜索日期列表
export function getDayTime(data){
  return request({
    url: 'edu/times_task/getDayTime',
    method: 'post',
    data
  })
}
// 8.评论设置隐藏
export function updateIsShow(data){
  return request({
    url: 'edu/times_task/updateIsShow',
    method: 'post',
    data
  })
}
// 9.任务管理统计数据
export function taskStatistics(data){
  return request({
    url: 'edu/times_task/taskStatistics',
    method: 'post',
    data
  })
}





