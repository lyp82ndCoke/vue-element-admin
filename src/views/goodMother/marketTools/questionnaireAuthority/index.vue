<template>
  <div class="questionnaireAuthority_container">
    <el-row type="flex" class="title-header" justify="space-between">
      <el-col :span="2">
        <el-button size="small" type="danger" @click="newCamp()">添加用户</el-button>
      </el-col>
    </el-row>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="lists"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        class="eltables"
        highlight-current-row>
        <el-table-column label="ID" prop="id" align="center" width='40'>
        </el-table-column>
        <el-table-column label="姓名" prop="real_name" align="center" width='200'>
        </el-table-column>
        <el-table-column label="手机号码" prop="mobile" align="center">
        </el-table-column>
        <el-table-column label="unionid" prop="unionid" align="center" width='380'>
        </el-table-column>
        <el-table-column label="添加日期" prop="create_time" align="center" width='220'>
        </el-table-column>
        <el-table-column label="操作" align="center" width='180'>
          <template slot-scope="scope">
            <el-button size="mini" @click="goDel(scope.row.id,'2')" type="text">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-if="total!=0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="changePaging"
      />
    </el-col>

    <el-dialog title="绑定微信用户列表" width="75%" :visible.sync="dialogFormVisible">
      <el-col>
        <el-col :span="7">
          <el-input size="small" placeholder="请输入用户姓名或手机号" prefix-icon="el-icon-search" v-model="listQuery2.search" clearable>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="searchData()" size='small'>搜索</el-button>
        </el-col>
      </el-col>
      <el-col :span="24">
        
        <el-table 
          ref="multipleTable"
          tooltip-effect="dark"
          height="370"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :data="goodsData"
          class="dialog-table">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="ID" prop="id" align="center" width='60'>
        </el-table-column>
        <el-table-column label="姓名" prop="real_name" align="center" width='140'>
        </el-table-column>
        <el-table-column label="手机号码" prop="mobile" align="center" width='140'>
        </el-table-column>
        <el-table-column label="unionid" prop="unionid" align="center">
        </el-table-column>
        <el-table-column label="添加日期" prop="create_time" align="center" width='220'>
        </el-table-column>
          <el-table-column label="操作" align="center" width='140'>
            <template slot-scope="scope">
              <el-button size="mini" @click="goAdd(scope.row.id,'1')" type="text">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24">
        <pagination 
          class="pagination" 
          v-show="total2>0" 
          :total="total2" 
          :page.sync="listQuery2.page_num" 
          :limit.sync="listQuery2.page_size" 
          v-on:pagination="changePaging2"/>
      </el-col >
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;listQuery2.search = '';" size="small">取 消</el-button>
        <el-button type="primary" @click="bindCourse()" size="small">批量添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { questionnaireAuthUserList,QuestionnaireUserList,execQuestionnaireAuthUser } from "@/api/growthCamp";
import Pagination from '@/components/Pagination';

export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      listLoading: true,
      lists:[],
      goodsData:[],
      listQuery: {
        page_num: 1,
        page_size: 10,
      },
      total: 0,
      dialogFormVisible:false,
      listQuery2: {
        page_num: 1,
        page_size: 15,
        search: '',
      },
      total2: 0,
      multipleSelection:[]
    }
  },
  created(){
    this.allCampList();
  },
  methods:{
    allCampList(){
      this.listLoading = true;
      questionnaireAuthUserList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.user_list;
          this.total = res.result.sing.count;
        }
      });
    },
    goDel(id, type){
      this.$confirm('确定删除此用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        execQuestionnaireAuthUser({ exec_type:type,ids: [id] }).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.allCampList();
          }
        });
      })
    },
    goAdd(id, type){
      execQuestionnaireAuthUser({ exec_type:type,ids: [id] }).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.allCampList();
          this.dialogFormVisible = false;
        }
      });
    },
    bindCourse(){
      let data = {
        exec_type: '1',
        ids:[]
      }
      if(this.multipleSelection.length>0){
        for (let index = 0,len = this.multipleSelection.length; index < len; index++) {
          data.ids.push(this.multipleSelection[index].id);
        }
        execQuestionnaireAuthUser(data).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.allCampList();
            this.dialogFormVisible = false;
            this.listQuery2.search =  '';
            this.listQuery2.page_num = 1;
          }
        });
      }else{
        this.$message({
          message: '未勾选用户，请检查!',
          type: 'warning'
        });
      }
    },
    newCamp(){
      this.listQuery2.search =  '';
      this.dialogFormVisible = true;
      this.listQuery2.page_num = 1;
      this.QuestionnaireUserList();
    },
    QuestionnaireUserList(){
      QuestionnaireUserList(this.listQuery2).then(res => {
        if (res.code == 200) {
          this.goodsData = res.result.user_list;
          this.total2 = res.result.sing.count;
        }
      });
    },
    changePaging(){
      this.allCampList();
    },
    searchData(){
      this.listQuery2.page_num = 1;
      this.QuestionnaireUserList();
    },
    changePaging2(){
      this.QuestionnaireUserList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
}
</script>

<style lang="scss" >
.questionnaireAuthority_container{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
  }
  .eltables{
    min-height: 500px;
  }
  .el-dialog__body{
    padding: 5px 20px;
  }
}
</style>