<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">新建活动</el-col>
    </sticky>
    <el-form ref="form" :model="form" class="form-wrap" label-width="140px">
      <el-form-item label="*活动名称：">
        <el-col :span="10">
          <el-input size="small" v-model="form.name"/>
        </el-col>
      </el-form-item>
      <el-form-item label="*活动时间：">
        <el-col :span="18">
          <el-date-picker
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="timeValue"
            type="datetimerange"
            range-separator="至"
            :start-placeholder="form.starttime"
            :end-placeholder="form.endtime"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="*活动助力值比：">
        <el-col :span="2">
          <el-input size="small" disabled value="1"/>
        </el-col>
        <el-col :span="1" class="align-center">:</el-col>
        <el-col :span="3">
          <el-input size="small" type="number" min="1" v-model="form.proportion"/>
        </el-col>
        <el-col :span="18" class="input-prompt">1好友=1助力，比例值为整数，默认为1:1</el-col>
      </el-form-item>
      <el-form-item label="*初始助力值：">
        <el-col :span="3">
          <el-input size="small" type="number" min="0" v-model="form.start_value"/>
        </el-col>
        <el-col :span="18" class="input-prompt">新老用户均得初始值，0的话前端不显示</el-col>
      </el-form-item>
      <el-form-item label="*活动封面图：">
        <el-col :span="5">
          <el-upload
            class="avatar-uploader"
            :action="host"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.coverimg" :src="form.coverimg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="18" class="input-prompt">建议尺寸：690*510像素</el-col>
      </el-form-item>
      <el-form-item label="*分享海报：">
        <div class="posterimg-wrap" v-if="showImg" onselectstart="return false;">
          <img :src="form.localimg" ref="posterimg" class="posterimg" alt id="postering">
          <span
            v-if="avaterOption.is_head_display"
            class="posterimg-avatar"
            @mousedown="avatarHandleDrag"
            :style="{top:avaterOption.head_y+'px',left:avaterOption.head_x+'px',width:innerWidth+'px',height:innerWidth+'px'}"
          ></span>
          <span
            class="posterimg-code"
            @mousedown="codeHandleDrag"
            :style="{lineHeight:form.font_size+'px',height:form.font_size+'px',top:form.code_y+'px',left:form.code_x+'px'}"
          ></span>
        </div>
        <div class="posterimg-right-wrap">
          <el-form-item label="上传海报：">
            <el-upload
              class="posterimg-uploader"
              :action="host"
              :show-file-list="false"
              :on-success="handlePosterimgSuccess"
              :before-upload="beforePosterimgUpload"
              :data="abc"
            >
              <el-button size="small" type="primary">上传海报</el-button>
            </el-upload>
            <el-col :span="24" class="input-prompt">建议尺寸：750*xxx像素，JPG\png格式，图片小于2M</el-col>
          </el-form-item>
          <el-form-item label="用户头像：">
            <el-switch
              style="display: block; margin-top:9px; "
              v-model="avaterOption.is_head_display"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="显示"
              inactive-text="隐藏"
            ></el-switch>
          </el-form-item>
          <el-form-item label="位置自定义：">
            <el-col>鼠标拖动，可以自定义邀请码、头像、昵称的显示位置</el-col>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="*规则说明：">
        <tinymce v-model="form.rule"></tinymce>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addActivity, editActivity } from '@/api/table'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'
