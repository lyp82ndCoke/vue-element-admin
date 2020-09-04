<template>
  <div class="app-container">
    <el-col :span="24" class="evaluation_container">
      <el-col :span="120" class="section1">
        <h4><i></i>编辑测评基本信息</h4>
        <el-form ref="AssessInfo" :model="AssessInfo" class="form-wrap" label-width="130px">
          <el-form-item label="*选择评测试卷：" prop="sign_name">
            <el-col :span="20">
              <el-button size="small" type="primary" @click="choosePaper"> 选择试卷 </el-button>
            </el-col>
            <el-col :span="18" v-if="AssessInfo.paper_info.length">
              <span>已选择试卷:</span>
              <section v-for="(item,index) in AssessInfo.paper_info" :key="item.index">
                <el-col :span="20">
                  <p><b>{{ item.paper_name }}</b><i class="el-icon-circle-close" :class="{ hidden: item.assess_start_time ? (item.assess_start_time < nowTime) : false }" @click="delGoodsItem(index)"></i></p>
                </el-col>
                <el-col :span="24">
                  <el-col :span="2"> *测评时间: </el-col>
                  <el-col :span="13">
                    <el-date-picker size="small" v-model="item.timeValue" @change="timeFormat()" value-format="yyyy-MM-dd HH:mm:ss" 
                    type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" 
                    :disabled="item.assess_start_time ? (item.assess_start_time < nowTime) : false" :picker-options="pickerOptions">
                    </el-date-picker>
                  </el-col>
                  <el-col :span="6"> 注:测评时间开始后,不可修正 </el-col>
                </el-col>
                <el-col :span="16">
                  <el-col :span="3"> *测评目标: </el-col>
                  <el-col :span="21">
                    <el-input size="small" placeholder="请填写测评目标相关内容..." type="textarea" :rows="4" 
                    v-model="item.assess_target" :disabled="item.assess_start_time ? (item.assess_start_time < nowTime) : false"/>
                    注：建议文字不超过80个字
                  </el-col>
                </el-col>
              </section>
            </el-col>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="16" class="section2">
        <h4><i></i>测评报告二维码</h4>
        <p>注：下方信息为非填项，如果未填写，手机端的报告中不会显示此信息</p>
        <el-form ref="form" :model="form" class="form-wrap" label-width="140px">
          <el-form-item label="评测报告二维码：">
            <el-col :span="4">
              <el-upload
                class="avatar-uploader"
                :action="host"
                :show-file-list="false"
                :data="uploadPoster"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="AssessInfo.assess_report_qrcode" :src="AssessInfo.assess_report_qrcode" class="avatar" width="100" height="90">
                <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
              </el-upload>
            </el-col>
          </el-form-item>
          <el-form-item label="企业微信图片：">
            <el-col :span="4">
              <el-upload
                class="avatar-uploader"
                :action="host"
                :show-file-list="false"
                :data="uploadPoster"
                :on-success="handleAvatarSuccess2"
                :before-upload="beforeAvatarUpload">
                <img v-if="AssessInfo.enterprise_wechat_pic" :src="AssessInfo.enterprise_wechat_pic" class="avatar" width="100" height="90">
                <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
              </el-upload>
            </el-col>
          </el-form-item>
          <el-form-item label="二维码说明：">
            <el-col :span="18">
              <el-input size="small" type="textarea" :rows="4" v-model="AssessInfo.qrcode_explain"/>
            </el-col>
            <el-col :span="9"> 注：建议文字不超过30个字 </el-col>
          </el-form-item>
        </el-form>
      </el-col>

      <el-dialog title="选择评测试卷" width="75%" :visible.sync="dialogFormVisible">
        <el-col :span="4">
          <el-input size="small" placeholder="请输入关键词" prefix-icon="el-icon-search" v-model="listQuery.search_paper_name" clearable></el-input>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" @click="searchList()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
        <el-col :span="24">
          <el-table 
            ref="multipleTable"
            tooltip-effect="dark"
            height="370"
            style="width: 100%"
            @current-change="handleCurrentChange"
            highlight-current-row
            :data="goodsData"
            class="dialog-table">
            <el-table-column type="index" width="55" align="center"></el-table-column>
            <el-table-column property="paper_name" label="测评试卷名称" align="left">
            </el-table-column>
            <el-table-column property="create_user_name" label="创建者" align="center" width="270">
              <template slot-scope="scope">
                <span>{{ scope.row.create_user_name ? scope.row.create_user_name : '--' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="24">
          <pagination 
            class="pagination" 
            v-show="total>0" 
            :total="total" 
            :page.sync="listQuery.page_num" 
            :limit.sync="listQuery.page_size" 
            v-on:pagination="changePaging"/>
        </el-col >
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false;listQuery.search = '';" size="small">取 消</el-button>
          <el-button type="primary" @click="bindPaper()" size="small">确 定</el-button>
        </div>
      </el-dialog>

      <el-col :span="24" align="center" class="section3">
        <el-button size="small" @click="cancelSubmit()">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm()">保 存</el-button>
      </el-col>
    </el-col>
  </div>
</template>

<script>
import { addAsses, findAssessInfo, updateAssess,getPaperList } from "@/api/growthCamp";
import Pagination from "@/components/Pagination";
import Request from "@/utils/request";
export default {
  components: { Pagination },
  data() {
    return {
      height: null,
      listLoading: true,
      uploadPoster: {
        bucket: "zm-edu",
        property: 'evaluation-poster'
      },
      AssessInfo:{
        "camp_times_id": "",
        "assess_id": "",
        "assess_report_qrcode": "",
        "enterprise_wechat_pic": "",
        "qrcode_explain": "",
        "paper_info": []
      },
      form:{
        cover_img:'',
        introduction:'',
      },
      dialogFormVisible: false,
      listQuery: {
        page_num: 1,
        page_size: 10,
        search_paper_name: '',
      },
      total: 0,
      goodsData:[],
      currentRow: {
        paper_id:''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    }
  },
  created() {
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    this.AssessInfo.camp_times_id = sessionStorage.getItem('camp_times_id');
    this.nowTime = this.getNowFormatDate();
    if (this.$route.params.Campid.indexOf('_') < 0) {
      //获取编辑签到基本信息
      findAssessInfo({ camp_times_id: this.AssessInfo.camp_times_id }).then(res => {
        res.result.paper_info.forEach(v=>{
          v.timeValue = [v.assess_start_time,v.assess_end_time];
        })
        this.AssessInfo = res.result;
      });
    }
  },
  computed: {},
  methods: {
    getNowFormatDate(){
      var date = new Date();
      var y=date.getFullYear();
      var m=date.getMonth()+1;
      var d=date.getDate();
      var h=date.getHours();
      var m1=date.getMinutes();
      var s=date.getSeconds();
      m = m<10?("0"+m):m;
      d = d<10?("0"+d):d;
      return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
    },
    //获取签到题目列表
    timeFormat(){
      // console.log('timeFormat',v);
    },
    choosePaper(){
      this.dialogFormVisible = true;
      this.getPaperList();
    },
    getPaperList(){
      getPaperList(this.listQuery).then(res => {
        if (res.code == 200) {
          // this.goodsData = res.result.paper_list;
          // res.result.paper_list.forEach(v=>{
          //   v.status = '2';
          //   // this.AssessInfo.paper_list.forEach(k=>{
          //   //   if(v.paper_id == k.paper_id){
          //   //     v.status = '2';
          //   //   }
          //   // })
          // })
          this.total = Number(res.result.count);
          this.goodsData = res.result.paper_list;
        }
      });
    },
    searchList(){
      this.listQuery.page_num = 1;
      this.getPaperList();
    },
    changePaging(){
      this.getPaperList();
    },
    bindPaper(){
      this.currentRow = this.currentRow === null ? {paper_id:''}:this.currentRow;
      if(this.currentRow.paper_id){
        let temp = [];
        this.AssessInfo.paper_info.forEach(v=>{
          temp.push(v.paper_id);
        })
        if(!temp.includes(this.currentRow.paper_id)){
          this.dialogFormVisible = false;
          this.AssessInfo.paper_info.push(
            {
              paper_name: this.currentRow.paper_name,
              paper_id: this.currentRow.paper_id,
              timeValue: '',
              assess_start_time: '',
              assess_end_time: '',
              assess_target: '',
            }
          )
          this.currentRow = {
            paper_id:''
          };
        }else{
          this.$message({
            message: '该试卷已添加过，请检查！',
            type: 'warning'
          });
        }
      }else{
        this.$message({
          message: '未选择试卷，请检查！',
          type: 'warning'
        });
      }
    },
    delGoodsItem(i){
      this.AssessInfo.paper_info.splice(i,1);
    },
    cancelSubmit(){
      this.$router.go(-1);
    },
    submitForm(){
      if(this.AssessInfo.paper_info.length<1){
        this.$message({
          message: '试卷列表不能为空，请检查！',
          type: 'warning'
        });
        return false;
      }else{
        let flag = true,temp = [];
        this.AssessInfo.paper_info.forEach(v=>{
          if(!v.timeValue || !v.assess_target){
            this.$message({
              message: '测评时间或评测目标不能为空，请检查！',
              type: 'warning'
            });
            flag = false;
          }else{
            v.assess_start_time = v.timeValue[0];
            v.assess_end_time = v.timeValue[1];
            temp.push(v.assess_start_time);
          }
        })
        temp = temp.sort();
        for (let t = 0,len = temp.length; t < len; t++) {
          if(temp[t] == temp[t+1]){
            this.$message({
              message: '各试卷测评的开始时间不能相同，请检查！',
              type: 'warning'
            });
            flag = false;
          }
        }
        if(flag){
          // console.log('submitForm',this.AssessInfo);
          if(this.AssessInfo.assess_id){
            //编辑更新
            updateAssess(this.AssessInfo).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.$router.go(-1);
              }
            });
          }else{
            //新建
            addAsses(this.AssessInfo).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.$router.go(-1);
              }
            });
          }
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
    handleAvatarSuccess(res, file) {
      this.AssessInfo.assess_report_qrcode = res.result.urlFile;
    },
    handleAvatarSuccess2(res, file) {
      this.AssessInfo.enterprise_wechat_pic = res.result.urlFile;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0 0 20px;
  .evaluation_container {
    padding: 0px 20px;
    h4{
      width: 200px;
      display: flex;
      align-items: center;
      i{
        display: inline-block;
        height: 16px;
        width: 3px;
        background: lightgrey;
        margin:0 3px;
      }
    }
    .section1{
      width: 100%;
      height: auto;
      min-height: 210px;
      .el-icon-circle-close{
        visibility: hidden;
        margin-left: 5px;
      }
      p{
        margin: 0;
      }
      p:hover  .el-icon-circle-close{
        visibility: visible;
      }
      .hidden{
        display: none;
      }
      section{
        height: 200px;
        width: 100%;
        margin: 15px 0;
      }
    }
    .section2{
      p{
        font-size: 13px;
        text-indent: 25px;
      }
    }
    .section3{
      margin: 30px;
    }
  }
}
</style>

<style lang="scss">
.evaluation_container{
  .avatar-uploader .el-upload{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
}
</style>