<template>
  <div class="app-container">
    <el-row>
      <el-col :span="1" class="">
        班级：
      </el-col>
      <el-col :span="22" class="">
        <el-radio-group v-model="radio">
          <el-radio :label="3">一年级</el-radio>
          <el-radio :label="6">二年级</el-radio>
          <el-radio :label="9">三年级</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row class="title-header">
      <el-col :span="1" >
        筛选：
      </el-col>
      <el-col :span="5" class="">
        <el-col :span="4.3">
          课程预告状态：
        </el-col>
        <el-col :span="8">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-col>
      <el-col :span="5" class="">
        <el-col :span="4.3">
          课程回顾状态：
        </el-col>
        <el-col :span="8">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="title-header">
        <el-col :span="4">
          <el-button size="small" type="primary" @click="createProblem()">创建主题课表</el-button>
        </el-col>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="title-header">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          size="small"
          highlight-current-row>
          <el-table-column label="课程预告时间" width="310" align="center">
            <template slot-scope="scope">
              <!-- {{ scope.row.name }} -->
            </template>
          </el-table-column>  
          <el-table-column label="课程主题" width="310" align="center">
            <template slot-scope="scope">
              <!-- {{ scope.row.updatetime }} -->
            </template>
          </el-table-column>
          <el-table-column label="课程预告状态" width="200" align="center">
            <template slot-scope="scope">
              <!-- <span>{{ scope.row.price }}</span> -->
            </template>
          </el-table-column>
          <el-table-column label="课程回顾状态" width="200" align="center">
            <template slot-scope="scope">
              <!-- <span>{{ scope.row.price }}</span> -->
            </template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="操作" width="300">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="goContent(scope.row.id)">编辑预告</el-button>
              <el-button size="mini" type="text" @click="goGoods(scope.row.id)">编辑回顾</el-button>
              <el-button size="mini" type="text" @click="statusGoods(scope.row.id)">发布预告</el-button>
              <el-button size="mini" type="text" @click="removeGoods(scope.row.id)">发布回顾</el-button>
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
      radio: 3,
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
    }
  },
  methods:{
    createProblem(){

    },
    searchGoods(){
      
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container{
    padding: 20px;
  }
  .el-table{
    margin-top: 10px;
  }
  .search-btn{
    margin-left: 20px;
  }
  .el-row{
    margin:15px 0;
  }
  .title-header{
    line-height: 40px;
  }
</style>