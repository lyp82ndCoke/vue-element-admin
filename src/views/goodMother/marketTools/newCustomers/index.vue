<template>
  <div class="newCustomers_container">
    <el-col :span="24" class="title-header">
      <h3>新人页面配置页</h3>
    </el-col>
    <el-col :span="24" class="title-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="头部区域" prop="topTitle">
          <el-col :span="18">
            <tinymce v-model.trim="ruleForm.topTitle"></tinymce>
          </el-col>
        </el-form-item>
        <el-form-item></el-form-item>
        <el-form-item label="训练营新客" prop="tarningCamp">
          <el-col :span="18">
            <tinymce v-model.trim="ruleForm.tarningCamp"></tinymce>
          </el-col>
        </el-form-item>
        <el-form-item></el-form-item>
        <el-form-item label="知识付费新客" prop="knowledge">
          <el-col :span="18">
            <tinymce v-model.trim="ruleForm.knowledge"></tinymce>
          </el-col>
        </el-form-item>
        <el-form-item></el-form-item>
        <el-form-item label="电商新客" prop="onlineShop">
          <el-col :span="18">
            <tinymce v-model.trim="ruleForm.onlineShop"></tinymce>
          </el-col>
        </el-form-item>
        <el-form-item></el-form-item>
        <el-form-item label="老用户提示" prop="onlineShop2">
          <el-col :span="18">
            <tinymce v-model.trim="ruleForm.onlineShop2"></tinymce>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="18" style="text-align: center;">
            <el-button size="small" type="danger" @click="submitForm('ruleForm')">&nbsp; 保 &nbsp; 存 &nbsp;</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>
import { NewUserConfigDetails,NewUserConfigUpdate } from "@/api/growthCamp";
import Tinymce from '@/components/Tinymce';

export default {
  name:'',
  components: { Tinymce },
  data(){
    return{
      listLoading: true,
      ruleForm: {
        topTitle: '',
        tarningCamp: '',
        knowledge: '',
        onlineShop: '',
        onlineShop2: ''
      },
      rules: {
        topTitle: [
          { required: true, message: '头部区域内容不能为空，请检查！', trigger: 'blur' },
        ],
        tarningCamp: [
          { required: true, message: '训练营新客内容不能为空，请检查！', trigger: 'blur' },
        ],
        knowledge: [
          { required: true, message: '知识付费新客内容不能为空，请检查！', trigger: 'blur' },
        ],
        onlineShop: [
          { required: true, message: '电商新客内容不能为空，请检查！', trigger: 'blur' },
        ],
        onlineShop2: [
          { required: true, message: '老用户提示内容不能为空，请检查！', trigger: 'blur' }
        ]
      }
    }
  },
  created(){
    this.NewUserConfigDetails();
  },
  methods:{
    //获取表单详情
    NewUserConfigDetails(){
      NewUserConfigDetails().then(res => {
        if (res.code == 200) {
          res.result.forEach(v=>{
            if(v.category == 1){
              this.ruleForm.topTitle = v.details;
            }else if(v.category == 2){
              this.ruleForm.tarningCamp = v.details;
            }else if(v.category == 3){
              this.ruleForm.knowledge = v.details;
            }else if(v.category == 4){
              this.ruleForm.onlineShop = v.details;
            }else if(v.category == 5){
              this.ruleForm.onlineShop2 = v.details;
            }
          })
        }
      });
    },
    //新建/编辑-提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let configdata = [
            {
              "category": 1,
              "details": this.ruleForm.topTitle
            },
            {
              "category": 2,
              "details": this.ruleForm.tarningCamp
            },
            {
              "category": 3,
              "details": this.ruleForm.knowledge
            },
            {
              "category": 4,
              "details": this.ruleForm.onlineShop
            },
            {
              "category": 5,
              "details": this.ruleForm.onlineShop2
            }
          ];
          NewUserConfigUpdate({configdata:configdata}).then(res => {
            if (res.code == 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
            }
          });
        } else {
          console.log('error submit!!');
          this.$message({
            message: '必填项内容不能为空，请检查！',
            type: 'warning'
          });
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss">
.newCustomers_container{
  padding: 20px;
  .title-header{
    margin-top: -20px;
  }
}
</style>