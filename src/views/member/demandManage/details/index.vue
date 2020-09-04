<template>
  <div class="app-container">
    
    <el-row>
      <el-col :span="24" class="title-header">
        <el-col :span="4">
          <el-select size="small" v-model="optionsValue" placeholder="全部">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
            <el-input size="small" placeholder="请输入课程、群、用户名称" prefix-icon="el-icon-search" v-model="searchText">
            </el-input>
        </el-col>
        <el-col :span="2" class="search-btn">
          <el-button type="success" icon="el-icon-search" size="small" @click="searchGoods">搜索</el-button>
        </el-col>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="22" class="title-header">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          size="small"
          highlight-current-row>
          <el-table-column label="用户信息" width="218" align="center">
            <template slot-scope="scope">
              <!-- {{ scope.row.name }} -->
            </template>
          </el-table-column>  
          <el-table-column label="手机号码" width="150" align="center">
            <template slot-scope="scope">
              <!-- {{ scope.row.updatetime }} -->
            </template>
          </el-table-column>
          <el-table-column label="所在年级" width="150" align="center">
            <template slot-scope="scope">
              <!-- <span>{{ scope.row.price }}</span> -->
            </template>
          </el-table-column>
          <el-table-column label="所在群" width="150" align="center">
            <template slot-scope="scope">
              <!-- <span>{{scope.row.audio_num}}</span> -->
            </template>
          </el-table-column>
          <el-table-column label="需求详情" width="330" align="center">
            <template slot-scope="scope">
              <!-- <span>{{scope.row.audio_num}}</span> -->
            </template>
          </el-table-column>
          <el-table-column label="需求提交时间" width="180" align="center">
            <template slot-scope="scope">
              <!-- <span>{{scope.row.audio_num}}</span> -->
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    
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
  .el-table{
    margin-top: 30px;
  }
  .search-btn{
    margin-left: 20px;
  }
</style>