<template>
  <div class="app_container">
    <el-row class="title-header" type="flex" justify="space-between">
      <el-col :span="1.5" class="success-btn">
        <el-button size="small" type="danger" @click="newCourse('questionnaire_new')">新建问卷</el-button>        
      </el-col>
    </el-row>
    <el-col :span="24" class="title-content">
      <el-tabs type="border-card" @tab-click="handleClick()" v-model="activeName">
        <el-tab-pane label="我的已发布" name="first">
          <el-row type="flex" justify="end" class="searchBar">
            <el-col :span="3">
              <el-select v-model="listQuery.search_self" size="small" @change='changeType1'>
                <el-option
                  v-for="item in options2" 
                  :key="item.index" 
                  :label="item.label" 
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-select v-model="listQuery.status" size="small" @change='changeType2'>
                <el-option
                  v-for="item in options" 
                  :key="item.index" 
                  :label="item.label" 
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="listQuery.search_title" clearable></el-input>
            </el-col>
            <el-col :span="1.5">
              <el-button type="primary" @click="searchList()" icon="el-icon-search" size="small">搜索</el-button>
            </el-col>
          </el-row>
          <el-col>
            <el-table
              v-loading="listLoading"
              :data="lists"
              element-loading-text="Loading"
              border
              fit
              height="435"
              size='mini'
              highlight-current-row>
              <el-table-column label="ID" prop="id" align="center" width='50'>
              </el-table-column>
              <el-table-column label="问卷名称" prop="title" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" @click="goCheck(scope.row.questionnaire_code)" type="text">{{ scope.row.title }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="目标人数/参与人数/完成人数" prop="finish_num" align="center" width='180'>
                <template slot-scope="scope">
                  <el-button size="mini" @click="goData(scope.row.questionnaire_code)" type="text">{{ scope.row.target_num }}/{{ scope.row.join_num }}/{{ scope.row.finish_num }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="状态" prop="status" align="center" width='90'>
                <template slot-scope="scope">
                  <span>{{ scope.row.status === '2' ? '收集中' : (scope.row.status === '3' ? '已暂停' : '已结束' ) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="类型" prop="questionnaire_type" align="center" width='90'>
                <template slot-scope="scope">
                  <span>{{ scope.row.questionnaire_type === '1' ? '训练营' : '其他' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="remarks" align="center" width='320'>
                <template slot-scope="scope">
                  <span>{{ scope.row.remarks === null ? '无' : (scope.row.remarks) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width='140'>
                <template slot-scope="scope">
                  <el-button size="mini" @click="goData(scope.row.questionnaire_code)" type="text">数据</el-button>
                  <!-- <el-button size="mini" @click="goShare(scope.row.questionnaire_code)" type="text">推广</el-button> -->
                  <el-button size="mini" @click="goCopy(scope.row.questionnaire_code)" type="text">复制</el-button>
                  <!-- <el-button size="mini" @click="goDel(scope.row.course_id)" type="text">预览</el-button> -->
                  <el-button size="mini" @click="goUpdate(scope.row.questionnaire_code,scope.row.status)" type="text">
                    {{ scope.row.status === '2' ? '暂停' : '启用' }}
                  </el-button>
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
        </el-tab-pane>
        <el-tab-pane label="我的草稿箱" name="second">
          <el-row type="flex" justify="end" class="searchBar">
            <el-col :span="4">
              <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="listQuery.search" clearable></el-input>
            </el-col>
            <el-col :span="1.5">
              <el-button type="primary" @click="searchList()" icon="el-icon-search" size="small">搜索</el-button>
            </el-col>
          </el-row>
          <el-col>
            <el-table
              v-loading="listLoading"
              :data="lists"
              element-loading-text="Loading"
              border
              fit
              height="435"
              size='mini'
              highlight-current-row>
              <el-table-column label="ID" prop="id" align="center" width='50'>
              </el-table-column>
              <el-table-column label="问卷名称" prop="title" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" @click="newCourse(scope.row.questionnaire_code)" type="text">{{ scope.row.title }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="remarks" align="center" width='320'>
                <template slot-scope="scope">
                  <span>{{ scope.row.remarks === null ? '无' : (scope.row.remarks) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width='200'>
                <template slot-scope="scope">
                  <el-button size="mini" @click="newCourse(scope.row.questionnaire_code)" type="text">编辑</el-button>
                  <!-- <el-button size="mini" @click="goDel(scope.row.course_id)" type="text">预览</el-button> -->
                  <el-button size="mini" @click="goCopy(scope.row.questionnaire_code)" type="text">复制</el-button>
                  <el-button size="mini" @click="goUpdate(scope.row.questionnaire_code)" type="text">发布</el-button>
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
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </div>
</template>

<script>
import { getQuestionnaireList,updateQuestionnaireStatus } from "@/api/growthCamp";
import Pagination from '@/components/Pagination';

export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      listLoading: true,
      lists:[],
      questionaireInfo:{
        questionnaire_type: '1',
        questionnaire_purpose: '1',
      },
      listQuery: {
        page_num: 1,
        page_size: 10,
        status: '5',
        search_self: '1',
        search_title: '',
      },
      total: 0,
      total2: 0,
      activeName: 'first',
      options: [
        {
          value: '5',
          label: '全部类型'
        },
        {
          value: '2',
          label: '收集中'
        },
        {
          value: '3',
          label: '已暂停'
        }
      ],
      options2: [
        {
          value: '1',
          label: '我创建的问卷'
        },
        {
          value: '2',
          label: '全部问卷'
        },
      ]
    }
  },
  created(){
    this.getQuestionnaireList();
    this.listQuery.page_num = Number(sessionStorage.getItem('courseLibraryPage')) || this.listQuery.page_num;
    this.activeName = sessionStorage.getItem('questionaireIndex') || 'first';
    if(this.activeName == 'second'){
      this.listQuery.status = '1';
    }
  },
  mounted(){
    setTimeout(() => {
      sessionStorage.removeItem('questionaireIndex');
    }, 1000);
  },
  methods:{
    handleClick(tab, event) {
      if(this.activeName == 'first'){
        this.listQuery.status = '5';
      }else{
        this.listQuery.status = '1';
        this.listQuery.search_self = '1';
        this.listQuery.page_num = 1;
      }
      this.getQuestionnaireList();
    },
    getQuestionnaireList(){
      this.lists = [];
      this.listLoading = true;
      getQuestionnaireList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.questionaireList;
          this.total = Number(res.result.count);
        }
      });
    },
    goCheck(id){
      this.$router.push({ path: `./newQuestion/${id+'&'+'first'}` });
      sessionStorage.setItem('questionaireEdit',0);
    },
    newCourse(id){
      this.$router.push({ path: `./newQuestion/${id+'&'+'first'}` });
      sessionStorage.setItem('questionaireEdit',1);
    },
    goData(id){
      this.$router.push({ path: `./data/${id}` });
    },
    goShare(id){
      this.$router.push({ path: `./newQuestion/${id+'&'+'second'}` });
    },
    goCopy(id){
      this.$router.push({ path: `./newQuestion/${id+'&'+'first'}` });
      sessionStorage.setItem('questionaireEdit',1);
      sessionStorage.setItem('questionaireCopy', true);
    },
    goUpdate(id,status){
      this.$confirm('确定要执行'+(status == '2' ? ' "暂停" ' : (status == '3' ? ' "启用" ' : ' "发布" '))+'操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let code = status == '2' ? '3' : (status == '3' ? '2' : '2');
        updateQuestionnaireStatus({ questionnaire_code:id,status:code }).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getQuestionnaireList();
          }
        });
      })
    },
    changePaging(){
      this.getQuestionnaireList();
    },
    searchList(){
      this.listQuery.page_num = 1;
      this.getQuestionnaireList();
    },
    changeType1(v){
      this.listQuery.page_num = 1;
      this.listQuery.search_self = v;
      this.getQuestionnaireList();
    },
    changeType2(v){
      this.listQuery.page_num = 1;
      this.listQuery.status = v;
      this.getQuestionnaireList();
    }
  }
}
</script>

<style lang="scss" scoped>
.app_container{
  padding: 10px 20px;
  .title-header{
    margin-bottom: 10px;
  }
  .searchBar{
    margin:-5px 0 10px 0;
  }
}
</style>