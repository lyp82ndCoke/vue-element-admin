<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col
        :span="10"
        class="subtitle"
      >辅导员列表</el-col>
    </sticky>
    <el-col
      :span="24"
      class="table-wrap"
    >
      <el-col
        :span="24"
        class="title-header"
      >
        <el-col
          :span="4"
          v-if="!screen"
        >
          <el-button
            size="small"
            type="primary"
            @click="showScreen"
          >展开筛选</el-button>
        </el-col>
        <el-form
          v-if="screen"
          :inline="true"
          ref="form"
          :model="form"
          class="form-wrap selete-form"
          label-width="155px"
        >
          <el-form-item
            label="一级岗位："
            class="item-gender"
            width="155"
          >
            <el-select
              v-model="form.first_station"
              clearable
              filterable
              size="small"
              placeholder="请选择一级岗位"
              @change="handleWording"
            >
              <el-option
                v-for="item in first_station"
                :key="item.first_stationue"
                :label="item.name"
                :value="item.first_station"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="二级岗位："
            class="item-gender"
            width="155"
          >
            <el-select
              v-model="form.second_station"
              clearable
              filterable
              size="small"
              placeholder="请选择二级岗位"
              @change="handleWordingSecond"
            >
              <el-option
                v-for="item in second_station"
                :key="item.second_station"
                :label="item.name"
                :value="item.second_station"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="真实姓名："
            class="item-gender"
            width="155"
          >
            <el-input
              v-model="form.real_name"
              size="small"
              placeholder="请输入真实姓名"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="微信昵称："
            class="item-gender"
            width="155"
          >
            <el-input
              v-model="form.nickname"
              size="small"
              placeholder="请输入微信昵称"
            ></el-input>
          </el-form-item>




          <el-form-item
            label="您目前的工作状态？"
            class="item-gender"
            width="155"
          >
            <el-select
              size="small"
              clearable
              v-model="form.work_status"
              filterable
              placeholder="请选择工作状态"
              @change="handleWordingSecond"
            >
              <el-option
                v-for="item in working"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="您目前从事的职业："
            class="item-gender"
            width="155"
          >
            <el-input
              v-model="form.now_work_vocation"
              size="small"
              placeholder="请输入职业"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="最高学历："
            class="item-gender"
            width="155"
          >
            <el-select
              size="small"
              clearable
              v-model="form.education"
              filterable
              placeholder="请选择学历"
              @change="handleWordingSecond"
            >
              <el-option
                v-for="item in education"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="专业："
            class="item-gender"
            width="155"
          >
            <el-input
              v-model="form.major"
              size="small"
              placeholder="请输入专业"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="签约时间："
            class="item-gender"
            width="200"
          >
            <!-- <el-date-picker
              v-model="form.contract_time"
              type="date"
              placeholder="选择签约时间">
            </el-date-picker>-->
            <el-date-picker
              v-model="form.contract_time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="转正时间："
            class="item-gender"
            width="200"
          >
            <!-- <el-date-picker
              v-model="form.correction_time"
              type="date"
              placeholder="选择转正时间">
            </el-date-picker>-->
            <el-date-picker
              v-model="form.correction_time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              size="small"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="解约时间："
            class="item-gender"
            width="200"
          >
            <!-- <el-date-picker
              v-model="form.cancellation_time"
              type="date"
              placeholder="选择解约时间">
            </el-date-picker>-->
            <el-date-picker
              v-model="form.cancellation_time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              size="small"
            ></el-date-picker>
          </el-form-item>

          <el-form-item
            label="状态："
            class="item-gender"
            width="155"
          >
            <el-select
              v-model="form.status"
              clearable
              filterable
              size="small"
              placeholder="请选择状态"
              @change="handleWordingSecond"
            >
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          
          
          <el-form-item
            label="地区："
            class="item-gender"
            width="155"
          >
            <el-cascader
              clearable
              :options="region"
              v-model="form.address_ids"
              :props="props"
              placeholder="请选择地区"
              size="small"
            ></el-cascader>
          </el-form-item>

          <el-form-item
            label="年龄段："
            class="item-gender"
            width="155"
          >
            <el-select
              v-model="form.label_ids"
              clearable
              filterable
              size="small"
              placeholder="请选择年龄"
              @change="handleWordingSecond"
            >
              <el-option
                v-for="item in ageList"
                :key="item.label_id"
                :label="item.title"
                :value="item.label_id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="手机号："
            class="item-gender"
            width="155"
          >
            <el-input
              v-model="form.mobile"
              size="small"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>

          <el-form-item class="item-gender">
            <el-button
              type="primary"
              @click="hideScreen"
              size="small"
            >收起</el-button>
            <el-button
              type="success"
              @click="searchInstr"
              size="small"
            >搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col
        :span="24"
        style="margin-bottom: 10px;"
      >
        <el-button
          size="small"
          type="danger"
          @click="addInstructor(0)"
        >添加辅导员</el-button>
      </el-col>

      <el-table
        :height="height"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size="mini"
        highlight-current-row
        align="middle"
      >
        <el-table-column label="一级岗位">
          <template slot-scope="scope">
            {{ scope.row.first_station }}
          </template>
        </el-table-column>
        <el-table-column label="二级岗位">
          <template slot-scope="scope">
            {{ scope.row.second_station }}
          </template>
        </el-table-column>
        <el-table-column
          label="真实姓名"
          width="120"
        >
          <!-- <template slot-scope="scope">{{ scope.row.real_name }}</template> -->
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              @click="editRetreat(scope.row.user_uuid)"
            >{{ scope.row.real_name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="微信昵称">
          <template slot-scope="scope">{{ scope.row.nickname }}</template>
        </el-table-column>
        <el-table-column
          label="你目前的工作状态？"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.work_status == 1">有工作全职</span>
            <span v-else-if="scope.row.work_status == 2">无工作全职妈妈</span>
            <span v-else-if="scope.row.work_status == 3">有工作兼职</span>
            <span v-else-if="scope.row.work_status == 4">自己成立亲子阅读馆</span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="status-col"
          label="手机号"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.mobile }}</template>
        </el-table-column>
        <el-table-column label="大宝年龄">
          <template slot-scope="scope">{{ scope.row.big_baby_age }}</template>
        </el-table-column>
        <el-table-column label="二宝年龄">
          <template slot-scope="scope">{{ scope.row.small_baby_age }}</template>
        </el-table-column>
        <el-table-column
          class-name="status-col"
          label="状态"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.status == 1"
              style="color:red;"
            >正常</span>
            <span
              v-else-if="scope.row.status == 2"
              style="color:#ddd;"
            >清退</span>
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
              size="small"
              type="text"
              v-if="scope.row.status == 1"
              @click="removeRetreat(scope.row.user_uuid)"
            >清退</el-button>
            <el-button
              size="small"
              type="text"
              v-else-if="scope.row.status == 2"
              @click="userOn(scope.row.user_uuid)"
            >启用</el-button>

            <el-button
              size="small"
              type="text"
              @click="editRetreat(scope.row.user_uuid)"
            >编辑</el-button>
            <!--  <el-button size="small" type="text" @click="delRetreat(scope.row.counsellor_id)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <pagination
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="form.page_num"
        :limit.sync="form.page_size"
        v-on:pagination="getList"
      />
    </el-col>
  </div>
