<template>
  <div class="app-container-article">
    <sticky class-name="sub-navbar">
      <el-col
        :span="10"
        class="subtitle"
      >{{title}}广告</el-col>
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
            label="标题：" prop="ad_title">
            <el-col :span="10">
              <el-input
                v-model="form.ad_title"
                placeholder="请输入标题"
              ></el-input>
            </el-col>
            <el-col :span="6" class="tips" align="center">(用户可见18个字的标题，最多18个字哦！)</el-col>
          </el-form-item>

          <el-row>
            <el-col class="grid-content bg-putple-light">
              <el-form-item
                label="广告图："
                prop="ad_picture"
                class="avater-wrap">
                <el-col :span="5">
                  <el-upload
                    class="avatar-uploader"
                    :action="host"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :data="uoloadAdv"
                    :before-upload="beforeAvatarUpload">
                    <img
                      v-if="form.ad_picture"
                      :src="form.ad_picture"
                      class="avatar"
                      v-model="form.ad_picture">
                    <i v-else
                      class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item
            label="跳转设置：" prop="video_url">
            <el-col :span="10">
              <el-upload
                :action="host"
                :show-file-list="false"
                :on-success="handleAudioSuccess"
                :data="uoloadAudio"
                :before-upload="beforeAudioUpload">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              <p v-if="form.video_url">
                <video controls="controls" width="200px" height="auto" autoplay loop :src="form.video_url"></video>
              </p>
            </el-col>
          </el-form-item>
          <el-form-item
            label="排列顺序：">
            <el-col :span="10">
              <el-input
                v-model="form.ad_sort"
                placeholder="请输入排列顺序"
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
import { getEditAdv, addSubmitAd, editSubmitAd } from "@/api/homePage";

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
      editAdv: {
        ad_id: '',
        type: '2'
      },
      title: "创建",
      uoloadAudio: {
        bucket: 'zm-edu',
        property: 'video'
      },
      uoloadAdv: {
        bucket: 'zm-edu',
        property: 'advPic'
      },
      form: {
        type: '2',
        ad_title: '',
        ad_picture: '',
        video_url: '',
        ad_sort: ''
      },
      host,
      rules: {
        ad_picture: [
          { required: true, message: "请上传广告图", trigger: "blur" }
        ],
        ad_title: [
          { required: true, message: "请输入标题", trigger: "blur" }
        ],
        video_url: [
          { required: true, message: "请上传跳转地址", trigger: "blur" }
        ],
      },
    };
  },
  mounted() {},
  created() {
    this.editAdv.ad_id = this.$route.params.id;
    if(this.editAdv.ad_id != 0){
      this.getEditAdv();
      this.title = '编辑';
    }
  },
  methods: {
    getEditAdv(){
      getEditAdv(this.editAdv).then(res => {
        if(res.code == 200){
          this.form = res.result;
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.form.ad_picture = res.result.urlFile;
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
    beforeAudioUpload(file){
      const fileType = file.type;
      let isJPG;
      console.log(fileType, 'fileType')
      // const isLt2M = file.size / 1024 / 1024 < 4;
      if (fileType == 'video/mp4') {
        isJPG = true;
      } else {
        this.$message.error('上传的视频只能是MP4格式!');
        isJPG = false;
      }
      // if (!isLt2M) {
      //   this.$message.error('上传海报图片大小不能超过 4MB!');
      // }
      // return isJPG && isLt2M;
      return isJPG;
    },
    handleAudioSuccess(res, file){
      this.$set(this.form, 'video_url', res.result.urlFile)
    },
    onGoodSubmit(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          if(this.editAdv.ad_id != 0){
            this.editSubmitAd();
          }else{
            this.addSubmitAd();
          }
        } else {
          this.$message.warning('请填写必填信息哦');
          return false;
        }
      });
    },
    addSubmitAd(){
      addSubmitAd(this.form).then(res => {
        if(res.code == 200){
          this.$message.success('创建成功');
          this.$router.go(-1);
        }
      })
    },
    editSubmitAd(){
      editSubmitAd(this.form).then(res => {
        if(res.code == 200){
          this.$message.success('编辑成功');
          this.$router.go(-1);
        }
      })
    }
  },

  watch: {
    
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