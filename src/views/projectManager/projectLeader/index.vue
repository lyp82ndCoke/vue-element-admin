<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-col :span="4">
          <el-button size="small" type="primary" @click="showAlert()">关联负责人</el-button>
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
        <el-table-column label="训练营" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.goods_name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="关联时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
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
        v-on:pagination="getRelationGoodsList"
      />
    </el-col>

    <!-- 关联负责人 alert -->
    <div :span="24" v-if="alertShow" class="alert-wrap" id="alert-age" @click.self="hiddenAge">
      <el-col :span="24" class="alert-content-wrap" id="content-age">
        <el-col :span="24" class="add_age">关联负责人</el-col>
        <el-form ref="formRule" :rules="rules" :model="form" class="form-wrap">
          <el-form-item label="请选择负责人名称" prop="teaching_uuid">
            <el-col :span="10">
              <el-select
                v-model="form.teaching_uuid"
                clearable
                size="small"
                placeholder="请选择"
                @change="handleCheckAge"
              >
                <el-option
                  v-for="item in options"
                  :key="item.user_uuid"
                  :label="item.name_mobile"
                  :value="item.user_uuid"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="选择训练营" required>
            <el-checkbox-group v-model="form.age_id">
              <el-checkbox
                v-for="(item,index) in ageDetail"
                :key="index"
                :label='`{"goods_id":"${item.goods_id}","goods_name":"${item.goods_name}"}`'
                :disabled="item.flag == true"
              >{{item.goods_name}}</el-checkbox>
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

  </div>
</template>

<script>  
import { personCharge, getResponsibleAge } from '@/api/teach'
import { 
  getManagerList, 
  getRelationGoodsList, 
  getCampList,
  getResponsibleGoods,
  getResponsibleEdit
} from '@/api/project'
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
      showEdit: [], //显示编辑框
      height: null,
      loading: false,
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
        page_size: 10,
      },
      alertShow: false,
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
          { required: true, message: '请填写年龄段', trigger: 'blur' },
        ]
      },
    }
  },
  created() {
    this.getRelationGoodsList();
    this.getCampList();
  },
  methods: {
    //获取所有的训练营
    getCampList(){
      getCampList().then(res => {
        if(res.code == 200){
          // console.log(res, 'res')
          this.ageDetail = res.result;
        }
      })
    },
    // 项目经理关联训练营列表
    getRelationGoodsList() {
      this.listLoading = true;
      getRelationGoodsList(this.listQueryAge).then((res) => {
        if (res.code == 200) {
          this.listLoading = false;
          this.list = res.result.list;
          this.total = res.result.sign.count;
        }
      })
    },
    // 编辑负责人提交
    saveAge(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          // console.log(this.form,'this.form')
          // const map = {
          //   ...this.form
          // }
          const check = [];
          const camp = this.form.age_id;
          camp.forEach(item => {
            check.push(JSON.parse(item))
          })
          const data = {
            goods_info: check,
            project_manager_uuid: this.form.teaching_uuid
          }
          getResponsibleEdit(data).then(res => {
            if(res.code == 200){
              this.alertShow = false;
              this.$message({
                type: 'success',
                message: '关联成功'
              });
              this.getRelationGoodsList();
              // res.result.goods_id.forEach(item => {
              //   console.log(JOSN.stringify(item));
              // })
            }
          })
          // personCharge(map).then((res) => {
          //   if (res.code == 200) {
          //     this.$message({
          //       type: 'success',
          //       message: res.msg
          //     });
          //     this.alertShow = false;
              
          //   }
          // })
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
      this.ageDetail.forEach(item => {
        item.flag = false;
      })
    },
    // 添加年龄弹框
    showAlert() {
      this.alertShow = true;
      this.form.age_id = [];
      this.ageDetail.forEach(item => {
        item.flag = false;
      })

      // this.ageDetail.forEach((detail, idx) => {
      //   this.ageDetail[idx].flag = true;
      //   this.ageDetail.splice(1,0);
      // })

      this.form.teaching_uuid = null;
      const map = {
        status: 1
      }
      getManagerList(map).then((res) => {
        if (res.code == 200) {
          this.options = res.result.list;
        }
      })

    },
    // 该负责人 已负责的训练营 选中 其他人负责的训练营置灰
    handleCheckAge(value) {
      this.form.age_id.length = 0;
      // console.log(value, '判断')
      const map = {
        project_manager_uuid: value
      }
      if (map.project_manager_uuid) {
        getResponsibleGoods(map).then(res => {
          if(res.code == 200){
            const goods_id = res.result.goods_id;
            goods_id.forEach(item => {
              this.form.age_id.push(JSON.stringify(item))
            })
            this.form.age_id.splice(1,0);
            this.ageDetail.forEach((detail, idx) => {
              detail.flag = false;
            })
            const other_goods_id = res.result.other_goods_id?res.result.other_goods_id:[];
            other_goods_id.forEach(item => {
              this.ageDetail.forEach((detail, idx) => {
                if(item.goods_id == detail.goods_id){
                  detail.flag = true;
                }
              })
            })
          }
        })
        // getResponsibleAge(map).then((res) => {
        //   if (res.code == 200) {
        //     //自己负责的年龄选中
        //     this.form.age_id = res.result.teaching_uuid;
        //     const otherCheck = res.result.other_teaching;
        //     const ageDetail = this.ageDetail;
        //   }
        // })
      }
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

