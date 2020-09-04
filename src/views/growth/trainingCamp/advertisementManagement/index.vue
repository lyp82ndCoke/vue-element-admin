<template>
  <div class="advertisementManagement">
    <el-row class="title-header" type="flex" justify="space-between">
      <el-col :span="10">
        <el-col :span="12">
          <el-input size="small" placeholder="请输入广告名称" prefix-icon="el-icon-search" 
          v-model="listQuery.search_name" clearable></el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="listQuery.is_use" size="small" @change='changeType'>
            <el-option
              v-for="item in options1" 
              :key="item.index" 
              :label="item.label" 
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button type="success" @click="searchList()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="addNew()" size="small">创建广告</el-button>
      </el-col>
    </el-row>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="lists"
        element-loading-text="Loading"
        border
        fit
        size='small'
        highlight-current-row>
        <el-table-column label="广告贴片" prop="paper_name" align="center" width='260'>
          <template slot-scope="scope">
            <img :src="scope.row.adv_pic_url" alt="" width="200" height="80" v-if="scope.row.adv_pic_url">
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="广告名称" prop="adv_name" align="center">
        </el-table-column>
        <el-table-column label="广告位置" prop="annotate" align="center" width='230'>
        </el-table-column>
        <el-table-column label="所属商品" prop="camp_times_name" align="center" width='190'>
        </el-table-column>
        <el-table-column label="状态" prop="paper_name" align="center" width='120'>
          <template slot-scope="scope">
            <span>{{ scope.row.is_use == '1' ? '已上架' : '已下架' }}</span>
          </template> 
        </el-table-column>
        <el-table-column label="操作" align="center" width='120'>
          <template slot-scope="scope">
            <el-button size="small" @click="goEdit(scope.row.id)" type="text">编辑</el-button>
            <el-button size="small" @click="goSale(scope.row.id,scope.row.is_use)" type="text">
              {{ scope.row.is_use == '1' ? '去下架' : '去上架' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-if="total!=0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="changePaging"
      />
    </el-col>

    <el-dialog title="创建/编辑广告" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
        <el-form-item label="广告所属模块" prop="position">
          <span>训练营-小任务</span>
        </el-form-item>
        <el-form-item label="关联营期" required>
          <el-col :span="7">
            <el-form-item prop="camp_id">
              <el-select v-model="ruleForm.camp_id" placeholder="请选择训练营" size="small" @change="changeSkus1">
                <el-option
                  v-for="item in options2"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="camp_times_id">
              <el-select v-model="ruleForm.camp_times_id" placeholder="请选择营期" size="small">
                <el-option
                  v-for="item in options3"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="广告名称" prop="adv_name">
          <el-col :span="14">
            <el-input size="small" placeholder="请输入广告名称" v-model="ruleForm.adv_name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="广告详细位置" prop="site_id">
          <el-col :span="7">
            <el-select v-model="ruleForm.site_id" size="small" @change="changeSkus2" placeholder="请输入广告位置">
              <el-option
                v-for="item in options4" 
                :key="item.index" 
                :label="item.annotate" 
                :value="item.site_id">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="广告跳转地址" prop="adv_param">
          <el-col :span="14">
            <el-input type="textarea" :rows="3" size="small" placeholder="请输入广告跳转地址" v-model="ruleForm.adv_param"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="广告贴片(广告图)" v-if="site_type == '2'" prop="adv_pic_url">
          <el-col :span="5">
            <el-upload
              class="avatar-uploader"
              :action="host"
              :show-file-list="false"
              :data="uploadPoster"
              :on-success="handleAvatarSuccess2"
              :before-upload="beforeAvatarUpload">
              <img v-if="ruleForm.adv_pic_url" :src="ruleForm.adv_pic_url" class="avatar" width="110" height="90">
              <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
            </el-upload>
          </el-col>
          <el-col :span="24" v-if="imgSize">{{ imgSize }}</el-col>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          <el-button size="small" @click="resetForm('ruleForm')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { campList, campTimesList, getAdvList, insertAdv, getSiteList, updateAdv, getAdv, advSetUse  } from "@/api/growthCamp";
import Pagination from '@/components/Pagination';

export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      listLoading: true,
      lists:[],
      listQuery: {
        page_num: 1,
        page_size: 10,
        search_name:'',
        is_use:''
      },
      total: 0,
      imgSize:'',
      site_type:'2',
      isNew: true,
      options1:[
        {
          label: '全部状态',
          value: ''
        },
        {
          label: '已上架',
          value: '1'
        },
        {
          label: '已下架',
          value: '2'
        }
      ],
      options2:[],
      options3:[],
      options4:[],
      camp_id: '',
      camp_times_id: '',
      formLabelWidth: '120px',
      ruleForm:{
        adv_name: '',
        adv_param: '',
        adv_pic_url: '',
        camp_id: '',
        camp_times_id: '',
        site_id: "",
      },
      rules:{
        camp_id:{ required: true, message: '请选择训练营', trigger: 'change' },
        camp_times_id:{ required: true, message: '请选择训练营营期', trigger: 'change' },
        adv_name:{ required: true, message: '请输入广告名称', trigger: 'blur' },
        site_id:{ required: true, message: '请选择广告位置', trigger: 'change' },
        adv_param:{ required: true, message: '请输入广告链接', trigger: 'blur' },
        adv_pic_url:{ required: true, message: '请上传广告图片', trigger: 'blur' }
      },
      dialogFormVisible: false,
      uploadPoster: {
        bucket: "zm-edu",
        property: 'adManagement-poster'
      }
    }
  },
  created(){
    this.getTableList();
    this.getSiteList();
    this.campList();
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
  },
  methods:{
    //列表数据
    getTableList(){
      this.listLoading = true;
      getAdvList(this.listQuery).then(res => {
        if(res.code == 200){
          this.listLoading = false;
          this.lists = res.result.adv_list;
          this.total = Number(res.result.count);
        }
      })
    },
    //广告位置列表
    getSiteList(){
      getSiteList({ site_category:'1' }).then(res => {
        if(res.code == 200){
          this.options4 = res.result.site_list;
        }
      })
    },
    //训练营列表
    campList(){
      campList({ page_num: 1,page_size: 999 }).then(res => {
        if (res.code == 200) {
          res.result.list.forEach(v=>{
            this.options2.push(
              {
                label: v.camp_name,
                value: v.camp_id
              }
            )
          })
        }
      });
    },
    //营期列表
    campTimesList(v){
      campTimesList({ page_num: 1,page_size: 999,camp_id: v }).then(res => {
        if (res.code == 200) {
          res.result.list.forEach(v=>{
            this.options3.push(
              {
                label: v.camp_times_name,
                value: v.camp_times_id,
                start_time: v.start_time,
                end_time: v.end_time
              }
            )
          })
        }
      })
    },
    changeSkus1(v){
      this.options3 = [];
      this.ruleForm.camp_times_id = '';
      this.campTimesList(v);
      this.options1.forEach(k=>{
        if(k.value == v){
          this.match_info.match_name = k.label;
          this.match_info.camp_id = k.value;
        }
      })
    },
    changeSkus2(v){
      this.options4.forEach(k=>{
        if(k.site_id == v){
          this.imgSize = k.pic_remarks;
          this.site_type = k.site_type;
        }
      })
    },
    addNew(){
      this.dialogFormVisible = true;
      this.isNew = true;
      this.ruleForm = {
        adv_name: '',
        adv_param: '',
        adv_pic_url: '',
        camp_id: '',
        camp_times_id: '',
        site_id: "",
      }
    },
    changeType(){
      this.listQuery.page_num = 1;
      this.getTableList();
    },
    goEdit(id){
      this.dialogFormVisible = true;
      this.isNew = false;
      //获取详情
      getAdv({ adv_id:id }).then(res => {
        if (res.code == 200) {
          // this.ruleForm = { ...res.result.adv_info };
          this.ruleForm.site_id = res.result.adv_info.site_id;
          this.ruleForm.adv_id = res.result.adv_info.id;
          this.ruleForm.adv_name = res.result.adv_info.adv_name;
          this.ruleForm.adv_param = res.result.adv_info.adv_param;
          this.ruleForm.adv_pic_url = res.result.adv_info.adv_pic_url;
          this.ruleForm.camp_id = res.result.adv_info.camp_id;
          this.ruleForm.camp_times_id = res.result.adv_info.camp_times_id;
          this.site_type = res.result.site_info.site_type;
          this.campTimesList(res.result.adv_info.camp_id);
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log('submitForm',this.ruleForm);
          if(!this.isNew){
          //编辑
            updateAdv(this.ruleForm).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.getTableList();
                this.dialogFormVisible = false;
              }
            });
          }else{
          //新建
            insertAdv(this.ruleForm).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.getTableList();
                this.dialogFormVisible = false;
              }
            })
          }
          this.isNew = true;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    goSale(id,type){
      this.$confirm('确定执行此操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        advSetUse({ adv_id:id,is_use: type == '2'? '1': '2' }).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getTableList();
          }
        });
      })
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
      this.ruleForm.adv_pic_url = res.result.urlFile;
    },
    changePaging(){
      this.getTableList();
    },
    searchList(){
      this.listQuery.page_num = 1;
      this.getTableList();
    }
  }
}
</script>

<style lang="scss" scoped>
.advertisementManagement{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
  }
  .avatar-uploader .el-upload{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
  .el-dialog__body{
    padding: 20px;
  }
}
</style>

<style lang="scss">
.advertisementManagement{
  .avatar-uploader .el-upload{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
  .el-dialog__body{
    padding: 10px 0px;
  }
}
</style>