import Request from '@/utils/request'
export default {
  components: { Sticky, Tinymce },
  data() {
    return {
      timeValue: [],
      showImg: true,
      form: {
        name: '',
        starttime: '开始日期',
        endtime: '结束日期',
        start_value: 0,
        coverimg: "",
        localimg: '', //oss
        posterimg: '', //相对
        code_x: 10,
        code_y: 70,
        rule: '',
        head_pic_width: 45,
        font_size: 30
      },
      avaterOption: {
        is_head_display: true,
        head_x: 10,
        head_y: 10,
      },
      innerWidth: 80,
      editId: null,
      haibao: '', //显示
      abc: {
        property: 'poster'
      },
      proportion: 1,
      host: ''
    }
  },
  created(options) {
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    this.editId = this.$route.params.id;
    if (this.$route.params.id != 0) {
      this.onEdit();
    }
  },
  methods: {
    //编辑活动
    onEdit() {
      const map = {
        id: this.editId
      }
      editActivity(map).then((res) => {
        if (res.code == 200) {
          this.haibao = res.result.posterimg;

          this.form = res.result;
          this.timeValue[0] = res.result.starttime;
          this.timeValue[1] = res.result.endtime;
          this.avaterOption = res.result;
          const that = this;
          const postering = document.getElementById('postering');
          postering.onload = function () {
            that.proportion = this.naturalWidth / 375;
            // console.log(that.proportion, '编辑比例')
            that.showImg = false;
            that.showImg = true;
            that.form.code_x = Number(that.form.code_x) / that.proportion;
            that.form.head_x = Number(that.form.head_x) / that.proportion;
            that.form.head_y = Number(that.form.head_y) / that.proportion;
            that.form.code_y = Number(that.form.code_y) / that.proportion - Number(that.form.font_size);
            // that.form.head_pic_width = that
            const width = Number(that.form.head_pic_width);
            // console.log(res.result.head_pic_width, that.proportion, '图像')
            that.form.head_pic_width = Math.round(width);
          }
        }
      })
    },
    // 提交新建活动
    onSubmit() {
      var that = this;
      let options = { ...that.form };

      if (that.avaterOption.is_head_display) {
        options = { ...options, ...that.avaterOption }
      }
      // console.log(options.code_x,that.proportion,'dddd')
      options.code_x = Math.round(options.code_x * that.proportion);
      options.code_y = Math.round(options.code_y * that.proportion) + Number(that.form.font_size);
      // console.log(options.code_x,that.proportion)
      options.starttime = that.timeValue[0];
      options.endtime = that.timeValue[1];
      options.head_x = Math.round(options.head_x * that.proportion);
      options.head_y = Math.round(options.head_y * that.proportion);
      // console.log(options, '参数')
      for (const key in options) {
        const item = options[key];
        // console.log(key, 'key')
        if (item === '' && key != 'posteimg') {
          that.$message({
            message: '您还有未填写项，请检查并填写后再提交!',
            type: 'warning'
          })
          return false;
        }
      }
      options.is_head_display = that.avaterOption.is_head_display ? 1 : 0;
      if (that.editId != '') {
        options.id = that.editId
      }
      addActivity(options).then((res) => {
        that.$message({
          message: res.msg,
          type: 'success'
        });
        setTimeout(function () {
          that.$router.push({ path: '/drainage/activity/index' })
        }, 500)
      })
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
    // 移动头像
    avatarHandleDrag(e) {
      let { top, left } = this.handleDrag(e, ({ top, left }) => {
        // console.log(top, left)
        this.avaterOption.head_x = left;
        this.avaterOption.head_y = top;
      });
    },
    // 移动code
    codeHandleDrag(e) {
      let { top, left } = this.handleDrag(e, ({ top, left }) => {
        // console.log(top, left)
        this.form.code_x = left;
        this.form.code_y = top;
      });
    },
    // 拖拽函数
    handleDrag(e, callback) {
      let left, top;
      let odiv = e.target;        //获取目标元素
      // console.log(e)
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      // 计算最大移动位置
      // console.log(this.$refs.posterimg.offsetHeight,this.$refs.posterimg.offsetWidth)
      let maxTop = this.$refs.posterimg.offsetHeight - e.target.clientHeight;

      let maxLeft = this.$refs.posterimg.offsetWidth - e.target.clientWidth;
      document.onmousemove = (e) => {       //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        left = e.clientX - disX;
        top = e.clientY - disY;

        // console.log(left,top)
        //绑定元素位置到positionX和positionY上面

        left = left < 0 ? 0 : left;
        top = top < 0 ? 0 : top;
        left = left > maxLeft ? maxLeft : left;
        top = top > maxTop ? maxTop : top;
        // console.log('maxLeft:',maxLeft,'left:',left,'top',top)
        // this.form.head_x = left;
        // this.form.head_y = top;
        callback({ top, left })
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    handleAvatarSuccess(res, file) {
      this.form.coverimg = res.result.urlFile;
    },
    beforeAvatarUpload(file) {
      // console.log(this.$refs.posterimg.naturalWidth, '1')

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

      this.form.posterimg = '';
      // console.log(res, '123')
      this.form.posterimg = res.result.allFile;
      this.form.localimg = res.result.urlFile;

      this.haibao = res.result.urlFile;
      this.reserve();
    },
    reserve() {
      const that = this;
      const postering = document.getElementById('postering');
      postering.onload = function () {
        that.showImg = false;
        that.showImg = true;
        that.proportion = this.naturalWidth / 375;
        // console.log(that.proportion, '上传比例')
        const width = that.innerWidth * that.proportion;
        that.form.head_pic_width = Math.round(width);
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0 0 20px;
}
.form-wrap {
  padding: 20px;
  .input-prompt {
    font-size: 12px;
    color: red;
    padding-left: 20px;
  }
  .posterimg-wrap {
    display: inline-flex;
    position: relative;
    float: left;
    font-size: 0;
    border: 1px solid #eee;
    .posterimg {
      width: 375px;
      height: 100%;
    }
    .posterimg-avatar {
      position: absolute;
      width: 45px;
      height: 45px;
      background-color: red;
      cursor: move;
    }
    .posterimg-code {
      position: absolute;
      width: 100px;
      background-color: yellow;
      cursor: move;
    }
  }
  .posterimg-right-wrap {
    padding: 0 20px;
    float: left;
  }
}
.line {
  text-align: center;
}
.sub-navbar {
  text-align: left;
  .subtitle {
    padding: 0 20px;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>


