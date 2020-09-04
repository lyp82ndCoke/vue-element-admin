<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">新建/编辑课程</el-col>
    </sticky>
    <h4>课程基本信息</h4>
    <el-form ref="form" :model="form" class="form-wrap" label-width="140px">
      <el-form-item label="*课程名称：">
        <el-col :span="10">
          <el-input size="small" v-model="form.audio_title"/>
        </el-col>
        <!-- <el-col :span="5" class="input-prompt">最多输入20个字哦</el-col> -->
      </el-form-item>
      <el-form-item label="*课程文件：">
        <el-col :span="4">
          <el-upload
            class="upload-demo"
            :before-upload="beforeAvatarUpload1"
            :action="host"
            :on-preview="handlePreview"
            :on-progress="handleProgress"
            :on-remove="handleRemove"
            :limit="1"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-exceed="handleExceed"
            :file-list="fileList"
            ref="upload"
            accept="mp3, mp4"
            :data="propetry">
            <!-- :before-remove="beforeRemove" -->
            <el-button size="small" @click="changeAudio(form.audio_url)">{{ form.audio_url == "" ? '点击上传文件' : '点击修改文件' }}</el-button>
          </el-upload>
        </el-col>
        <el-col :span="10" v-if="form.audio_url">
          {{ form.file_name }}
        </el-col>
      </el-form-item>
      <el-form-item label="*文件时长：" >
        <el-col :span="6" v-if="audioTime">
          {{ audioTime }}
        </el-col>
        <el-col :span="6" v-else>
          {{ form.audio_length | formatSeconds }}
        </el-col>
      </el-form-item>
      <el-form-item label="资料详情：">
        <el-col :span="18">
          <tinymce v-model="form.course_details"></tinymce>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="onSubmit">保存</el-button>
        <el-button size="small" @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addCourse,courseDetails,updateCourse } from "@/api/growthCamp";
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'
import Request from '@/utils/request'
export default {
  components: { Sticky, Tinymce },
  data() {
    return {
      height: null,
      listLoading: true,
      form: {
        type: 1,
        audio_title: '',
        audio_url:'',
        file_name:'',
        audio_length:'',
        course_details:''
      },
      options:[
      ],
      host: '',
      audioTime:'',
      fileList: [],
      propetry: {
        property: 'audio',
        bucket: 'zm-edu',
      },
      selectedCase:[],
      selectedArticle:[],
    }
  },
  created() {
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    // case_list({case_title:''}).then((res) => {
    //   this.options = res.result;
    // })
    if(this.$route.params.Courseid != '0'){
      this.form.course_id = this.$route.params.Courseid;
      courseDetails({course_id:this.$route.params.Courseid}).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.form.audio_title = res.result.audio_title;
          this.form.course_details = res.result.course_details;
          this.form.audio_url = res.result.audio_url;
          this.form.audio_length = res.result.audio_length;
          this.form.file_name = res.result.file_name;
        }
      });
    }
  },
  filters:{
    formatSeconds(value) {
      if(value != ''){
        let result = parseInt(value)
    　　let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
    　　let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
    　　let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
    　　result = `${h}:${m}:${s}`
    　　return result
      }
    }
  },
  methods: {
    onSubmit() {
      let options = { ...this.form };
      if(options.audio_title == ''){
        this.$message({
          message: '课程名称不能为空，请检查并填写后再提交!',
          type: 'warning'
        })
      }else if(options.audio_url == ''){
        this.$message({
          message: '未上传课程文件，请检查并填写后再提交!',
          type: 'warning'
        })
      }else{
        // console.log('options',options)
        if(options.audio_url.indexOf('mp4') != -1){ options.type = 2 };
        if(this.form.course_id){
          updateCourse(options).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.$router.go(-1);
            }else{
              this.$message({
                message: res.msg,
                type: 'warning'
              });
            }
          })
        }else{
          addCourse(options).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.$router.go(-1);
            }else{
              this.$message({
                message: res.msg,
                type: 'warning'
              });
            }
          })
        }
      }
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      if(file){
        this.form.file_name = '';
        this.form.audio_url = '';
        this.form.audio_length = '';
        this.audioTime = '';
      }
    },
    changeAudio(v){
      if(v){this.fileList = [];}
    },
    handleProgress(file){
      // console.log(file);
    },
    handlePreview(file) {
      // console.log(file);
    },
    handleError(file){
      this.$message.error('文件上传失败，请稍后重试！');
    },
    handleExceed(files, fileList) {
      this.$message.warning('只允许上传一个哦');
    },
    handleSuccess(response, file, fileList) {
      var name = file.name;
      // console.log('file.name',file.name);
      name = name.substring(0, name.length - 4);
      this.form.file_name = name;
      // this.form.course_name = name;
      this.form.audio_url = response.result.urlFile;
      this.form.audio_length = response.result.audioSecond;
      this.audioTime = response.result.audioTime;
      this.audioSuccess = true;
    },
    beforeAvatarUpload1(file) {
      const isType = file.type;
      const isSize = file.size / 1024 / 1024 < 2050;
      this.form.type = isType == 'video/mp4' ? '2' : '1';
      if (isType != 'audio/mp3' && isType != 'audio/mpeg' && isType != 'audio/wav' && isType != 'video/mp4') {
        this.$message.error('上传的资料只能是音频或视频格式哦!');
        return false;
      }
      if (!isSize) {
        this.$message.error('上传的资料大小不能超过 2GB!');
      }
      return isType && isSize;
    },
    onCancel() {
      var that = this;
      this.$confirm('取消后不会保留修改的信息,确认取消?', '提示', {
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
  padding: 0 0 20px;
  h4{
    text-indent: 40px;
  }
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

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
.uploader-head {
  width: 120px;
  height: 120px;
  line-height: 120px;
}
.icon-head {
  width: 150px;
  height: 150px;
  line-height: 150px;
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
.avatar-head {
  width: 150px;
  height: 150px;
  display: block;
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
  }
  &-content-wrap {
    border-radius: 5px;
    height: 100%;
    width: 100%;
    padding: 20px;
    background-color: #fff;
  }
}
</style>