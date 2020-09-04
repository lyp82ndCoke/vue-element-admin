<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-col :span="4">
          <el-button size="small" type="primary" @click="showAlert()">添加负责人</el-button>
        </el-col>
      </el-col>

      <el-table
        :height="height"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size="small"
        highlight-current-row
        align="middle"
        class="table-row"
      >
        <el-table-column label="排序">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="年龄">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>

        <el-table-column class-name="status-col" label="负责人" align="center">
          <template slot-scope="scope">{{scope.row.real_name}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="showHidden(scope.row.label_id)">编辑</el-button>
            <el-button
              size="small"
              v-if="scope.row.theme_num = 0"
              type="text"
              @click="removeCom(scope.row.label_id)"
            >删除</el-button>
            <el-button size="small" v-else type="text" style="color: #ccc;">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="listQueryAge.page_num"
        :limit.sync="listQueryAge.page_size"
        v-on:pagination="ageList"
      />
    </el-col>

    <!-- 添加年龄 alert -->
    <el-col :span="24" v-if="alertShow" class="alert-wrap" id="alert-age">
      <el-col :span="24" class="alert-content-wrap" id="content-age">
        <!-- <el-col :span="24" class="add_age">添加年龄段</el-col> -->
        <el-form ref="formRule" :rules="rules" :model="form" class="form-wrap">
          <el-form-item label="请选择负责人名称" prop="label_title">
            <el-col :span="10">
              <!-- <el-input size="small" v-model="form.label_title"/> -->
              <el-select v-model="form.label_title" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="选择年龄" prop="checkList">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="复选框 A"></el-checkbox>
              <el-checkbox label="复选框 B"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label style="margin-top: 80px;">
            <el-col :span="1" align="right">
              <el-button type="primary" @click="saveAge('formRule')">保存</el-button>
            </el-col>
            <el-col :span="4" align="right">
              <el-button type="primary" @click="hiddenAge()">取消</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
  </div>
</template>

<script>
import { getAgeGroup, addAgeGroup, editAgeGroup, deleteAgeGroup, alertShowAgeGroup, singelDelAgeGroup, alertAgeList, muchDelAgeGroup, editSubmitAgeGroup, updateThemeSort } from '@/api/teach'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Pagination, Sticky, Tinymce },
  data() {
    return {
      options: [],
      checkList: [],
      editLabelId: null,
      addAge: null,//区分添加 编辑
      showEdit: [], //显示编辑框
      height: null,
      loading: false,
      userList: [
        { "union_uuid": "1", "real_name": "郭" },
        { "union_uuid": "2", "real_name": "小" },
        { "union_uuid": "3", "real_name": "薇" }
      ],
      list: [
        {
          "label_id": 9,
          "title": "5-6",
          "sort": 7,
          "is_show": 1,
          "create_time": "2019-04-26 11:20:18",
          "theme_num": 5,
          "flag": false,
          "age_flag": false,
        },
        {
          "label_id": 4,
          "title": "2-3",
          "sort": 2,
          "is_show": 2,
          "create_time": "2019-04-26 10:27:14",
          "theme_num": 2,
          "flag": false,
          "age_flag": false,
        },
        {
          "label_id": 1,
          "title": "0-1",
          "sort": 1,
          "is_show": 2,
          "create_time": "2019-04-25 18:39:40",
          "theme_num": 2,
          "flag": false,
          "age_flag": false,
        }
      ], // 年龄段列表数据
      tableList: [
        {
          "label_id": '2',
          "parent_label_id": '1',
          "sort": 2,
          "title": "生活",
          "create_time": "2019-04-26 11:28:43",
          "is_show": 1,
          "level": "2"
        },
        {
          "label_id": '2',
          "parent_label_id": '1',
          "sort": 2,
          "title": "生活",
          "create_time": "2019-04-26 11:28:43",
          "is_show": 1,
          "level": "2"
        }
      ], //主题数量数据
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      listQueryAge: {
        page_num: 1,
        page_size: 20,
      },
      //添加年龄
      form: {
        label_title: '',
        teaching_uuid: ''
      },
      editable: [],
      multipleSelection: [],//批量移除的id
      age_label_id: null,//年龄段id
      rules: {
        label_title: [
          { required: true, message: '请填写年龄段', trigger: 'blur' },
        ],
        checkList: [
          { required: true, message: '请选择选择龄段负责人', trigger: 'change' },
        ]
      },
      tableData: [
        {
          "one_themeid": 3,
          "age_label_id": 2,
          "relation_id": 2,
          "sort": 0,
          "create_time": "2019-05-06 12:38:09",
          "is_show": 1,
          "level": 1,
          "first_theme_name": "亲子关系",
          "one_flag": false,
          "child": [
            {
              "two_themeid": 4,
              "one_themeid": 3,
              "relation_id": 5,
              "sort": 0,
              "create_time": "2019-05-06 21:47:18",
              "is_show": 1,
              "level": 3,
              "second_theme_name": "阅读",
              "two_flag": false
            },
            {
              "two_themeid": 4,
              "one_themeid": 3,
              "relation_id": 6,
              "sort": 3,
              "create_time": "2019-05-06 21:47:18",
              "is_show": 2,
              "level": 2,
              "second_theme_name": "学习",
              "two_flag": false
            }
          ]
        },
        {
          "one_themeid": 5,
          "age_label_id": 2,
          "relation_id": 3,
          "sort": 0,
          "create_time": "2019-05-06 12:40:20",
          "is_show": 2,
          "level": 1,
          "first_theme_name": "生活",
          "one_flag": false,
          "child": [
            {
              "two_themeid": 4,
              "one_themeid": 5,
              "relation_id": 4,
              "sort": 0,
              "create_time": "2019-05-06 20:23:45",
              "is_show": 1,
              "level": 3,
              "second_theme_name": "阅读",
              "two_flag": false
            }
          ]
        }
      ],
      alertShow: false,
    }
  },
  created() {
    // this.goodsListId = this.$route.params.id;
    this.ageList();
  },
  methods: {
    handlePerson(value) {
      // console.log(value, '选中的年龄负责人')
    },
    remoteMethod(query) {
      //添加年龄段负责人筛选
      // console.log(query, '添加年龄段负责人筛选')
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const map = {
          }
        }, 200)
      }
    },
    // 一级主题排序的修改
    handleSort(index, row) {
      // console.log(index, '点击时 - index')
      // console.log(row, '点击时 - row')
      let tableD = this.tableData;
      tableD.forEach(function (item) {
        item.one_flag = false;
      });
      tableD[index].one_flag = true
    },
    sortSubmit(index, row) {
      // console.log(this.tableData[index].sort, '回车 - sort')
      let tableD = this.tableData;
      this.tableData[index].one_flag = false;
      tableD.forEach(function (item) {
        item.one_flag = false;
      });
    },
    inputSort(sort, label_id) {
      // console.log(sort, '失去焦点 - sort')
      // console.log(relation_id, '失去焦点 - relation_id')
      let tableD = this.tableData;
      tableD.forEach(function (item) {
        item.one_flag = false;
      });
      const map = {
        sort,
        label_id
      }
      // 一级主题排序修改
      updateThemeSort(map).then((res) => {
        if (res.code == 200) {

        }
      })
    },
    //二级主题排序修改
    handleTwo(index, row) {
      // console.log(row, 'level2 - row')
      // console.log(index, 'level2 - index');
      let tableD = this.tableData;
      for (var i = 0; i < tableD.length; i++) {
        for (var j = 0; j < tableD[i].child.length; j++) {
          tableD[i].child[j].two_flag = false;
        }
      }
      row.two_flag = true;
    },
    twoSubmit(index, row) {
      let tableD = this.tableData;
      for (var i = 0; i < tableD.length; i++) {
        for (var j = 0; j < tableD[i].child.length; j++) {
          tableD[i].child[j].two_flag = false;
        }
      }
    },
    twoInput(sort, label_id, index) {
      // console.log(sort, 'level2 - sort')
      // console.log(label_id, 'level2 - relation_id')
      let tableD = this.tableData;
      for (var i = 0; i < tableD.length; i++) {
        for (var j = 0; j < tableD[i].child.length; j++) {
          tableD[i].child[j].two_flag = false;
        }
      }
      const map = {
        sort,
        label_id
      }
      //修改二级主题排序
      updateThemeSort(map).then((res) => {
        if (res.code == 200) {

        }
      })
    },
    // 年龄段 二级主题的显示隐藏
    handleTwoShow(label_id, is_show) {
      const tips = is_show == 1 ? '隐藏' : '显示';
      this.$confirm('确认要' + tips + '该主题吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        if (is_show != 1) {
          // 需要判断二级标签问题是否为空
          this.$confirm('填写完二级问题标签介绍才可以显示哦！确认去填写吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //跳转到关系管理列表

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消去填写'
            });
          });
        }



        // const map = {
        //   label_id,
        //   is_show
        // }
        // alertShowAgeGroup(map).then((res) => {
        //   if(res.code == 200){
        //     this.$message({
        //       type: 'success',
        //       message: tips + '成功!'
        //     });
        //   }
        // })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消除' + tips
        });
      });
    },

    // 年龄段列表
    ageList() {
      this.listLoading = true;
      const map = this.listQueryAge;
      getAgeGroup(map).then((res) => {
        this.listLoading = false;
        this.list = res.result.list;
        this.total = res.result.count;
      })
    },





    // 确定添加年龄段
    saveAge(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          const map = { ...this.form };
          if (this.addAge == 1) {
            //添加年龄段
            // console.log(this.form, '添加年龄段传的参数');
            addAgeGroup(map).then((res) => {
              if (res.code == 200) {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'success'
                });
                this.form.label_title = '';
                this.form.teaching_uuid = '';
                setTimeout(function () {
                  this.alertShow = false;
                }, 500)
              }
            })
          } else if (this.addAge == 0) {
            //编辑
            map.label_id = this.editLabelId;
            editSubmitAgeGroup(map).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                });
                setTimeout(function () {
                  this.alertShow = false;
                }, 500)
              }
            })
          }
        } else {
          this.$message({
            message: '请填写必填项哦',
            type: 'warning'
          });
          return false;
        }
      });

    },
    hiddenAge() {
      this.$confirm('取消后不会保留已修改信息,确认取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.label_title = '';
        this.form.teaching_uuid = '';
        this.alertShow = false;
      }).catch(() => {
      });
    },
    // 添加年龄弹框
    showAlert() {
      this.alertShow = true;
      this.addAge = 1; //代表添加年龄
    },
    // 编辑
    showHidden(id) {
      this.alertShow = true;
      this.addAge = 0; //代表编辑年龄
      this.editLabelId = id; //编辑提交的label_id
      const map = {
        label_id: id
      }
      editAgeGroup(map).then((res) => {
        // this.form = res.result
      })
    },
    // 删除
    removeCom(id) {
      this.$confirm('此操作将永久删除该年龄段, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        const map = {
          label_id: id
        }
        deleteAgeGroup(map).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  }
}
</script>
<style lang="scss">
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
#alert-age {
  padding: 100px 150px 100px 400px;
}
#content-age {
  width: 80%;
  height: 80%;
}
.age-bottom {
  padding: 20px 0;
}
.table-margin {
  margin-bottom: 20px;
}
.sure-margin {
  margin-top: 20px;
}
.editImg {
  width: 20px;
  height: 20px;
  float: right;
}
.el-table_1_column_1 .cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-table_1_column_2 .cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-table__row td:first-child .cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-table__row td:nth-child(2) .cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-table__expanded-cell[class*="cell"] {
  padding: 20px 0px 20px 50px;
}
#content-age .add_age {
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 20px;
}
</style>

