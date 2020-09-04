import Mock from 'mockjs'

export default {
  list: () => {
    const items = Mock.mock({
      'items|10': [{
        'title|1': ['吃好每天三顿饭', '尹建莉父母学堂'],
        'status|1': ['published', 'draft', 'deleted',''],
        author: '@cname',
        id:'@id',
        name:'@ctitle(3, 5)',
        display_time: '@datetime',
        updatetime: '@datetime',
        'price|1-10':10,
        'audio_num|1-100':100,
        coverimg:'https://dw-xiaochengxu.oss-cn-beijing.aliyuncs.com/MSYDB65C571AAE98CEC716013E0D99AB095B.jpg',
        pageviews: '@integer(300, 5000)',
        'status|1':true
      }],
      total:100
    })
    return {
      code: 200,
      data: items
    }
  }
}
