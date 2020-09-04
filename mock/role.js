import Mock from 'mockjs'

export default {
  list: () => {
    const items = Mock.mock({
      "code": 200,
      "msg": "ok",
      "result": {
        "listData": [{
          "id": 2,
          "group_title": "康祖明",
          "status": 1,
          "rule_id": "",
          "create_time": "2019-04-16 15:02:40",
          "user_num": 2
        }, {
          "id": 3,
          "group_title": "翁瑶",
          "status": 1,
          "rule_id": "",
          "create_time": "2019-04-16 15:03:25",
          "user_num": 0
        }, {
          "id": 123,
          "group_title": "测试成功",
          "status": 1,
          "rule_id": "1,2,3,4,5,6,7,8",
          "create_time": "2019-04-16 15:23:19",
          "user_num": 1
        }, {
          "id": 124,
          "group_title": "ceshi",
          "status": 1,
          "rule_id": "123,333",
          "create_time": "2019-04-17 10:27:21",
          "user_num": 0
        }],
        "count": 4
      }
   
    })
    return {
      code: 200,
      data: items
    }
  }
}
