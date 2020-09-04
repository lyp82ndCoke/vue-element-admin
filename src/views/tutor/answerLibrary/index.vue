<template>
  <div class="app-container">
     <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane v-if="activeName==item.key" :type="item.key" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>


  
</template>

<script>
import { getConnect, getGoodStatus, getGoodsDel, getSure } from '@/api/table'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
import tabPane from './components/tabPane'
export default {
  components: { Pagination, Sticky ,tabPane},
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tabMapOptions: [
        { label: '问答列表', key: 'all' },
        // { label: '已采纳', key: 'adoption' },
        // { label: '待审核', key: 'review' }
      ],
      activeName: 'all',
    
    }
  },
  created() {
    // console.log(this.$route.params, '此活动的id')
    // this.getList();
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>

</style>

