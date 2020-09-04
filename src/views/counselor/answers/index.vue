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
        { label: '全部', key: 'all' },
        { label: '已采纳', key: 'adoption' },
        { label: '待审核', key: 'review' }
      ],
      activeName: 'all',
    }
  },
  created() {
   
  },
  methods: {
    alert(a){
      alert(a)
    }
  },
  watch: {
    'activeName':function (newValue) {
      // console.log(this.$router)
      // this.$router.query.activeName = newValue;
    }
  },
}
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  padding: 0 0 20px;
  .table-wrap {
    padding: 20px;
    .coverimg{
      width: 50px;
      height: 50px;
    }
  }
}
.title-header {
  padding: 10px 0;
}
.pagination {
  margin-top: 10px;
}
.sub-navbar {
  text-align: left;
  .subtitle {
    padding: 0 20px;
  }
}
.alert{
  &-wrap{
    z-index: 1002;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.7);
    padding: 50px 150px 50px 200px;
  }
  &-content-wrap{
    border-radius: 5px;
    height: 100%;
    width: 100%;
    padding: 20px;
    background-color: #fff;
  }
}
.close-alert{
  text-align: right;
  font-size: 30px;
  color: #ccc;
}
.search-btn{
  margin-left: 20px;
}
.add-com{
  font-size: 20px;
}
.success-btn{
  text-align: right;
}
</style>

