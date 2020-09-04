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
            <el-input size="small" placeholder="请输入昵称或者手机号码" prefix-icon="el-icon-search" v-model="searchText">
            </el-input>
        </el-col>
        <el-col :span="2" class="search-btn">
          <el-button type="success" icon="el-icon-search" size="small" @click="searchGoods">搜索</el-button>
        </el-col>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="title-header">
        <el-table
          :data="tableData"
          v-loading="listLoading"
          element-loading-text="Loading"
          border
          fit
          size="small"
          highlight-current-row>
          <el-table-column label="所在年级" width="100" align="center" prop="grade">
            
          </el-table-column>  
          <el-table-column label="群名称" width="150" align="center" prop="groupName">
            
          </el-table-column>
          <el-table-column label="用户昵称" width="110" align="center" prop="userName">
            
          </el-table-column>
          <el-table-column label="手机号码" width="110" align="center" prop="phoneNumb">
            
          </el-table-column>
          <el-table-column label="详情" width="300" align="center" prop="detail">
            
          </el-table-column>
          <el-table-column label="内容点赞数" width="80" align="center" prop="contentZan">
            
          </el-table-column>
          <el-table-column label="评论" width="180" align="center" prop="content">
            
          </el-table-column>
          <el-table-column label="评论点赞数" width="80" align="center" prop="commentZan">
            
          </el-table-column>
          <el-table-column label="发布时间" width="110" align="center" prop="publishTime">
            
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="checkDetail(scope.row.article_id)">查看详情</el-button>
              <el-button size="small" type="text" @click="checkComment(scope.row.article_id)">查看评论</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="查看详情" :visible.sync="dialogTableVisible1">
      <el-table :data="gridData">
        <el-table-column property="date" label="用户昵称" width="150"></el-table-column>
        <el-table-column property="name" label="图片" width="200"></el-table-column>
        <el-table-column property="name" label="详情" width="200"></el-table-column>
        <el-table-column property="name" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="查看评论" :visible.sync="dialogTableVisible2">
      <el-table :data="gridData">
        <el-table-column property="date" label="用户昵称" width="150"></el-table-column>
        <el-table-column property="name" label="手机号码" width="200"></el-table-column>
        <el-table-column property="name" label="详情" width="200"></el-table-column>
        <el-table-column property="name" label="点赞数" width="200"></el-table-column>
        <el-table-column property="name" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      tableData:[
        {
          grade:'一年级',
          groupName:'微信群2',
          userName:'哈哈哈',
          phoneNumb:'18800000000',
          detail:'打卡机安居客单价案例的奖金按累计达到了',
          content:'到家啦就开始觉得拉拉队',
          commentZan:'9',
          publishTime:'11:00',
          contentZan:'10'
        }
      ],
      dialogTableVisible1:false,
      dialogTableVisible2:false,
    }
  },
  methods:{
    checkDetail(){
      this.dialogTableVisible1 = true;
    },
    checkComment(){
      this.dialogTableVisible2 = true;
    }
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