</template>

<script>
import data from '@/assets/province.json'
import { getCounsellorList, removeCounsellorList, delCounsellorList, getStation, userOnCounsellor } from '@/api/articleLibrary'
import { getAgeGroup } from '@/api/teach'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      height: null,
      optionsValue: null,
      listLoading: false,
      searchText: '',
      list: [], // 辅导员列表
      total: 0,
      goodsListId: null,
      form: {
        page_num: 1,
        page_size: 10,
        work_status: "",
        now_work_vocation: "",
        education: "",
        major: "",
        contract_time: [],
        correction_time: [],
        cancellation_time: [],
        status: "",
        first_station: "",
        second_station: "",
        address_ids: [],
        mobile: "",
        label_ids:""
      },
      working: [
        { label: '有工作,全职', value: 1 },
        { label: '有工作,兼职', value: 3 },
        { label: '无工作,全职妈妈', value: 2 },
        { label: '自己成立亲子阅读馆', value: 4 },
      ],
      education: [
        { label: '高中', value: 1 },
        { label: '大专', value: 2 },
        { label: '本科', value: 3 },
        { label: '研究生', value: 4 },
        { label: '博士', value: 5 },
      ],
      status: [
        { label: '正常', value: 1 },
        { label: '清退', value: 2 }
      ],
      first_station: [],
      second_station: [],
      region: [],
      screen: true,//筛选条件
      props: {
        value: 'area_id',
        label: 'area_name'
      },
      ageList: []
    }
  },
  created() {
    // console.log(this.$route.params, '此活动的id')
    this.goodsListId = this.$route.params.id;
    this.getList();
    // console.log(data, '地址')
    this.region = data.data;
    this.getStation();
    this.getAgeGroup();
  },
  methods: {
    //获取年龄段列表
    getAgeGroup(){
      const data = {
        page_num: 1,
        page_size: 20
      }
      getAgeGroup(data).then(res => {
        if(res.code == 200){
          this.ageList = res.result.list;
        }
      })
    },
    //获取岗位
    getStation() {
      getStation().then((res) => {
        if (res.code == 200) {
          // console.log(res, '岗位')
          this.first_station = res.result.list;
        }
      })
    },
    //根据一级岗位 筛选二级岗位
    handleFirst(value) {
      this.form.second_station = '';
      const map = {
        first_station: value
      }
      getStation(map).then((res) => {
        if (res.code == 200) {
          this.second_station = res.result.list;
        }
      })
    },
    handleCahnge(value) {
      // console.log(this.form.contract_time, 'value')
    },
    // 辅导员列表
    getList() {
      const map = this.form;
      getCounsellorList(map).then((res) => {
        if (res.code == 200) {
          this.list = res.result.list;
          this.total = res.result.sign.count;
        }
      })
    },
    // 添加辅导员
    addInstructor(id) {
      this.$router.push({ path: `./add/${id}` })
    },
    // 搜索辅导员
    searchInstr() {
      this.form.page_num = 1;
      this.getList();
    },
    // 清退辅导员
    removeRetreat(id) {
      this.$confirm('确认要清退该辅导员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const map = {
          uuid: id,
          role_type: 1
        }
        removeCounsellorList(map).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '清退成功!'
            });
            this.getList();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清退'
        });
      });
    },
    // 删除辅导员
    // delRetreat(id){
    //   this.$confirm('确认要删除该辅导员吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     const map = {
    //       counsellor_id: id
    //     }
    //     delCounsellorList(map).then((res) => {
    //       if(res.code == 200){
    //         this.$message({
    //           type: 'success',
    //           message: '删除成功!'
    //         });
    //       }
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     });          
    //   });
    // },
    // 编辑辅导员
    editRetreat(id) {
      this.$router.push({ path: `./add/${id}` })
    },
    // 关闭筛选
    hideScreen() {
      this.screen = false;
    },
    // 展开筛选
    showScreen() {
      this.screen = true;
    },
    // 选择工作状态
    handleWording(value) {
      this.form.second_station = '';
      const map = {
        first_station: value
      }
      getStation(map).then((res) => {
        if (res.code == 200) {
          this.second_station = res.result.list;
        }
      })
    },
    handleWordingSecond() {
      this.form.page_num = 1;
      this.getList();
    },
    //启用辅导员
    userOn(user_uuid) {
      var that = this;
      this.$confirm('确认要启用该辅导员吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.userOnCounsellor(user_uuid);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消启用'
        });
      });
    },
    userOnCounsellor(user_uuid) {
      const map = {
        user_uuid
      }
      userOnCounsellor(map).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '启用成功'
          });
          this.getList();
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
.close-alert {
  text-align: right;
  font-size: 30px;
  color: #ccc;
}
.search-btn {
  margin-left: 20px;
}
.add-com {
  font-size: 20px;
}
.success-btn {
  text-align: right;
}
.item-gender .el-date-editor,
.item-gender .el-range-editor,
.item-gender .el-input__inner,
.item-gender .el-date-editor--daterange {
  width: 385px;
}
</style>

