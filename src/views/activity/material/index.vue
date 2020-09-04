<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">新建素材</el-col>
    </sticky>

    <el-form ref="form" class="form-wrap" label-width="140px">
      <el-form-item label="*音频上传：">
        <el-col :span="2">
          <el-upload
            class="upload-demo"
            :before-upload="beforeAvatarUpload"
            :action="host"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :limit="1"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :file-list="fileList"
            ref="upload"
            accept="mp3, wav"
            :data="propetry"
          >
            <!-- :before-remove="beforeRemove" -->
            <el-button size="small">点击上传</el-button>
          </el-upload>
        </el-col>
        <audio ref="audio" style="display: hidden;" :src="form.audio_file"></audio>
        <el-col :span="10" class="input-prompt">格式支持mp3/wav，为保证音频加载与播放的流畅性，建议上传大小不超过500M</el-col>
      </el-form-item>
      <el-form-item label="*音频名称：">
        <el-col :span="10">
          <el-input size="small" v-model="form.name" maxlength="20" placeholder="请输入音频名称"/>
        </el-col>
        <el-col :span="8" class="input-prompt">建议字数在20字以内</el-col>
      </el-form-item>
      <!-- <el-form-item label="*是否上架：">
        <el-radio v-model="form.status" label="1">上架</el-radio>
        <el-radio v-model="form.status" label="0">下架</el-radio>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getEditSource, getActivitySource } from '@/api/table'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
export default {
  components: { Sticky },
  data() {
    return {
      form: {
        name: '',
        audio_file: null
      },
      sourceId: null,
      fileList: [{ name: '', url: '' }],
      audioSuccess: false,
      propetry: {
        property: 'audio'
      },
      host: ''
    }
  },
  created() {
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    this.sourceId = this.$route.params.id;
    if (this.sourceId != 0) {
      this.getSource();
    } else {
      this.fileList = [];
    }
  },
  methods: {
    // 编辑素材
    getSource() {
      const map = {
        id: this.sourceId
      }
      this.audioSuccess = true
      getEditSource(map).then((res) => {
        if (res.code == 200) {
          this.form.name = res.result.name;
          this.form.status = res.result.status;
          this.fileList[0].url = res.result.audio_file
          this.fileList[0].name = res.result.name
          this.form.id = res.result.id;
          this.form.audio_file = res.result.audio_file
        }
      })
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
    handleExceed(files, fileList) {
      // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      this.$message.warning('只允许上传一个哦')
    },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${ file.name }？`);
    // },
    handleSuccess(response, file, fileList) {
      var name = file.name;
      name = name.substring(0, name.length - 4);
      this.form.name = name;
      this.form.audio_file = response.result.urlFile;
      this.form.audio_time = response.result.audioTime
      this.audioSuccess = true;
    },
    beforeAvatarUpload(file) {
      const isType = file.type;
      const isSize = file.size / 1024 / 1024 < 500;
      if (isType != 'audio/mp3' && isType != 'audio/wav') {
        this.$message.error('上传的音频只能是 mp3/wav 格式哦!');
        return false;
      }
      if (!isSize) {
        this.$message.error('上传的音频大小不能超过 500MB!');
      }
      return isType && isSize;
    },
    onSubmit() {
      const that = this;
      const map = { ...this.form };
      if (this.audioSuccess) {
        for (const key in map) {
          if (map[key] == '') {
            this.$message({
              message: '您还有未填写项，请检查并填写后再提交!',
              type: 'warning'
            })
            return false;
          }
        }
        // 新建音频
        getActivitySource(map).then((res) => {
          if (res.code == 200) {
            var that = this;
            this.$message({
              message: res.msg,
              type: 'success'
            })
            setTimeout(function () {
              that.$router.push({ path: `/drainage/media/index` })
            }, 500)
          }
        })
      } else {
        this.$message({
          message: '请等待音频上传完哦!',
          type: 'warning'
        })
      }
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
  padding: 0 0 20px;
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
}
</style>