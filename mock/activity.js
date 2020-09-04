import Mock from 'mockjs'

export default {
	list: () => {
		const item = Mock.mock({
			'list|1-10': [{
				'id|+1': 1,
				'title|1-10': ['28天打卡', '拼团', '训练营'],
				'status|1':[true, false],
				'commodity|1':[2,4,5,6],
			}],
			total:100
		})
		return {
      code: 200,
      data: items
    }
	}
}