<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">新建商品</el-col>
    </sticky>
    <el-form ref="form" :model="form" class="form-wrap" label-width="140px">
      <el-form-item label="*商品名称：">
        <el-col :span="10">
          <el-input size="small" maxlength="20" v-model="form.name"/>
        </el-col>
        <el-col :span="5" class="input-prompt">最多输入20个字哦</el-col>
      </el-form-item>
      <el-form-item label="*商品副标题：">
        <el-col :span="10">
          <el-input size="small" maxlength="40" v-model="form.title"/>
        </el-col>
        <el-col :span="5" class="input-prompt">最多输入40个字哦</el-col>
      </el-form-item>
      <el-form-item label="*商品售价：">
        <el-col :span="10">
          <el-input onkeyup="value=value.replace(/[^\d]/g,'')" size="small" v-model="form.price"/>
        </el-col>
        <el-col :span="5" class="input-prompt">助力值</el-col>
      </el-form-item>
      <!-- <el-form-item label="*音频关联：">
        <el-col :span="10">
          <input type="button" value="+ 关联课程" id="sel-goods-btn" @click="showAlert">
        </el-col>
      </el-form-item>-->
      <el-form-item label="*商品封面图：">
        <el-col :span="5">
          <el-upload
            class="avatar-uploader"
            :action="host"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.coverimg" :src="form.coverimg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
          </el-upload>
        </el-col>
        <el-col :span="18" class="input-prompt">建议尺寸：750*320像素</el-col>
      </el-form-item>
      <el-form-item label="*商品缩略图：">
        <el-col :span="5">
          <el-upload
            class="avatar-uploader"
            :action="host"
            :show-file-list="false"
            :on-success="handlePosterimgSuccess"
            :before-upload="beforePosterimgUpload"
          >
            <img v-if="form.headimg" :src="form.headimg" class="avatar-head">
            <i v-else class="el-icon-plus avatar-uploader-icon icon-head"></i>
          </el-upload>
        </el-col>
        <el-col :span="18" class="input-prompt">建议尺寸：90*90像素</el-col>
      </el-form-item>
      <!-- <el-form-item label="*排序：">
        <el-col :span="5">
          <el-input onkeyup="value=value.replace(/[^\d]/g,'')" size="small" v-model="form.orderline"/>
        </el-col>
        <el-col :span="10" class="input-prompt">（用于商品排序，序号越大，排名越前，且不能小于0）</el-col>
      </el-form-item>-->
      <el-form-item label="*商品详情：">
        <tinymce v-model="form.detail"></tinymce>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getEditGoods, ActivityGoods } from '@/api/table'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'
import Request from '@/utils/request'
export default {
  components: { Sticky, Tinymce },
  data() {
    return {
      height: null,
      searchText: '',
      form: {
        name: '',
        title: '',
        coverimg: '', //商品封面图
        headimg: '', //商品头图
        // orderline: null, //商品排序headline
        detail: '', //商品详情
      },
      options: [{ label: "已上架", value: "1" }, { label: "已下架", value: "2" }],
      list: null,
      host: ''
    }
  },
  created() {
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    this.editId = this.$route.params.id;
    if (this.editId != 0) {
      this.goodsDetail()
    }
  },
  methods: {
    // 编辑商品 详情
    goodsDetail() {
      getEditGoods({id: this.editId}).then((res) => {
        this.form = res.result
      })
    },
    handleAvatarSuccess(res, file) {
      this.form.coverimg = res.result.urlFile;
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
    handlePosterimgSuccess(res, file) {
      this.form.headimg = res.result.urlFile;
    },
    beforePosterimgUpload(file) {
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
    onSubmit() {
      var that = this;
      let options = { ...this.form };
      for (const key in options) {
        const item = options[key];
        if (item == '') {
          this.$message({
            message: '您还有未填写项，请检查并填写后再提交!',
            type: 'warning'
          })
          return false;
        }
      }
      // 新建商品
      if (this.editId != '') {
        options.id = this.editId
      }
      ActivityGoods(options).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        that.$router.push({ path: '/drainage/goods/index' })
      })
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
  width: 120px;
  height: 120px;
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