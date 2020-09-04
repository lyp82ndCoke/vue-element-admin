<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-col :span="4">
          <el-button size="small" type="primary" @click="showAlert()">编辑负责人</el-button>
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
        <el-table-column label="序号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="年龄段" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="前台展示" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" v-if="scope.row.is_show == 1" @click="goContent(scope.row.label_id, scope.row.is_show)">显示</el-button>
            <el-button size="mini" type="text" v-else-if="scope.row.is_show" @click="goContent(scope.row.label_id, scope.row.is_show)">隐藏</el-button>
          </template>
        </el-table-column>-->
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="主题数量" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              v-if="scope.row.theme_num>0"
              @click="subjectNum(scope.row.label_id)"
              type="text"
            >{{ scope.row.theme_num }}</el-button>
            <el-button size="small" v-else type="text" style="color:#ddd;">{{ scope.row.theme_num }}</el-button>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="负责人" align="center">
          <template slot-scope="scope">{{scope.row.real_name}}</template>
        </el-table-column>
      </el-table>
      <pagination
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="listQueryAge.page_num"
        :limit.sync="listQueryAge.page_size"
        v-on:pagination="changePaging"
      />
    </el-col>

    <!-- 编辑负责人 alert -->
    <div :span="24" v-if="alertShow" class="alert-wrap" id="alert-age" @click.self="hiddenAge">
      <el-col :span="24" class="alert-content-wrap" id="content-age">
        <el-col :span="24" class="add_age">关联负责人</el-col>
        <el-form ref="formRule" :rules="rules" :model="form" class="form-wrap">
          <el-form-item label="请选择负责人名称" prop="teaching_uuid">
            <el-col :span="10">
              <el-select
                v-model="form.teaching_uuid"
                clearable
                placeholder="请选择负责人"
                @change="handleCheckAge"
              >
                <el-option
                  v-for="item in options"
                  :key="item.union_uuid"
                  :label="item.real_name"
                  :value="item.user_uuid"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="选择年龄" required>
            <el-checkbox-group v-model="form.age_id">
              <el-checkbox
                v-for="(item,index) in ageDetail"
                :key="index"
                :label="item.label_id"
                :disabled="item.user_uuid != null && item.user_uuid != form.teaching_uuid"
              >{{item.title}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label style="margin-top: 80px;">
            <el-col :span="1" align="right">
              <el-button type="primary" @click="saveAge('formRule')">保存</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-col>
    </div>

    <!-- 主题数量 alert -->
    <div :span="24" v-if="alertSubject" class="alert-wrap" @click.self="hiddenAlert">
      <el-col :span="24" class="alert-content-wrap">
        <el-table :data="tableData" size="small">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table :data="scope.row.child" :show-header="false" size="mini">
                <el-table-column width="180">
                  <template slot-scope="{row, $index}">
                    <el-input
                      v-if="row.two_flag"
                      v-model="row.sort"
                      autofocus="row.two_flag"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
                      @keyup.enter.native="twoSubmit($index, row)"
                      v-on:blur="changeTwo"
                      v-on:change="twoInput(row.sort, row.age_label_id, row.first_label_id, row.second_label_id, row.level,  $index)"
                      maxlength="6"
                    ></el-input>
                    <el-button
                      v-else
                      size="small"
                      @click="handleTwo($index, row)"
                      type="text"
                    >{{ row.sort }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column width="170">
                  <template slot-scope="scope">{{scope.row.second_theme_name}}</template>
                </el-table-column>
                <el-table-column width="170">
                  <template slot-scope="scope">{{scope.row.create_time}}</template>
                </el-table-column>
                <el-table-column width="170">
                  <template slot-scope="scope">
                    <span>{{ scope.row.is_show == 1 ? '显示' : '隐藏'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="主题级别">
                  <template slot-scope="scope">
                    <span v-if="scope.row.level == 1">一级主题</span>
                    <span v-else-if="scope.row.level == 2">二级主题</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  width="148"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.is_show == 1"
                      size="small"
                      @click="handleTwoShow(scope.row.age_label_id, scope.row.first_label_id, scope.row.second_label_id, scope.row.level, scope.row.is_show, scope.row.four_msg)"
                      type="text"
                      style="margin-left:20px;"
                    >隐藏</el-button>

                    <el-button
                      v-else-if="scope.row.is_show == 2"
                      size="small"
                      @click="handleTwoShow(scope.row.age_label_id, scope.row.first_label_id, scope.row.second_label_id, scope.row.level, scope.row.is_show, scope.row.four_msg)"
                      type="text"
                      style="margin-left:20px;"
                    >显示</el-button>

                    <el-button
                      size="small"
                      type="text"
                      @click="removeTwoGoods(scope.row.age_label_id,scope.row.first_label_id, scope.row.second_label_id,scope.row.level)"
                    >移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="排序">
            <template slot-scope="{row, $index}">
              <el-input
                v-if="row.one_flag"
                v-model="row.sort"
                autofocus="row.one_flag"
                onkeyup="value=value.replace(/[^\d]/g,'')"
                @keyup.enter.native="sortSubmit($index, row)"
                v-on:blur="changeFlag"
                v-on:change="inputSort(row.sort, row.first_label_id, row.age_label_id, row.level, $index)"
                maxlength="6"
              ></el-input>
              <el-button
                v-else
                size="small"
                @click="handleSort($index, row)"
                type="text"
              >{{ row.sort }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="主题名称">
            <template slot-scope="scope">
              <span>{{ scope.row.first_theme_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="前台展示状态">
            <template slot-scope="scope">
              <span>{{ scope.row.is_show == 1 ? '显示' : '隐藏'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="主题级别">
            <template slot-scope="scope">
              <span v-if="scope.row.level == 1">一级主题</span>
              <span v-else-if="scope.row.level == 2">二级主题</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.is_show == 1"
                size="small"
                @click="handleShow(scope.row.age_label_id, scope.row.first_label_id, scope.row.level, scope.row.is_show)"
                type="text"
              >隐藏</el-button>
              <el-button
                v-else-if="scope.row.is_show == 2"
                size="small"
                @click="handleShow(scope.row.age_label_id, scope.row.first_label_id, scope.row.level, scope.row.is_show)"
                type="text"
              >显示</el-button>

              <el-button
                size="small"
                type="text"
                @click="removeFirstGoods(scope.row.age_label_id, scope.row.first_label_id,scope.row.level)"
              >移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          class="pagination"
          v-show="alertTotal>0"
          :total="alertTotal"
          :page.sync="listQuery.page_num"
          :limit.sync="listQuery.page_size"
          v-on:pagination="changeAlert"
        />
        <!-- <el-col :span="16" align="left" class="sure-margin">
            <el-button type="info" @click="hiddenAlert">取消</el-button>
        </el-col>-->
      </el-col>
    </div>
  </div>
</template>

<script>
import { getAgeGroup, addAgeGroup, showAgeGroup, editAgeGroup, deleteAgeGroup, alertShowAgeGroup, singelDelAgeGroup, alertAgeList, muchDelAgeGroup, nameUpdate, editSubmitAgeGroup, updateThemeSort, personCharge, getResponsibleAge } from '@/api/teach'
import { getSchedulingGroup } from '@/api/articleLibrary'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Pagination, Sticky, Tinymce },
  data() {
    return {
      ageDetail: [],//年龄列表
      alertTotal: 0,
      options: [],
      checkList: ['5', '2'],
      editLabelId: null,
      // addAge: null,//区分添加 编辑
      showEdit: [], //显示编辑框
      height: null,
      loading: false,
      userList: [
        { "union_uuid": "1", "real_name": "郭" },
        { "union_uuid": "2", "real_name": "小" },
        { "union_uuid": "3", "real_name": "薇" }
      ],
      list: [], // 年龄段列表数据
      tableList: [], //主题数量数据
      listLoading: false,
      total: 0,
      listQuery: {
        page_num: 1,
        page_size: 10,
      },
      listQueryAge: {
        page_num: 1,
        page_size: 20,
      },
      alertShow: false,
      alertSubject: false,
      //添加年龄
      form: {
        teaching_uuid: null,  //教研组用户id
        age_id: [], //  年龄ID(数组)
      },
      editable: [],
      multipleSelection: [],//批量移除的id
      age_label_id: null,//年龄段id
      rules: {
        teaching_uuid: [
          { required: true, message: '请选择负责人', trigger: 'blur' },
        ],
        // age_id: [
        //   { required: true, message: '请选择选择龄段负责人', trigger: 'change' },
        // ]
      },
      tableData: []
    }
  },
  created() {
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
      let tableD = this.tableData;
      tableD.forEach(function (item) {
        item.one_flag = false;
      });
      tableD[index].one_flag = true
    },
    sortSubmit(index, row) {
      let tableD = this.tableData;
      this.tableData[index].one_flag = false;
      tableD.forEach(function (item) {
        item.one_flag = false;
      });
    },
    changeFlag() {
      let tableD = this.tableData;
      tableD.forEach(function (item) {
        item.one_flag = false;
      });
    },
    inputSort(sort, first_label_id, age_label_id, level, index) {
      let tableD = this.tableData;
      tableD.forEach(function (item) {
        item.one_flag = false;
      });
      const map = {
        sort,
        first_label_id,
        age_label_id,
        level
      }
      if (!map.sort) {
        this.$message({
          message: '排序不能为空哦',
          type: 'warning'
        });
        this.subjectNum(this.age_label_id);
        tableD[index].one_flag = true;
        return false;
      }
      // 一级主题排序修改
      updateThemeSort(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        }
      })
    },
    //二级主题排序修改
    changeTwo() {
      let tableD = this.tableData;
      for (var i = 0; i < tableD.length; i++) {
        for (var j = 0; j < tableD[i].child.length; j++) {
          tableD[i].child[j].two_flag = false;
        }
      }
    },
    handleTwo(index, row) {
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
    twoInput(sort, age_label_id, first_label_id, second_label_id, level, index) {
      let tableD = this.tableData;
      for (var i = 0; i < tableD.length; i++) {
        for (var j = 0; j < tableD[i].child.length; j++) {
          tableD[i].child[j].two_flag = false;
        }
      }
      const map = {
        sort,
        age_label_id,
        first_label_id,
        second_label_id,
        level
      }
      if (map.sort == '') {
        this.$message({
          message: '排序不能为空哦',
          type: 'warning'
        });
        this.subjectNum(this.age_label_id);
        tableD[index].two_flag = true;
        return false;
      }
      //修改二级主题排序
      updateThemeSort(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        }
      })
    },
    // 年龄段 二级主题的显示隐藏
    handleTwoShow(age_label_id, first_label_id, second_label_id, level, is_show, four_msg) {
      const tips = is_show == 1 ? '隐藏' : '显示';
      this.$confirm('确认要' + tips + '该主题吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (is_show != 1 && four_msg == 2) {
          // 显示的时候 - 四大类为空
          this.goRelation();
        } else {
          this.alertShowAgeGroupTwo(age_label_id, first_label_id, second_label_id, level, is_show);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消除' + tips
        });
      });
    },
    alertShowAgeGroupTwo(age_label_id, first_label_id, second_label_id, level, is_show) {
      const map = {
        age_label_id,
        first_label_id,
        second_label_id,
        level,
        is_show
      }
      alertShowAgeGroup(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg
          });
          this.subjectNum(this.age_label_id);
        }
      })
    },
    goRelation() {
      this.$confirm('填写完二级主题辅导锦囊才可以显示哦！确认去填写吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //跳转到关系管理列表填写四大类
        this.$router.push({ path: '/tutor/relatMang/index' })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消去填写'
        });
      });
    },
    // 年龄段 一级主题的显示 隐藏
    handleShow(age_label_id, first_label_id, level, is_show) {
      const tips = is_show == 1 ? '隐藏' : '显示';
      this.$confirm('确认要' + tips + '该主题吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.alertShowAgeGroup(age_label_id, first_label_id, level, is_show, tips);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消除' + tips
        });
      });
    },
    alertShowAgeGroup(age_label_id, first_label_id, level, is_show, tips) {
      const map = {
        age_label_id,
        first_label_id,
        level,
        is_show
      }
      alertShowAgeGroup(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: tips + '成功!'
          });
          this.subjectNum(this.age_label_id);
        }
      })
    },
    // 年龄段列表
    ageList(map) {
      this.listLoading = true;
      getAgeGroup(this.listQueryAge).then((res) => {
        if (res.code == 200) {
          this.listLoading = false;
          this.list = res.result.list;
          this.ageDetail = res.result.list;
          this.total = res.result.count;
        }
      })
    },
    // 年龄段分页
    changePaging(val) {
      const map = {
        page_num: val.page,
        page_size: val.limit
      }
      this.ageList(map);
    },
    // 编辑负责人提交
    saveAge(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          const map = {
            ...this.form
          }
          personCharge(map).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.alertShow = false;
              const map = {
                page_num: 1,
                page_size: 10
              }
              this.ageList(map);
            }
          })
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
      this.form.age_id = [];
      this.form.teaching_uuid = null;
      this.alertShow = false;
    },
    // 添加年龄弹框
    showAlert() {
      this.alertShow = true;
      this.form.teaching_uuid = null;
      // this.addAge = 1; //代表添加年龄
      const map = {
        status: 1,
        page_size: 1000
      }
      getSchedulingGroup(map).then((res) => {
        if (res.code == 200) {
          this.options = res.result.list;
        }
      })
    },

    // 主题数量弹框
    subjectNum(label_id) {
      this.alertSubject = true;
      this.age_label_id = label_id;
      const map = {
        label_id: label_id,
        page_num: 1,
        page_size: 10
      }
      alertAgeList(map).then((res) => {
        if (res.code == 200) {
          this.tableData = res.result.list;
          this.alertTotal = res.result.count;
        }
      })
    },
    hiddenAlert() {
      this.alertSubject = false;
    },
    // 年龄段列表的显示隐藏
    // goContent(id,show) {
    //   const tips = show == 1 ? '显示' : '隐藏';
    //   this.$confirm('确定要'+tips+'该年龄吗', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     const map = {
    //       label_id: id,
    //       is_show: show
    //     }
    //     showAgeGroup(map).then((res) => {
    //       if(res.code == 200){
    //         this.$message({
    //           type: 'success',
    //           message: tips + '成功!'
    //         });
    //         this.ageList();
    //       }
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消' + tips
    //     });          
    //   });
    // },
    //移除主题数量 - 一级
    removeFirstGoods(age_label_id, first_label_id, level) {
      this.$confirm('确认要移除该一级主题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const map = {
          age_label_id,
          first_label_id,
          level
        }
        singelDelAgeGroup(map).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: res.msg
            });
            this.subjectNum(this.age_label_id);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 移除主题数量 - 二级
    removeTwoGoods(age_label_id, first_label_id, second_label_id, level) {
      this.$confirm('确认要移除该二级主题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const map = {
          age_label_id,
          first_label_id,
          second_label_id,
          level
        }
        singelDelAgeGroup(map).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: res.msg
            });
            this.subjectNum(this.age_label_id);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 该负责人 已负责的年龄 选中 其他人负责的年龄置灰
    handleCheckAge(value) {
      // console.log(value, '判断')
      const map = {
        teaching_uuid: value
      }
      if (map.teaching_uuid) {
        getResponsibleAge(map).then((res) => {
          if (res.code == 200) {
            //自己负责的年龄选中
            this.form.age_id = res.result.teaching_uuid;
            const otherCheck = res.result.other_teaching;
            const ageDetail = this.ageDetail;
          }
        })
      }
    },
    changeAlert(val) {
      const map = {
        page_num: val.page,
        page_size: val.limit,
        label_id: this.age_label_id
      }
      alertAgeList(map).then((res) => {
        if (res.code == 200) {
          this.tableData = res.result.list;
          this.alertTotal = res.result.count;
        }
      })
    }
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
    overflow-y: auto;
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
#content-age .add_age {
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 20px;
}
</style>

