<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">新建课程专栏</el-col>
    </sticky>
     <el-form ref="form" :model="form" class="form-wrap" label-width="140px">
      <el-form-item label="*标题：">
        <el-col :span="6">
          <el-input size="small" v-model="form.spec_column_title"/>
        </el-col>
      </el-form-item>
      <el-form-item label="简介：">
        <el-col :span="6">
          <el-input size="small" type="textarea" v-model="form.spec_column_introduction"/>
        </el-col>
      </el-form-item>
      <el-form-item label="*总章节数：">
        <el-col :span="6">
          <el-input size="small" v-model="form.spec_column_count"/>
        </el-col>
      </el-form-item>
      <el-form-item label="*封面图：">
        <el-col :span="3">
          <el-upload
            class="avatar-uploader"
            :action="host"
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.cover_img" :src="form.cover_img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
          </el-upload>
        </el-col>
        <!-- <el-col :span="18" class="input-prompt">建议尺寸比例：5:4</el-col> -->
      </el-form-item>
      <el-form-item label="音频类型：">
        <el-col :span="10">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="是否启用开营日期" v-if="form.type == '2'">
        <el-col :span="4">
          <el-radio v-model="form.is_enable" label="1">启用</el-radio>
          <el-radio v-model="form.is_enable" label="0">禁用</el-radio>
        </el-col>
        <el-col :span="18" v-if="form.is_enable == '1'">
          启用开营日期，课程解锁将按照结营日期 + 第*天
        </el-col>
      </el-form-item>
      <el-form-item label="开营日期" v-if="form.is_enable == '1' && form.type == '2'">
        <el-col :span="5">
          <el-input size="small" placeholder="请填写距离开营解锁课程天数" v-model="form.enable_num"/>
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
import { specColumnDetails,addSpecColumn,updateSpecColumn } from "@/api/growthCamp";
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
        type: '1',
        spec_column_title: '',
        spec_column_introduction: '',
        spec_column_count: '',
        cover_img: '',
        is_enable: '0',
        enable_num:'',
      },
      options:[
        {
          value: '1',
          label: '训练营专栏'
        },
        {
          value: '2',
          label: '赠送课程专栏'
        },
        {
          value: '3',
          label: '免费课程专栏'
        },
      ],
      host: '',
      value: '',
      fileList: [],
      propetry: {
        property: 'audio'
      },
      radio: '2'
    }
  },
  created() {
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    if(this.$route.params.Columnid != '0'){
      this.form.spec_column_id = this.$route.params.Columnid;
      specColumnDetails({spec_column_id:this.$route.params.Columnid}).then(res => {
        if (res.code == 200) {
          this.form = { ...res.result };
          // this.form.course_details = res.result.course_details;
          // this.form.audio_url = res.result.audio_url;
          // this.form.audio_length = res.result.audio_length;
        }
      });
    }
  },
  methods: {
    onSubmit() {
      let options = { ...this.form };
      console.log('onSubmit',options)

      if(options.spec_column_title == ''){
        this.$message({
          message: '专栏标题不能为空，请检查并填写后再提交!',
          type: 'warning'
        })
      }else if(options.cover_img == ''){
        this.$message({
          message: '未上传封面图，请检查并填写后再提交!',
          type: 'warning'
        })
      }else if(options.spec_column_count == ''){
        this.$message({
          message: '总章节数不能为空，请检查并填写后再提交!',
          type: 'warning'
        })
      }else if(options.is_enable == '1' && options.enable_num == ''){
        this.$message({
          message: '解锁课程天数不能为空，请检查并填写后再提交!',
          type: 'warning'
        })
      }else{
        if(this.form.spec_column_id){
          updateSpecColumn(options).then((res) => {
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
          addSpecColumn(options).then((res) => {
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
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式 或者 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess2(res, file) {
      this.form.cover_img = res.result.urlFile;
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
    text-indent: 30px;
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