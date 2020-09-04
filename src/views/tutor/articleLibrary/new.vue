<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">{{currentTitle}}</el-col>
    </sticky>
    <!--  <el-form v-for="(form,index) in array"  ref="form" :model="form" class="form-wrap" label-width="140px">
      <el-form-item label="选择问题：" prop="question_ids">
        <el-col :span="6">
          <el-cascader
            :options="form.options"
            v-model="form.selectedOptions0"
            @change="handleChangeTeam"></el-cascader>
        </el-col>
        <el-col :span="2" v-if="index == 0"><el-button type="primary" @click="addRequest(index)">添加</el-button></el-col>
         <el-col :span="2" v-else><el-button type="primary" @click="reduceRequest(index)">删减</el-button></el-col>
      </el-form-item>
      <el-form-item label="" class="question" prop="question_ids">
        <el-col :span="12">
          <el-select v-model="form.value0" multiple placeholder="请选择问题" @change="handleChangeReq">
            <el-option
              v-for="item in form.question_ids"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5" class="input-prompt">至少选择一个问题，可多选</el-col>
      </el-form-item>
    </el-form>-->
    <!--  <el-form v-if="reviseFlag" :model="reviseCase" class="form-wrap" label-width="140px">
      <el-form-item label="历史审核结果：">
        <el-col :span="24" v-for="(item, index) in reviseCase" :key="index">{{item.opinion_content}}</el-col>
        <el-col :span="24">提交时间：2019-02-12 11:00:00 审核时候：2019-02-12 11:00:00 1、内容主旨与问题不相符</el-col>
      </el-form-item>
    </el-form>-->

    <el-form ref="formRule" :model="form" :rules="rules" class="form-wrap" label-width="140px">
      <!-- <el-row v-if="question_show">
        <el-col :span="24">
          <el-form-item label="*选择问题：">
            <el-col :span="24">
              <el-cascader
                :options="options"
                v-model="label_ids"
                @change="handleChangeTeam"></el-cascader>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>-->

      <!--  <el-row v-if="question_show">
        <el-col :span="24">
          <el-form-item label="" class="question" prop="question_ids">
            <el-col :span="20">
              <el-select v-model="form.question_ids" multiple placeholder="请选择问题" @change="handleChangeReq">
                <el-option
                  v-for="item in question_ids"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="input-prompt">至少选择一个问题，可多选</el-col>
          </el-form-item>
        </el-col>
      </el-row>-->

      <!-- <el-form-item label="渠道：" prop="come_from">
        <el-col :span="6">
          <el-select v-model="form.come_from" placeholder="请选择" @change="handleChangeCome">
            <el-option
              v-for="item in come_from"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>-->
      <el-form-item label="来源：" prop="source">
        <el-col :span="6">
          <el-select size="small" v-model="form.source" placeholder="请选择">
            <el-option
              v-for="item in source"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="出处：" prop="references">
        <el-col :span="6">
          <el-select size="small" v-model="form.references" placeholder="请选择">
            <el-option
              v-for="item in references"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-form-item>

      <!-- v-if="jump_address" 区分地址 || 富文本 -->
      <el-form-item label="跳转地址：" prop="jump_address">
        <el-col :span="10">
          <el-input size="small" v-model="form.jump_address" placeholder="请输入跳转地址"></el-input>
        </el-col>
        <el-col :span="3" align="right">
          <el-button type="danger" size="small" @click="getTitlePic">获取标题和头图</el-button>
        </el-col>
      </el-form-item>

      <el-form-item label="标题：" prop="article_title">
        <el-col :span="10">
          <el-input size="small" v-model="form.article_title" placeholder="请输入标题"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="头图：" v-if="form.img_url">
        <el-col :span="10">
          <img v-if="form.img_url" :src="form.img_url" class="avatar">
        </el-col>
      </el-form-item>
      <!--  <el-form-item label="文章内容：" prop="article_content" v-else>
        <tinymce v-model="form.article_content"></tinymce>
      </el-form-item>-->

      <el-form-item>
        <el-button type="primary" size="small" @click="onSubmit('formRule')">保存</el-button>
        <el-button size="small" @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addConsellorArticle, updateConsellorArticle, getUpdateConsellorArticle, getSubmitCaseList, addArticleList, editArticleList, editArticleSubmit, getSource, getReferences, getWxTitlePic } from '@/api/articleLibrary'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Sticky, Tinymce },
  data() {
    return {
      reviseCase: [
        { "opinion_content": "" },
        { "opinion_content": "" },
        { "opinion_content": "" },
      ],
      reviseFlag: false,
      question_show: false,
      currentTitle: '',
      label_ids: "",
      question_ids: [
        { label: '问题1', value: '1' },
        { label: '问题2', value: '2' },
        { label: '问题3', value: '3' },
      ],
      form: {
        // question_ids:[],
        // come_from: '',
        source: '',
        references: '',
        article_title: '',
        jump_address: '',
        img_url: ''
        // article_content: '',
      },
      // come_from: [
      //   { label: '微信文章', value: '1' },
      //   { label: '普通文章', value: '2' }
      // ],
      source: [],
      references: [],
      jump_address: true,
      rules: {
        question_ids: [
          { required: true, message: '请选择问题', trigger: 'change' },
        ],
        jump_address: [
          { required: true, message: '请输入跳转地址', trigger: 'blur' },
        ],
        // come_from: [
        //   { required: true, message: '请选择渠道', trigger: 'change' }
        // ],
        source: [
          { required: true, message: '请选择来源', trigger: 'change' }
        ],
        references: [
          { required: true, message: '请选择出处', trigger: 'change' }
        ],
        article_title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        article_content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
      },
      article_id: null,

    }
  },
  created() {
    this.article_id = this.$route.params.id;
    // console.log(this.article_id, '文章库编辑id')
    // this.article_id = this.$route.query.article_id;
    // this.question_id = this.$route.query.question_id;
    // console.log(this.article_id, '我的文章库-修订')
    // console.log(this.question_id, '问答库上传文章')
    if (this.article_id != 0) {
      //文章库 编辑文章
      this.currentTitle = '编辑文章';
      this.editArticleList(this.article_id);
    } else {
      //文章库 创建文章
      this.currentTitle = '创建文章';
    }
    // if(this.article_id){
    //走我的文章库 - 待审核 - 修订
    // this.currentTitle = '修订文章';
    // this.question_show = false;
    // this.reviseFlag = true;
    // this.getUpdateConsellorArticle(this.article_id);
    // } else if(this.editId != 0){
    //走我的文章库 - 编辑
    // this.currentTitle = '编辑文章';
    // } else if(this.question_id){
    //走问答库 - 上传文章
    // const map = {
    //   question_id: this.question_id
    // }
    // this.getSubmitCaseList(); //获取问答库--上传案例默认数据
    // this.currentTitle = '上传文章';
    // } else {
    //走我的文章库 - 添加文章
    // this.currentTitle = '创建文章';
    // this.question_show = true;
    // }
    this.getSource();
    this.getReferences();
  },
  methods: {
    //获取微信文章头图  和 标题
    getTitlePic() {
      if (!this.form.jump_address) {
        this.$message({
          message: '请输入地址哦',
          type: 'warning'
        });
        return false;
      }
      const map = {
        article_url: this.form.jump_address
      }
      getWxTitlePic(map).then((res) => {
        if(res.code == 200){
          this.form.article_title = res.result.article_title;
          this.form.img_url = res.result.article_image_oss;
        }
      })
    },
    // 文章来源
    getSource() {
      getSource().then((res) => {
        if (res.code == 200) {
          this.source = res.result;
        }
      })
    },
    // 文章出处
    getReferences() {
      getReferences().then((res) => {
        if (res.code == 200) {
          this.references = res.result;
        }
      })
    },
    // 获取筛选默认数据
    // getSubmitCaseList(map){
    //   getSubmitCaseList(map?map:'').then((res) => {
    //   })
    // },
    // 获取修订文章详情
    // getUpdateConsellorArticle(article_id){
    //   const map = {
    //     article_id: article_id
    //   }
    //   getUpdateConsellorArticle(map).then((res) => {
    //   })
    // },
    // handleChangeCome(value){
    //   console.log(value, '渠道')
    //   if(value == 1){
    //     this.jump_address = true;
    //   } else if (value == 2){
    //     this.jump_address = false;
    //   }
    // },
    //获取编辑文章详情
    editArticleList(article_id) {
      const map = {
        article_id
      }
      editArticleList(map).then((res) => {
        if (res.code == 200) {
          this.form = res.result;
          this.form.source = parseInt(res.result.source);
          this.form.references = parseInt(res.result.references);
        }
      })
    },
    handleChangeTeam(value) {
      // console.log(value, '主题');
    },
    handleChangeReq(value) {
      // console.log(value, '问题')
    },
    // 添加
    addRequest(index) {
      // console.log(this.array.length)
      const length = this.array.length;
      let aDefault = { options: this.array[0].options, qustion: this.array[0].qustion };
      aDefault[`selectedOptions${length}`] = [];
      aDefault[`value${length}`] = [];
      this.array.push(aDefault);
    },
    // 删减
    reduceRequest(index) {
      // console.log(index)
      this.array.splice(index, 1)
    },
    onSubmit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          const map = {
            ...this.form
          }
          if (this.article_id != 0) {
            //编辑提交
            map.article_id = this.article_id;
            editArticleSubmit(map).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                });
                this.$router.go(-1)
              }
            })
          } else {
            //添加提交
            editArticleSubmit(map).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                });
                this.$router.go(-1)
              }
            })
          }
          // if(this.editId != 0){
          //   // 走文章库编辑逻辑
          //   map.article_id = this.editId;
          //   updateConsellorArticle(map).then((res) => {
          //     if(res.code == 200){
          //       this.$message({
          //         message: '编辑成功',
          //         type: 'success'
          //       });
          //       this.$router.go(-1);
          //     }
          //   })
          // } else if(this.article_id){
          //   // 走我的文章库修订逻辑
          //   map.article_id = this.article_id;
          //   updateConsellorArticle(map).then((res) => {
          //     if(res.code == 200){
          //       this.$message({
          //         message: '修订成功',
          //         type: 'success'
          //       });
          //       this.$router.go(-1);
          //     }
          //   })
          // } else if(this.question_id){
          //   // 走问答库 上传文章案例
          //   map.question_id = this.question_id;
          //   addArticleList(map).then((res) => {

          //   })
          // } else {
          //   // 走我的文章库-添加文章
          //   addConsellorArticle(map).then((res) => {
          //     if(res.code == 200){
          //       this.$message({
          //         message: '添加成功',
          //         type: 'success'
          //       });
          //       this.$router.go(-1);
          //     }
          //   })
          // }
        } else {
          this.$message({
            message: '请填写必填项哦',
            type: 'warning'
          });
          return false;
        }
      });
    },
    onCancel() {
      this.$confirm('取消后不会保留已修改信息,确认取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.go(-1)
      }).catch(() => {
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  padding: 0 0 20px;
  .table-wrap {
    padding: 20px;
    .coverimg {
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
.form-wrap {
  padding: 20px;
  .input-prompt {
    font-size: 12px;
    color: red;
    padding-left: 20px;
  }
  #sel-goods-btn {
    width: 200px;
    height: 30px;
    background-color: #fff;
    opacity: 1;
    color: #5a8bff;
    border: 1px solid #ddd;
    cursor: pointer;
  }
  #sel-goods-btn:focus {
    outline: none;
  }
}
.question .el-select {
  width: 510px;
}
.avatar {
  width: 100%;
}
</style>



