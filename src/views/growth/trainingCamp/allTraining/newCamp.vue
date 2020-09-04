<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">
        {{form.all_camp_id == '' ? ' 新建训练营' : ' 编辑训练营' }}
       </el-col>
    </sticky>
     <el-form ref="form" :model="form" class="form-wrap" label-width="140px">
       <el-form-item label="*训练营名称：">
        <el-col :span="6">
          <el-input size="small" placeholder="请输入训练营名称" v-model="form.all_camp_name"/>
        </el-col>
      </el-form-item>
      <el-form-item label="*广告图：">
        <el-col :span="3">
          <el-upload
            class="avatar-uploader"
            :action="host"
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.adv_img" :src="form.adv_img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
          </el-upload>
        </el-col>
      </el-form-item>
      <el-form-item label="商品排列顺序：">
        <el-col :span="6">
          <el-input size="mini" v-model="form.sort" placeholder="请输入排列顺序"/>
        </el-col>
      </el-form-item>
      <el-form-item label="*位置：">
        <el-col :span="5">
          <el-select v-model="form.camp_position_id" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.camp_position_name"
              :value="item.camp_position_id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="small" @click="dialogFormVisible = true">位置管理</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="*选择商品：">
        <el-col :span="10">
          <el-input size="small" placeholder="请输入跳转地址" v-model="form.goods_url"/>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="onSubmit">保存</el-button>
        <el-button size="small" @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="位置管理" width="35%" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="创建位置" name="first">
          <el-form :model="newform" :rules="rules" ref="newform">
            <el-form-item label="位置名称" prop="camp_position_name" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input placeholder="请输入位置名称" v-model="newform.camp_position_name" ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="位置简介" prop="camp_position_introduction" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input placeholder="请输入位置简介" v-model="newform.camp_position_introduction" ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="位置排序" prop="camp_position_sort" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input placeholder="请输入位置排序" v-model="newform.camp_position_sort" ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item  :label-width="formLabelWidth">
              <el-col :span="18">
                <el-button size="small" @click="resetForm('newform')">取 消</el-button>
                <el-button size="small" type="primary" @click="addPos()">确 定</el-button>
              </el-col>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="编辑位置" name="second">
          <el-form :model="editform" :rules="rules" ref="editform">
            <el-form-item label="选择编辑项" prop="camp_position_name" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-select v-model="form.camp_position_id2" @change="changePosition(form)" placeholder="请选择">
                  <el-option
                    v-for="item in options2"
                    :key="item.id"
                    :label="item.camp_position_name"
                    :value="item.camp_position_id">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="位置名称" prop="camp_position_name" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input placeholder="请输入位置名称" v-model="editform.camp_position_name" ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="位置简介" prop="camp_position_introduction" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input placeholder="请输入位置简介" v-model="editform.camp_position_introduction" ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="位置排序" prop="camp_position_sort" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input placeholder="请输入位置排序" v-model="editform.camp_position_sort" ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item  :label-width="formLabelWidth">
              <el-col :span="18">
                <el-button size="small" @click="resetForm('editform')">取 消</el-button>
                <el-button size="small" type="primary" @click="editPos()">确 定</el-button>
              </el-col>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { campPositionList,addCampPosition,addAllCamp,editAllCamp,allCampDetails,editCampPosition } from "@/api/growthCamp";
import Pagination from '@/components/Pagination';
import Sticky from '@/components/Sticky';
import Tinymce from '@/components/Tinymce';
// import Request from '@/utils/request';
export default {
  components: { Sticky, Tinymce },
  data() {
    return {
      height: null,
      listLoading: true,
      form: {
        adv_img: '',
        sort: '',
        camp_position_id: '',
        camp_position_id2: '',
        goods_url:'',
        all_camp_name:'',
        all_camp_id:''
      },
      options:[],
      options2:[],
      newform:{
        camp_position_name:'',
        camp_position_introduction:'',
        camp_position_sort:'',
      },
      editform:{
        camp_position_name:'',
        camp_position_introduction:'',
        camp_position_sort:'',
        camp_position_id:'',
      },
      formLabelWidth: '100px',
      rules: {
        name: [
          { required: true, message: '请输入训练营名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      host: '',
      fileList: [],
      propetry: {
        property: 'audio'
      },
      selectedCase:[],
      selectedArticle:[],
      value:'',
      dialogFormVisible:false,
      activeName: 'first'
    }
  },
  created() {
    this.campPositionList();
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    if(this.$route.params.Campid != '0'){
      this.getinfo()
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    getinfo(){
      this.form.all_camp_id = this.$route.params.Campid;
      allCampDetails({all_camp_id:this.$route.params.Campid}).then(res => {
        if (res.code == 200) {
          this.form = { ...res.result };
        }
      });
    },
    changePosition(v){
      for (let index = 0,len=this.options2.length; index < len; index++) {
        if(this.options2[index].camp_position_id == v.camp_position_id2){
          this.editform = this.options2[index];
        }
      }
    },
    addPos(){
      addCampPosition(this.newform).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.campPositionList();
          this.resetForm('newform')
        }
      })
    },
    editPos(){
      editCampPosition(this.editform).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.campPositionList();
          this.resetForm('editform')
          
        }
      })
    },
    campPositionList(){
      campPositionList({}).then((res) => {
        this.options = res.result.list;
        this.options2 = JSON.parse(JSON.stringify(this.options));
      })
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      // this.$refs[formName].resetFields();
      this.form.camp_position_id2 = '';
      if(this.$route.params.Campid != '0'){
        this.getinfo()
      }
      if(formName == 'newform'){
        this.newform = {
          camp_position_name:'',
          camp_position_introduction:'',
          camp_position_sort:'',
        }
      }else{
        this.editform = {
          camp_position_name:'',
          camp_position_introduction:'',
          camp_position_sort:'',
          camp_position_id:'',
        }
      }
    },
    onSubmit() {
      let options = { ...this.form };
      console.log('submitForm', options);
      if(options.all_camp_name == ''){
        this.$message({
          message: '训练营名称不能为空，请检查并填写后再提交!',
          type: 'warning'
        })
      }else if(options.adv_img == ''){
        this.$message({
          message: '广告图不能为空，请检查并填写后再提交!',
          type: 'warning'
        })
      }else if(options.camp_position_id == ''){
        this.$message({
          message: '训练营位置不能为空，请检查并填写后再提交!',
          type: 'warning'
        })
      }else if(options.goods_url == ''){
        this.$message({
          message: '商品链接不能为空，请检查并填写后再提交!',
          type: 'warning'
        })
      }else{
        if(this.form.all_camp_id){
          editAllCamp(options).then((res) => {
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
          addAllCamp(options).then((res) => {
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
      this.form.adv_img = res.result.urlFile;
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