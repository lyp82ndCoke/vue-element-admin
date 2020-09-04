<template>
  <div class="app-container-article">
    <sticky class-name="sub-navbar">
      <el-col
        :span="10"
        class="subtitle"
      >{{title}}文章</el-col>
    </sticky>
    <el-form
      class="demo-form-inline"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="160px"
      size="small">
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="请先选择文章类型："
            prop="article_type">
            <el-select
              v-model="form.article_type"
              placeholder="请先选择文章类型">
              <el-option
                v-for="item in [{label:'群聊类文章',value:'2'},{label:'好文类文章',value:'1'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类别：">
            <el-col :span="18" style="margin-bottom:10px;">
              <el-col :span="15">
                <el-input v-model="category.tag_name" placeholder="请输入类别名称" @keyup.enter.native="addCategory()"></el-input>
              </el-col>
              <el-col :span="3" align="right">
                <el-button size="mini" type="primary"  @click="addCategory()">添加类别</el-button>
              </el-col>
            </el-col>
            <el-col :span="20">
              <el-checkbox-group v-model="form.category">
                <el-checkbox v-for="(cateItem, cateIndex) in categoryList" :label="cateItem.tag_id" :key="cateIndex">{{cateItem.tag_name}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-form-item>
          <el-form-item label="标签：">
            <el-col :span="18" style="margin-bottom:10px;">
              <el-col :span="15">
                <el-input v-model="label.tag_name" placeholder="请输入标签名称" @keyup.enter.native="addLabel()"></el-input>
              </el-col>
              <el-col :span="3" align="right">
                <el-button size="mini" type="primary"  @click="addLabel()">添加标签</el-button>
              </el-col>
            </el-col>
            <el-col :span="20">
              <el-checkbox-group v-model="form.label">
                <el-checkbox v-for="(labelItem, labelIndex) in labelList" :label="labelItem.tag_id" :key="labelIndex">{{labelItem.tag_name}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-form-item>
          <el-form-item label="选择适用年龄：">
            <el-col :span="20">
              <el-checkbox-group v-model="form.age">
                <el-checkbox v-for="(ageItem, ageIndex) in ageList" :label="ageItem.tag_id" :key="ageIndex">{{ageItem.tag_name}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-form-item>

          <el-form-item
            label="请选择文章基本信息："
            prop="target_type">
            <el-select
              v-model="form.target_type"
              placeholder="请先选择文章类型">
              <el-option
                v-for="item in [{label:'编辑文章',value:'2'},{label:'公众号文章',value:'3'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="文章链接：" prop="url" v-if="form.target_type==3">
            <el-col :span="10">
              <el-input
                v-model="form.url"
                placeholder="请输入文章链接"
              ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item
            label="文章标题：" prop="title">
            <el-col :span="10">
              <el-input
                v-model="form.title"
                placeholder="请输入文章标题"
              ></el-input>
            </el-col>
            <el-col :span="6" class="tips" align="center">(用户可见18个字的标题，最多18个字哦！)</el-col>
          </el-form-item>


          <el-row>
            <el-col class="grid-content bg-putple-light">
              <el-form-item
                label="文章封面图："
                prop="face_picture"
                class="avater-wrap">
                <el-col :span="5">
                  <el-upload
                    class="avatar-uploader"
                    :action="host"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :data="uoloadFace"
                    :before-upload="beforeAvatarUpload">
                    <img
                      v-if="form.face_picture"
                      :src="form.face_picture"
                      class="avatar"
                      v-model="form.face_picture">
                    <i
                      v-else
                      class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col class="grid-content bg-putple-light">
              <el-form-item
                label="文章分享图："
                prop="share_picture"
                class="avater-wrap">
                <el-col :span="5">
                  <el-upload
                    class="avatar-uploader"
                    :action="host"
                    :show-file-list="false"
                    :on-success="handleShareSuccess"
                    :data="uoloadShare"
                    :before-upload="beforeShareUpload">
                    <img
                      v-if="form.share_picture"
                      :src="form.share_picture"
                      class="avatar"
                      v-model="form.share_picture">
                    <i
                      v-else
                      class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="富文本：" prop="content" v-if="form.target_type==2">
            <tinymce v-model="form.content"></tinymce>
          </el-form-item>

          <el-form-item
            label="虚拟阅读量：">
            <el-col :span="10">
              <el-input
                v-model="form.view_num"
                placeholder="请输入虚拟阅读量"
              ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item
            label="文章整理者：">
            <el-col :span="10">
              <el-input
                v-model="form.trimmer_name"
                placeholder="请输入文章整理者"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item
            label="文章创作者：" prop="creators_name">
            <el-col :span="10">
              <el-input
                v-model="form.creators_name"
                placeholder="请输入文章创作者"
              ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="文章个性化标签：">
            <el-col :span="18" style="margin-bottom:10px;">
              <el-col :span="15">
                <el-input v-model="personal.tag_name" placeholder="请输入文章个性化标签名称" @keyup.enter.native="addPersonal()"></el-input>
              </el-col>
              <el-col :span="4" align="right">
                <el-button size="mini" type="primary"  @click="addPersonal()">添加个性化标签</el-button>
              </el-col>
            </el-col>
            <el-col :span="20">
              <el-checkbox-group v-model="form.personalized_label">
                <el-checkbox v-for="(personalItem, personalIndex) in personalList" :label="personalItem.tag_id" :key="personalIndex">{{personalItem.tag_name}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-form-item>
          
          <el-form-item
            label="文章排序值：">
            <el-col :span="10">
              <el-input
                v-model="form.sort_num"
                placeholder="请输入文章排序值"
              ></el-input>
            </el-col>
          </el-form-item>

        </el-col>
      </el-row>
      <el-form-item>
        <el-button
          type="primary"
          @click="onGoodSubmit('form')"
        >保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addTagSubmit, getTagList, addArticleSubmit, getEditArticle, editArticleSubmit } from "@/api/homePage";

import Sticky from "@/components/Sticky";
import Tinymce from "@/components/Tinymce";
import Pagination from '@/components/Pagination';
export default {
  components: {
    Sticky,
    Tinymce,
    Pagination
  },
  data() {
    const host = process.env.BASE_API + "publicmethod/upfile/upload_file";
    return {
      category: {
        tag_type: 1,
        tag_name: '',
      },
      label:{
        tag_type: 2,
        tag_name: '',
      },
      personal: {
        tag_type: 3,
        tag_name: '',
      },
      categoryList: [],
      labelList: [],
      ageList: [],
      personalList: [],
      form: {
        target_type: '2',
        article_type: '',
        category: [],
        label: [],
        age: [],
        title: '',
        face_picture: '',
        share_picture: '',
        content: '',
        view_num: '',
        create_user_name: '',
        creators_name: '',
        trimmer_name: '',
        personalized_label: [],
        sort_num: ''
      },
      title: "创建",
      host,
      rules: {
        article_type: [
          { required: true, message: "请先选择文章类型", trigger: "blur" }
        ],
        target_type: [
          { required: true, message: "请选择文章基本信息", trigger: "blur" }
        ],
        face_picture: [
          { required: true, message: "请上传文章封面图", trigger: "blur" }
        ],
        share_picture: [
          { required: true, message: "请上传文章分享图", trigger: "blur" }
        ],
        title: [
          { required: true, message: "请上传文章标题", trigger: "blur" }
        ],
        url: [
          { required: true, message: "请输入文章链接", trigger: "blur" }
        ],
        creators_name: [
          { required: true, message: "请输入文章创作者", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入富文本内容", trigger: "blur" }
        ],
      },
      editArticle: {
        article_id: '',
        target_type: '',
      },
      uoloadFace: {
        bucket: 'zm-edu',
        property: 'article_face_picture'
      },
      uoloadShare: {
        bucket: 'zm-edu',
        property: 'article_share_picture'
      }
    };
  },
  mounted() {},
  created() {
    this.getCategory();
    this.getLabel();
    this.getAge();
    this.getPersonal();
    this.editArticle.article_id = this.$route.params.id;
    this.editArticle.target_type = this.$route.query.target_type;
    if (this.editArticle.article_id != 0 &&this.editArticle.target_type) {
      this.title = "编辑";
      this.getEditArticle();
    }
  },
  methods: {
    // 类别
    addCategory(){
      if(this.category.tag_name){
        addTagSubmit(this.category).then(res => {
          if(res.code == 200){
            this.$message.success('添加成功');
            this.category.tag_name = '';
            this.getCategory();
          }
        })
      }else{
        this.$message({
          message: '请输入类别名称哦',
          type: 'warning'
        });
      }
    },
    getCategory(){
      getTagList({tag_type: 1}).then(res => {
        if(res.code == 200){
          this.categoryList = res.result;
        }
      })
    },
    // 标签
    addLabel(){
      if(this.label.tag_name){
        addTagSubmit(this.label).then(res => {
          if(res.code == 200){
            this.$message.success('添加成功');
            this.label.tag_name = '';
            this.getLabel();
          }
        })
      }else{
        this.$message.warning('请输入标签名称哦');
      }
    },
    getLabel(){
      getTagList({tag_type: 2}).then(res => {
        if(res.code == 200){
          this.labelList = res.result;
        }
      })
    },
    getAge(){
      getTagList({tag_type: 4}).then(res => {
        if(res.code == 200){
          this.ageList = res.result;
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.form.face_picture = res.result.urlFile;
    },
    beforeAvatarUpload(file) {
      const fileType = file.type;
      let isJPG;
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (fileType == 'image/png' || fileType == 'image/jpg' || fileType == 'image/gif' || fileType == 'image/jpeg') {
        isJPG = true;
      } else {
        this.$message.error('上传海报图片只能是 jpg gif png 格式!');
        isJPG = false;
      }
      if (!isLt2M) {
        this.$message.error('上传海报图片大小不能超过 4MB!');
      }
      return isJPG && isLt2M;
    },

    handleShareSuccess(res, file){
      this.form.share_picture = res.result.urlFile;
    },
    beforeShareUpload(file){
      const fileType = file.type;
      let isJPG;
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (fileType == 'image/png' || fileType == 'image/jpg' || fileType == 'image/gif' || fileType == 'image/jpeg') {
        isJPG = true;
      } else {
        this.$message.error('上传海报图片只能是 jpg gif png 格式!');
        isJPG = false;
      }
      if (!isLt2M) {
        this.$message.error('上传海报图片大小不能超过 4MB!');
      }
      return isJPG && isLt2M;
    },
    addPersonal(){
      if(this.personal.tag_name){
        addTagSubmit(this.personal).then(res => {
          if(res.code == 200){
            this.$message.success('添加成功');
            this.personal.tag_name = '';
            this.getPersonal();
          }
        })
      }else{
        this.$message.warning('请输入个性化标签名称哦');
      }
    },
    getPersonal(){
      getTagList({tag_type: 3}).then(res => {
        if(res.code == 200){
          this.personalList = res.result;
        }
      })
    },
    onGoodSubmit(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          if(this.editArticle.article_id && this.editArticle.target_type){
            this.editArticleSubmit();
          }else{
            this.addArticleSubmit();
          }
        } else {
          this.$message.warning('请填写必填信息哦');
          return false;
        }
      });
    },
    addArticleSubmit(){
      addArticleSubmit(this.form).then(res => {
        if(res.code == 200){
          this.$message.success('创建成功');
          this.$router.go(-1)
        }
      })
    },
    editArticleSubmit(){
      editArticleSubmit(this.form).then(res => {
        if(res.code == 200){
          this.$message.success('编辑成功');
          this.$router.go(-1)
        }
      })
    },
    getEditArticle(){
      getEditArticle(this.editArticle).then(res => {
        if(res.code == 200){
          this.form = res.result;
        }
      })
    }
  }
};
</script>

<style lang="scss">
.app-container-article {
  padding: 0 0 20px;
  .el-checkbox+.el-checkbox{
    margin-left: 0;
  }
  .el-checkbox{
    margin-right: 15px;
  }
  .base-line {
    height: 50px;
    line-height: 50px;
    background: linear-gradient(90deg, #20b6f9 0%, #20b6f9 0%, #2178f1 100%, #2178f1 100%);
    font-size: 18px;
    color: #fff;
    padding-left: 20px;
    margin-bottom: 20px;
  }
  .demo-form-inline {
    padding: 10px;
  }
  .bg-putple-light {
    .avater-wrap {
      height: 110px;
      .avatar {
        width: 80px;
        width: 80px;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 80px;
        width: 80px;
        line-height: 80px;
        text-align: center;
      }
    }
  }
  .banner-img-wrap {
    display: inline-block;
    height: 140px;
    margin: 10px;
    position: relative;
    cursor: pointer;
    .banner-img {
      height: 100%;
    }
    .banner-img-remove {
      z-index: 20;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-size: 30px;
      display: none;
      background-color: rgba($color: #000000, $alpha: 0.2);
      .el-icon-delete {
        z-index: 10;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        // color: #000000;
      }
      .el-icon-delete:hover {
        color: #1989fa;
      }
    }
    &:hover > .banner-img-remove {
      display: block;
      // background-color: #fff;
    }
  }
  .tips{
    color: red;
  }
  .head-img{
    width: 100px;
  }
}

table {
  border: 0;
}
table.table-sku {
  width: 100%;
  background-color: #fff;
  text-align: left;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
table.table-sku td {
  border: 1px solid #e5e5e5;
  padding: 8px;
}
.close-project {
  font-size: 20px;
}
.alert {
  &-wrap {
    z-index: 1002;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 50px 150px 50px 200px;
    .title-header{
      margin-bottom: 20px;
    }
    .sure-margin{
      margin-top: 20px;
    }
  }
  &-content-wrap {
    border-radius: 5px;
    height: 100%;
    width: 100%;
    padding: 20px;
    background-color: #fff;
    overflow: auto;
  }
}
</style>