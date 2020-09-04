<template>
    <div class="app-container">
      <el-row class="">
        <el-col :span="3">
          <el-button size="small" type="primary" @click="dialogFormVisible = true">创建</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="">
          <el-table
            element-loading-text="Loading"
            border
            fit
            size="mini"
            highlight-current-row
            align="middle"
          >
            <el-table-column label="序列" align="center">
              
            </el-table-column>
            <el-table-column label="问题" align="center">
              
            </el-table-column>
            <el-table-column label="问题说明" align="center">
              
            </el-table-column>
            <el-table-column label="时间" align="center">
              
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="230"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="editCamp(scope.row.article_id)">编辑</el-button>
                <el-button size="small" type="text" @click="addCampContent(scope.row.article_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog title="添加问题" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="问题描述" :label-width="formLabelWidth">
            <el-input v-model="form.desc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="问题说明" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="textarea">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
        <!-- <pagination  
          class="pagination"  
          v-show="total>0" 
          :total="total"  
          :page.sync="listQuery.page"  
          :limit.sync="listQuery.limit"  
          v-on:pagination="changePaging" 
        />-->
  </div>
</template>

<script>
export default {
  data(){
    return {
      dialogFormVisible: false,
        form: {
          desc: '',
          intro: ''
        },
        textarea:'',
        formLabelWidth: '120px'
    }
  },
  methods:{
    addProblem(){
      
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  padding: 20px;
}
.el-table{
  margin-top: 20px;
}
</style>