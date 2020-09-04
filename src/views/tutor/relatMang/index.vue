<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">关系管理</el-col>
    </sticky>
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-col :span="5">
          <el-cascader
            :options="options"
            v-model="mapDetail.relation_ids"
            :props="props"
            clearable
            @change="searchGoods"
            size="small">
          </el-cascader>
        </el-col>
        <el-col :span="5">
          <el-input
            size="small"
            placeholder="主题搜索"
            clearable
            prefix-icon="el-icon-search"
            v-model="mapDetail.title"
          ></el-input>
        </el-col>
        <el-col :span="2" class="success-btn">
          <el-button type="success" @click="searchGoods" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>

      <el-table
        :height="height"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size="mini"
        highlight-current-row
        align='middle'>
        <el-table-column label="年龄" align="center">
          <template slot-scope="scope">{{ scope.row.age_label_name }}</template>
        </el-table-column>
        <el-table-column label="一级主题标签" align="center">
          <template slot-scope="scope">{{ scope.row.first_label_name }}</template>
        </el-table-column>
        <el-table-column label="二级主题标签" align="center">
          <template slot-scope="scope">{{ scope.row.second_label_name }}</template>
        </el-table-column>
        <el-table-column label="关联时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="相关推荐" align="center">
          <template slot-scope="scope">
            <el-row :span="8"><el-button class="recommend" size="small" type="text" @click="goContent(2, scope.row.relation_id)">文章：{{scope.row.relation_article_num}}</el-button></el-row>
            <el-row :span="8"><el-button class="recommend" size="small" type="text" @click="goContent(1, scope.row.relation_id)">案例：{{scope.row.relation_case_num}}</el-button></el-row>
            <el-row :span="8"><el-button class="recommend" size="small" type="text" @click="goContent(3, scope.row.relation_id)">问答：{{scope.row.relation_question_num}}</el-button></el-row>
          </template>
        </el-table-column>
        <el-table-column label="二级主题辅导锦囊" align="center">
          <template slot-scope="scope">
            <el-col  v-if="scope.row.label_describe_addtime">
              <el-row :span="8">添加时间：{{scope.row.label_describe_addtime}}</el-row>
              <el-row :span="8"><el-button size="small" type="text" @click="labelEdit(scope.row.relation_id, scope.row.second_label_id, scope.row.label_describe_addtime)">编辑</el-button></el-row>
            </el-col>

            <el-col  v-else>
              <el-row :span="8" style="color: red;">无</el-row>
              <el-row :span="8"><el-button size="small" type="text" @click="labelEdit(scope.row.relation_id, scope.row.second_label_id,scope.row.label_describe_addtime)" style="color: red;">补充</el-button></el-row>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.is_show == 1">显示</span>
            <span v-else-if="scope.row.is_show == 2">隐藏</span>
          </template>
        </el-table-column>
        
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="showRelation(scope.row.relation_id, scope.row.is_show)">{{scope.row.is_show == 1 ? '隐藏' : '显示'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination  
        class="pagination"  
        v-show="total>0" 
        :total="total"  
        :page.sync="mapDetail.page_num"  
        :limit.sync="mapDetail.page_size"  
        v-on:pagination="getRelationList"/>
    </el-col>

    <!-- 二级问题标签介绍 alert -->
    <el-col :span="24" v-if='alertShow' class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <!-- <el-col :span="24"><div class="add-com">添加商品</div></el-col> -->
        <el-col :span="24" class="title-header">
          <el-col :span="5" v-if="hiddenOther">
            <!--  -->
             <!-- v-if="left_labelRelationlist.length > 0" -->
            <el-col :span="15" class="bottom" >
              <el-input
                size="mini"
                clearable
                placeholder="标签搜索"
                prefix-icon="el-icon-search"
                v-model="leftText"
              ></el-input>
            </el-col>
            <el-col :span="8" class="success-btn bottom" align="right">
              <el-button type="success" @click="leftSearch" size="mini">搜索</el-button>
            </el-col>
            <div class="read">
              <el-col style="margin-bottom: 10px;" class="other">从其他相同标签选择</el-col>
              <div>
                <el-radio-group v-model="leftLabelId"  @change="handleLeft">
                  <el-radio v-for="item in left_labelRelationlist" :key="item.relation_id" :label="item.relation_id" class="single">{{item.age_label_name}}/{{item.first_label_name}}/{{item.second_label_name}}</el-radio>
                </el-radio-group>
              </div>
            </div>
          </el-col>
      
          <el-col :span="14">
            <el-form ref="form" size="small" :rules="rules" :model="realtion_describe" label-width="140px" class="form_name">
              <el-form-item label="常见问题场景：" prop="question_scenario" class="input_element">
                <el-input type="textarea" :rows="5" resize="none" v-model="realtion_describe.question_scenario" class="textarea"></el-input>
              </el-form-item>
              <el-form-item label="问题分析：" prop="question_analysis" class="input_element">
                <el-input type="textarea" :rows="5" resize="none" v-model="realtion_describe.question_analysis" class="textarea"></el-input>
              </el-form-item>
               <el-form-item label="教育对策：" prop="educational_countermeasures" class="input_element">
                <el-input type="textarea" :rows="5" resize="none" v-model="realtion_describe.educational_countermeasures" class="textarea"></el-input>
              </el-form-item>
               <el-form-item label="家庭教育陷阱：" prop="family_education_trap">
                <el-input type="textarea" :rows="5" resize="none" v-model="realtion_describe.family_education_trap" class="textarea"></el-input>
              </el-form-item>
            </el-form>
          </el-col>

          <el-col :span="5">
            <el-col :span="15" class="bottom">
              <el-input
                size="mini"
                placeholder="标签搜索"
                clearable
                prefix-icon="el-icon-search"
                v-model="rightText"
              ></el-input>
            </el-col>
            <el-col :span="8" class="success-btn bottom" align="right">
              <el-button type="success" @click="rightSearch" size="mini">搜索</el-button>
            </el-col>

            <div class="read" id="checkbox">
              <el-col style="margin-bottom: 10px;">同步到其他相同标签</el-col>
              <div>
                <el-checkbox-group v-model="rightLabelId" @change="handleRight">
                  <el-checkbox v-for="item in right_labelRelationlist" :key="item.relation_id" :label="item.relation_id" class="single">{{item.age_label_name}}/{{item.first_label_name}}/{{item.second_label_name}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="10" align="right">
            <el-button type="danger" v-if="rightLabelId.length > 0" @click="sureRelation('form')">保存并同步</el-button>
            <el-button type="primary" v-else @click="sureRelation('form')">保存</el-button>
          </el-col>
          <el-col :span="4" align="right">
            <el-button type="info" @click="hiddenAlert">取消</el-button>
          </el-col>
        </el-col>
      </el-col>
    </el-col>
  </div>
</template>

<script>
import { getRelationList, showRelationList, describeLabel, submitRelationLabel, findLabelDetail, contentRelatedList  } from '@/api/relations'
import Pagination from '@/components/Pagination'
import { getThemeTree } from '@/api/counselor'
import Sticky from '@/components/Sticky'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      hiddenOther: true,
      leftLabelId: null,
      rightLabelId: [],
      alertShow: '',
      height: null,
      list: [], 
      // 主题tree
      props: {
        value: 'label_id',
        label: 'title'
      },
      listLoading: false,
      total: 0,
      options: [],
      rules: {
        question_analysis: [
          {
            required: true, message: '请输入问题分析', trigger: 'blur'
          }
        ],
        question_scenario: [
          {
            required: true, message: '请输入问题场景', trigger: 'blur'
          }
        ],
        educational_countermeasures: [
          {
            required: true, message: '请输入教育对策', trigger: 'blur'
          }
        ],
        family_education_trap: [
          {
            required: true, message: '请输入家庭教育陷阱', trigger: 'blur'
          }
        ],
      },
      
      left_labelRelationlist:[],
      realtion_describe: {
        relation_id: "r3TF3rEkC825Q",
        question_analysis: null,
        question_scenario: null,
        educational_countermeasures: null,
        family_education_trap: null
      },
      right_labelRelationlist: [],
      leftText: '',
      rightText: '',
      mapDetail: {
        title: "",
        relation_ids: [],
        page_num: 1,
        page_size: 10
      }
    }
  },
  created() {
    this.goodsListId = this.$route.params.id;
    this.getRelationList();
    this.getThemeTree();
  },
  methods: {
    // 获取树形结构
    getThemeTree() {
      const data = {};
      getThemeTree(data).then(res => {
        if (res.code == 200) {
          this.options = res.result;
        }
      })
    },
    // 关系列表
    getRelationList(){
      this.listLoading = true;
      const map = {
        ...this.mapDetail
      }
      getRelationList(map).then((res) => {
        if(res.code == 200){
          this.listLoading = false;
          this.list = res.result.list;
          this.total = res.result.count;
        }
      })
    },
    // 搜索关系管理列表
    searchGoods(){
      this.mapDetail.page_num = 1;
      this.getRelationList();
    },
    // 关系列表 显示 隐藏
    showRelation(relation_id, is_show){
      const title = is_show == 1 ? '隐藏' : '显示';
      this.$confirm('确认要'+title+'吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showRelationList(relation_id, is_show);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'+title
        });          
      });
    },
    showRelationList(relation_id, is_show){
      const map = {
        relation_id, is_show
      }
      showRelationList(map).then((res) => {
        if(res.code == 200){
          this.$message({
            type: 'success',
            message: res.msg
          }); 
          this.getRelationList();
        }
      })
    },
    //二级问题标签介绍弹框
    labelEdit(relation_id, second_label_id,addTime){
      this.rightLabelId = [];
      this.leftLabelId = null;
      if(!addTime){
        this.hiddenOther = false;
      }
      this.alertShow = true;
      this.relation_id = relation_id;
      this.second_label_id = second_label_id;
      const map = {
        relation_id, second_label_id
      }
      describeLabel(map).then((res) => {
        if(res.code == 200){
          this.left_labelRelationlist = res.result.left_labelRelationlist;
          this.right_labelRelationlist = res.result.right_labelRelationlist;
          this.realtion_describe = res.result.realtion_describe;
        }
      })
    },
    //左边搜索
    leftSearch(){
      const map = {
        relation_id: this.relation_id,
        second_label_id: this.second_label_id,
        title: this.leftText,
        type: 1
      }
      describeLabel(map).then((res) => {
        this.left_labelRelationlist = res.result.left_labelRelationlist;
      })
    },
    //右边搜索
    rightSearch(){
      const map = {
        relation_id: this.relation_id,
        second_label_id: this.second_label_id,
        title: this.rightText,
        type: 2
      }
      describeLabel(map).then((res) => {
        this.right_labelRelationlist = res.result.right_labelRelationlist;
      })
    },
    // 二级问题标签弹框 保存
    sureRelation(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          if(this.rightLabelId.length > 0){
            //保存并同步
            this.commentSave();
          } else {
            const map = {
              ...this.realtion_describe
            }
            map.relation_id = this.relation_id;
            map.relation_ids = this.rightLabelId;
            submitRelationLabel(map).then((res) => {
              if(res.code == 200){
                this.$message({
                  type: 'success',
                  message: res.msg
                });
                this.alertShow = false;
                this.getRelationList();
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    commentSave(){
      this.$confirm('同步将覆盖标签介绍原有内容,是否确认保存并同步覆盖?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const map = {
          ...this.realtion_describe
        }
        map.relation_id = this.relation_id;
        map.relation_ids = this.rightLabelId;
        submitRelationLabel(map).then((res) => {
          if(res.code == 200){
            this.$message({
              type: 'success',
              message: res.msg
            });
            this.alertShow = false;
            this.getRelationList();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消该操作'
        });          
      });
    },
    // 左边读取
    handleLeft(value){
      const map = {
        relation_id: value
      }
      findLabelDetail(map).then((res) => {
        if(res.code == 200){
          this.realtion_describe = res.result;
        }
      })
    },
    // 右边覆盖
    handleRight(value){
      const checkArray = value;
      if(checkArray.length > 0){

      }
    },
    goContent(id, relation_id){
      this.$router.push({ path: `./content/${relation_id}`,query:{ id } })
    },
    hiddenAlert(){
      this.$confirm('离开不会保留已修改的信息哦', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.alertShow = false;
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    }
  }
}
</script>
<style lang="scss">
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
.recommend{
  padding: 0 0;
}
.read{
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #ccc;
  border-radius: 10px;
  padding: 10px;
}
.single.el-radio.is-bordered{
  width: 212px;
  height: 34px;
  line-height: 34px;
  padding: 0 0 0 0px;
  background-color: #fff;
  margin-left: 0;
  margin-bottom: 10px;
}
#checkbox {
  background-color: #eee;
}
#checkbox .el-checkbox.single{
  width: 212px;
  height: 34px;
  line-height: 34px;
  margin-left: 0;
  margin-bottom: 10px;
}
.read::-webkit-scrollbar { width: 0 !important }
.form_name .textarea{
  width: 460px;
}
.form_name .textarea .el-textarea__inner{
  min-height: 110px;
}
.input_element{
  margin-bottom: 32px;
}
.bottom{
  margin-bottom: 10px;
}
.el-radio-group .el-radio.single.is-bordered .el-radio__label{
  padding: 0;
}
.el-radio-group .el-radio.single.is-bordered .el-radio__input{
  padding: 0 5px;
}
.el-radio-group  .el-radio.single.is-bordered{
  margin-left: 0;
}
.read .el-radio__label, .read .el-checkbox__label{
  white-space: normal;
}
.read .el-radio.single.is-checked{
  white-space: normal;
}
.el-radio+.el-radio{
  margin: 10px 0;
}
</style>

