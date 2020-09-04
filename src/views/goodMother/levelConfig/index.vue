<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="titles">各等级代言人人数</el-col>
      <el-col :span="24">
        <el-table
          class="margin-top-30"
          v-loading="listLoading"
          :data="list1"
          element-loading-text="Loading"
          border
          fit
          size='mini'
          highlight-current-row>
          <el-table-column label="LV1" prop="LV0" align="center">
          </el-table-column>
          <el-table-column label="LV2" prop="LV1" align="center">
          </el-table-column>
          <el-table-column label="LV3" prop="LV2" align="center">
          </el-table-column>
          <el-table-column label="LV4" prop="LV3" align="center">
          </el-table-column>
          <el-table-column label="LV5" prop="LV4" align="center">
          </el-table-column>
          <el-table-column label="LV6" prop="LV5" align="center" v-if="echLevelUser.LV5">
          </el-table-column>
          <el-table-column label="LV7" prop="LV6" align="center" v-if="echLevelUser.LV6">
          </el-table-column>
          <el-table-column label="LV8" prop="LV7" align="center" v-if="echLevelUser.LV7">
          </el-table-column>
          <el-table-column label="LV9" prop="LV8" align="center" v-if="echLevelUser.LV8">
          </el-table-column>
          <el-table-column label="LV10" prop="LV9" align="center" v-if="echLevelUser.LV9">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="titles">代言人等级说明</el-col>
      <el-col :span="24">
        <el-table
          class="margin-top-30"
          v-loading="listLoading"
          :data="list2"
          element-loading-text="Loading"
          border
          fit
          size='mini'
          highlight-current-row>
          <el-table-column label="会员等级" prop="level_rank" align="center">
          </el-table-column>
          <el-table-column label="会员名称" prop="level_name" align="center">
          </el-table-column>
          <el-table-column label="所需爱心值" prop="level_score" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="option(scope.row)">
                {{scope.row.level_name == '' ? '待配置' : '编辑'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-dialog title="等级编辑" v-model="dialogFormVisible" :visible.sync="dialogFormVisible">
        <el-form :model="editform" :rules="rules" label-width="120px" ref="editform">
          <el-form-item label="等级名称：" prop="level_name">
            <el-col :span="10">
              <el-input size="small" maxlength="20" v-model="editform.level_name"/>
            </el-col>
          </el-form-item>
          <el-form-item label="等级图标：" prop="level_icon_url">
            <el-col :span="10">
              <el-upload
                class="avatar-uploader"
                :action="host"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="editform.level_icon_url" :src="editform.level_icon_url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
              </el-upload>
            </el-col>
            <el-col :span="18" class="input-prompt">建议尺寸：50*50像素,小于1M</el-col>
          </el-form-item>

          <el-form-item label="头像边框：" prop="level_img_url">
            <el-col :span="10">
              <el-upload
                class="avatar-uploader"
                :action="host"
                :show-file-list="false"
                :on-success="handleAvatarSuccess2"
                :before-upload="beforeAvatarUpload">
                <img v-if="editform.level_img_url" :src="editform.level_img_url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
              </el-upload>
            </el-col>
            <el-col :span="18" class="input-prompt">建议尺寸：50*50像素,小于1M</el-col>
          </el-form-item>

          <el-form-item label="等级爱心值：" prop="level_score">
            <el-col :span="10">
              <el-input size="small" maxlength="20" v-model="editform.level_score" placeholder="最小值为0"/>
            </el-col>
            <el-col :span="18" class="input-prompt">需要大于上一级的最少值</el-col>
          </el-form-item>
          
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="editSubmit('editform')">提交</el-button>
        </div>
      </el-dialog>
    </el-col>
  </div>
</template>

<script>
import { getLevelList, getEachLevelUserNum,updateLevel } from "@/api/spokesperson";
import Request from '@/utils/request'
export default {
  data() {
    return {
      echLevelUser:{
        LV0:'',
        LV1:'',
        LV2:'',
        LV3:'',
        LV4:'',
        LV5:'',
        LV6:'',
        LV7:'',
        LV8:'',
        LV9:'',
        LV10:'',
      },
      listLoading: false,
      list1:[],
      list2:[],
      dialogFormVisible: false,
      editform: [],
      formLabelWidth: "120px",
      host: '',
      fileList: [{ name: '', url: '' }],
      rules: {
        level_name: [
          { required: true, message: '等级名称不能为空', trigger: 'blur' },
        ],
        level_icon_url: [
          { required: true, message: '等级图标不能为空', trigger: 'blur' },
        ],
        level_img_url: [
          { required: true, message: '头像边框不能为空', trigger: 'blur' },
        ],
        level_score: [
          { required: true, message: '等级爱心值不能为空', trigger: 'blur' },
        ]
      },
    };
  },
  created() {
    this.goodsListId = this.$route.params.id;
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    this.getLevelList();
    this.getEachLevelUserNum();
  },
  methods: {
    getLevelList() {
      this.listLoading = true;
      getLevelList().then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.list2 = res.result;
        }
      });
    },
    getEachLevelUserNum() {
      this.listLoading = true;
      getEachLevelUserNum().then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          let obj = {};
          for (let k = 0; k < res.result.length; k++) {
            obj['LV'+k] = res.result[k].level_people_num;
          }
          this.echLevelUser = obj;
          // this.echLevelUser.LV9 = '233';
          this.list1.push(obj);
        }
      });
    },
    option(datas){
      this.dialogFormVisible = true;
      this.editform = datas;
    },
    editSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editform.property = 'spokesLeval';
          updateLevel(this.editform).then(res => {
            if (res.code == 200) {
              this.dialogFormVisible = false;
              this.$message({
                message: '操作成功！',
                type: 'success'
              });
              this.getLevelList();
            }
          });
          
        } else {
          console.log("error submit!!");
        }
      });
    },
    handleAvatarSuccess(res, file) {
      this.editform.level_icon_url = res.result.urlFile;
    },
    handleAvatarSuccess2(res, file) {
      this.editform.level_img_url = res.result.urlFile;
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
    }
  }
};
</script>
<style lang="scss" scoped>
.margin-top-30 {
  margin: 15px 0;
}
.lineheight-32 {
  line-height: 32px;
  text-align: right;
  padding-right: 10px;
}
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
  box-sizing: border-box;
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
.success-btn {
  text-align: right;
}
.text_overflow {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}
.avatar-uploader .el-upload{
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar-uploader .el-upload img{
  max-height: 150px;
  min-height: 80px;
}
.titles{
  height: 30px;
  line-height: 30px;
  border-bottom: 1.5px solid #DCDFE6;
}
</style>