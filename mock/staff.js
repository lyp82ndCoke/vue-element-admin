import Mock from 'mockjs'

export default {
  list: () => {
    const items = Mock.mock({
      'items|10': [{
        "phone|13100000000-13199999999": 13199999999,
        id:'@id',
        name:'@cname(3, 5)',
        'title|1':['金牌辅导员','银牌辅导员','普通辅导员','实习辅导员'],
        createtime: '@datetime',
        avatar:'https://dw-xiaochengxu.oss-cn-beijing.aliyuncs.com/MSYDB65C571AAE98CEC716013E0D99AB095B.jpg'
      }],
      total:100
    })
    return {
      code: 200,
      data: items
    }
  }
}
