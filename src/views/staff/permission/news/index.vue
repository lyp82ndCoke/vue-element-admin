<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col
        :span="10"
        class="subtitle"
      >新建角色</el-col>
    </sticky>
    <el-col
      :span="24"
      class="content-wrap"
    >
      <el-form
        ref="form"
        :model="role"
        label-width="120px"
      >
        <el-form-item label="角色名称:">
          <el-input v-model="form.group_title" />
        </el-form-item>
        <el-form-item label="权限:">
          <el-tree
            ref="tree"
            :data="permissionData"
            show-checkbox
            node-key="rule_name"
            default-expand-all
            :default-checked-keys="role.permission"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >确定</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>

import Sticky from '@/components/Sticky'
import { getGroup, getMenuList, addRole, updateRole } from '@/api/rule'

export default {
  name: 'newStaff',
  components: { Sticky },
  data() {
    return {
      role: {
        name: '',
        permission: []
      },
      defaultProps: {
        children: 'child',
        label: 'rule_title'
      },
      havePermission: [],
      permissionData: [],
      form: {
        id: '',
        group_title: "",
        status: null,
        rule_name: [],
        create_time: ""
      }
    }
  },
  created() {
    this.getMenuTree();
    // console.log(this.$route)
    if (this.$route.params.id != 0) {
      this.form.id = this.$route.params.id;
      this.getGroup()
    }
  },
  methods: {
    // 获取菜单树形结构
    getMenuTree() {
      getMenuList().then(response => {
        if (response.code == 200) {
          this.permissionData = response.result;

        }
      })
    },
    // 获取角色详情
    getGroup() {
      let group_id = this.form.id;
      getGroup({ group_id }).then(response => {
        if (response.code == 200) {
          this.form = response.result;
          const permission = response.result.rule_name;
          permission.forEach(el => {
            this.setNodes(el)
          });
        }
      })
    },
    // 设置显示权限
    setNodes(key) {
      this.$refs.tree.setChecked(key, true)
    },
    // 提交
    onSubmit() {
      const getCheckedKeys = this.$refs.tree.getCheckedKeys();
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();

      const rule_name = [...getCheckedKeys, ...halfCheckedKeys]
      // console.log(rule_name, halfCheckedKeys)
      if (this.form.group_title && rule_name.length) {
        const data = {
          group_id: this.form.id,
          rule_name,
          group_title: this.form.group_title
        }
        if (this.form.id) {
          this.updateRole(data);
        } else {
          this.addRole(data);
        }
      } else {
        this.$message('信息不全,请补全!')
      }
    },
    // 更新角色信息
    updateRole(data) {
      updateRole(data).then(response => {
        if (response.code == 200) {
          this.$alert('用户信息更新成功!', '提示', {
            confirmButtonText: '确定',
            type: 'success',
            center: true
          }).then(() => {
            this.$router.go(-1)
          })
        }
      })
      this.$message('修改')
    },
    // 创建角色信息
    addRole(data) {
      addRole(data).then(response => {
        if (response.code == 200) {
          this.$confirm('创建角色成功!', '提示', {
            confirmButtonText: '继续创建',
            cancelButtonText: '返回',
            type: 'success',
            center: true
          }).then(() => {
            this.$refs.tree.setCheckedKeys([])
          }).catch(() => {
            this.$router.go(-1)
          })
        }
      })
      this.$message('新增')
    },
    // 上传头像
    handleAvatarSuccess() { },
    beforeAvatarUpload() { },
    onCancel() {
      this.$confirm('取消后不会保留已输入信息,确认取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.go(-1)
      }).catch(() => {
      });
    },
    // 节点选择
    getCheckedNodes(data, checked, indeterminate) {

      // console.log(this.$refs.tree);
    },
    handleNodeClick(data) {
      // console.log(data);
    },


  }
}
</script>

<style scoped>
.line {
  text-align: center;
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

