<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <!-- <el-col :span="3">
          <el-button size="small" type="primary" @click="addCamp">创建训练营</el-button>
        </el-col> -->
      </el-col>
      <el-table
        element-loading-text="Loading"
        border
        fit
        size="mini"
        highlight-current-row
        align="middle"
      >
        <el-table-column label="用戶信息" align="center">
          <!-- <template slot-scope="scope">{{ }}</template> -->
        </el-table-column>
        <el-table-column label="手机号码" align="center">
          <!-- <template slot-scope="scope">{{ }}</template> -->
        </el-table-column>
        <el-table-column label="出生年月" align="center">
          <template slot-scope="scope"></template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.create_time }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="所在群" align="center">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.create_time }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="辅导员" align="center">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.create_time }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="购买时间" align="center">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.create_time }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="会员开始时间" align="center">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.create_time }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="会员到期时间" align="center">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.create_time }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="会员天数" align="center">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.create_time }}</span> -->
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="editCamp(scope.row.article_id)">购买明细</el-button>
            <el-button size="small" type="text" @click="addCampContent(scope.row.article_id)">群明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <pagination  
        class="pagination"  
        v-show="total>0" 
        :total="total"  
        :page.sync="listQuery.page"  
        :limit.sync="listQuery.limit"  
        v-on:pagination="changePaging" 
      />-->
    </el-col>
  </div>
</template>

<script>
export default {
  data(){
    return {
      
    }
  },
  methods:{

  }
}
</script>

<style lang="scss" scoped>
.app-container{
  padding: 20px;
}
</style>