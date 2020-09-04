<template>
	<div class="app-container">
		<sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">新建公众号</el-col>
    </sticky>
    
     <el-form ref="form" :model="form" class="form-wrap" label-width="140px">
      <el-form-item label="*公众号名称：">
        <el-col :span="10">
          <el-input size="small" v-model="form.name"/>
        </el-col>
      </el-form-item>
      <el-form-item label="*公众号appid：">
        <el-col :span="10">
          <el-input size="small" v-model="form.appid"/>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
   
	</div>
</template>

<script>
  import { newNoPublic, editNoPublic } from '@/api/table'
	import Sticky from '@/components/Sticky'
	export default{
		components: { Sticky },
		data() {
			return {
        form: {
          name: '',
          appid: ''
        },
        actid: null
			}
		},
    created(options){
      this.actid = this.$route.params.id;
      if(this.$route.params.id != 0){
        this.onEdit()
      }
    },
    methods: {
      //新建公众号
      onSubmit(){
        var that = this;
        if(this.form.name == ''){
          this.$message({
            message: '请输入公众号名称',
            type: 'warning'
          });
        }
        if(this.form.appid == ''){
          this.$message({
            message: '请输入公众号appid',
            type: 'warning'
          });
        }
        var map = {
          name: this.form.name,
          appid: this.form.appid
        }
        if(this.actid != 0){
          map.id = this.actid;
        }
        newNoPublic(map).then((res) => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          setTimeout(function() {
            that.$router.push({path:`/drainage/officialAccount/index`})
          }, 400)
        })
      },
      // 编辑公众号
      onEdit(){
        const map = {
          id: this.actid
        }
        editNoPublic(map).then((res) => {
          this.form.name = res.result.name;
          this.form.appid = res.result.appid;
        })
      },
      onCancel(){
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
    .input-prompt{
    	font-size: 12px;
    	color: red;
    	padding-left: 20px;
    }
	}
</style>