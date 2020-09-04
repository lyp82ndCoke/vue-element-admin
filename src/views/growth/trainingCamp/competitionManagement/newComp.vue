<template>
  <div class="newComp">
    <el-col :span="21" class="newComp_container">
      <!-- 赛区基础信息部分 -->
      <h4>赛区基础信息</h4>
      <el-form ref="mathInfo" class="form-wrap" label-width="140px">
        <el-form-item label="*关联营期：" prop="sign_start_time">
          <el-col :span="5">
            <el-select v-model="value1" placeholder="请选择训练营" @change="changeSkus1" size="small" :disabled="timeDisabled">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select v-model="value2" placeholder="请选择营期" @change="changeSkus2" size="small" :disabled="timeDisabled">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="*赛区名称：" prop="sign_start_time">
          <el-col :span="10">
            <span>{{ match_info.match_name }}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="*赛区时间：" prop="sign_start_time">
          <el-col :span="10">
            <span>
              {{ match_info.match_start_time }} 
              <span v-if="match_info.match_start_time">至</span> 
              {{ match_info.match_end_time }}
            </span>
          </el-col>
        </el-form-item>

        <!-- 赛区配置项部分 -->
        <h4>赛区配置项</h4>
        <el-form-item label="*赛区可见规则：" prop="is_tips">
          <el-col :span="10">
            <el-radio v-model="match_info.visible_rule_type" label="2" :disabled="timeDisabled">已购用户可见</el-radio>
            <el-radio v-model="match_info.visible_rule_type" label="1" :disabled="timeDisabled">所有人可见</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item label="*是否有排行榜：" prop="is_tips">
          <el-col :span="23">
            <el-radio v-model="times_task_info.is_have_rank" label="2" :disabled="timeDisabled">否</el-radio>
            <el-radio v-model="times_task_info.is_have_rank" label="1" :disabled="timeDisabled">是</el-radio>
          </el-col>
          <el-col :span="12" v-if="times_task_info.is_have_rank == '1'">
            <span>排行榜统计时间:</span>
            <el-date-picker v-model="timeValue2" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" size="small" value-format="yyyy-MM-dd" :disabled="timeDisabled">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="*是否有奖品：" prop="is_tips">
          <el-col :span="24">
            <el-col :span="9">
              <el-radio v-model="times_task_info.is_have_prize" label="2" :disabled="timeDisabled">否</el-radio>
              <el-radio v-model="times_task_info.is_have_prize" label="1" :disabled="timeDisabled">是</el-radio>
            </el-col>
          </el-col>
        </el-form-item>
        <el-form-item label="*颁奖时间：" prop="sign_explain" v-if="times_task_info.is_have_prize == '1'">
          <el-col :span="10">
            <el-date-picker v-model="times_task_info.give_prize_time" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm:ss" 
            :disabled="timeDisabled">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="*添加奖品：" prop="sign_explain" v-if="times_task_info.is_have_prize == '1'">
          <el-col :span="24">
            <el-col :span="20">
              <el-button type="primary" @click="newPrize()" size="small" :disabled="timeDisabled">添加奖品</el-button>
            </el-col>
            <el-col :span="20" class="award_list" v-if="prize_info.length">
              <el-col :span="24">已添加奖品：</el-col>

              <el-col :span="24" v-for="(item,Index) in prize_info" :key="item.index" class="award_list_content">
                <h5>{{item.info.prize_name}} ：{{item.list[0].win_prize_people_num}}人</h5>
                <section v-if="item.info.prize_type == '1'">
                  <el-popover
                    placement="top"
                    width="350"
                    trigger="click">
                    <p>
                      <img :src="item.list[0].prize_img" alt="" width="310" height="auto" slot="reference" style="margin: 0 auto;">
                    </p>
                    <img :src="item.list[0].prize_img" alt="" width="70" height="45" slot="reference" style="margin-top: 6px;cursor:pointer;">
                  </el-popover>
                  <p>{{item.list[0].award_name}}</p>
                </section>
                <aside v-else>
                  <p v-for="item in item.list" :key="item.index">优惠券：<span>{{ item.coupon_type == '1'? '有赞' : 'H5商城'}}</span>&nbsp;&nbsp;<i>{{item.coupon_name}}，
                    {{(Number(item.coupon_threshold))>0 ? '满'+item.coupon_threshold+'元 减'+item.amount+'元' :item.amount +'元无门槛优惠券'}}</i>
                  </p>
                </aside>
                <b @click="editPrizes(item,Index)" :class="{ isHidden: timeDisabled }">编辑</b>
                <b @click="delPrizes(item,Index)" :class="{ isHidden: timeDisabled }">删除</b>
                <!-- <b @click="prize_info.splice(Index,1)" :class="{ isHidden: timeDisabled }">删除</b> -->
              </el-col>
            </el-col>
          </el-col>
        </el-form-item>

        <el-form-item label="音频文件：">
          <el-col :span="24" >
            <el-col :span="3">
              <el-upload
                class="upload-demo"
                :before-upload="beforeAvatarUpload1"
                :action="host"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :limit="1"
                :on-success="handleSuccess"
                :on-exceed="handleExceed"
                :file-list="fileList"
                ref="upload"
                accept="mp3, mp4"
                :data="propetry">
                <el-button size="small"  @click="changeAudio(times_task_info.audio_url)">
                  {{ !times_task_info.audio_url ? '上传音频' : '修改音频' }}
                </el-button>
              </el-upload>
            </el-col>
            <el-col :span="10" v-if="times_task_info.audio_url">
              {{ times_task_info.audio_title }}&nbsp;<i class="el-icon-circle-close" @click="delAudio()"></i>
            </el-col>
            <el-col :span="10" v-else>暂无数据</el-col>
          </el-col>
          <el-col :span="24">
            注：非必填项，上传音频后在任务分享落地页展现此音频，否则不显示
          </el-col>
        </el-form-item>
      </el-form>

      <el-dialog title="添加/编辑奖品" width="45%" :visible.sync="dialogFormVisible">
        <el-form :model="prizeform" :rules="rules2">
          <el-form-item label="奖项名称" :label-width="formLabelWidth" prop="prize_name">
            <el-col :span="6">
              <el-select v-model="prizeform.level_sort" placeholder="选择奖项序列" size="small" :disabled="!isaddPrize">
                <el-option
                  v-for="item in options3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.isUsed">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-input v-model="prizeform.prize_name" size="small" placeholder="请填写如一等奖或特等奖"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="获奖人数" :label-width="formLabelWidth" prop="win_prize_people_num">
            <el-col :span="18">
              <el-input v-model="prizeform.win_prize_people_num" size="small"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="奖品类别" :label-width="formLabelWidth" prop="prize_type">
            <el-col :span="13">
              <el-radio v-model="prizeform.prize_type" label="1" :disabled="!isaddPrize">实物</el-radio>
              <el-radio v-model="prizeform.prize_type" label="2" :disabled="!isaddPrize">优惠券</el-radio>
            </el-col>
          </el-form-item>
          <el-form-item label="奖品名称" :label-width="formLabelWidth" prop="award_name">
            <el-col :span="18">
              <el-input v-model="prizeform.award_name" size="small" placeholder="请填写奖品名称"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="获奖封面图" :label-width="formLabelWidth" prop="prize_type" v-if="prizeform.prize_type == '1'">
            <el-col :span="5">
              <el-upload
                class="avatar-uploader"
                :data="uploadPoster"
                :action="host"
                :show-file-list="false"
                :on-success="handleAvatarSuccess2"
                :before-upload="beforeAvatarUpload">
                <img v-if="prizeform.prize_img" :src="prizeform.prize_img" class="avatar" width="100" height="90">
                <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
              </el-upload>
            </el-col>
          </el-form-item>
          <el-form-item label="选择优惠券" :label-width="formLabelWidth" prop="" v-if="prizeform.prize_type == '2'">
            <el-col :span="13">
              <el-col :span="12">
                <el-select v-model="prizeform.coupon_type" size="small" @change="changeType" placeholder="选择优惠券类型">
                  <el-option
                    v-for="item in options4" 
                    :key="item.index" 
                    :label="item.label" 
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select v-model="couponValue" filterable remote size='small' reserve-keyword placeholder="选择或搜索优惠券名称"
                  :remote-method="remoteMethod" :loading="loading">
                  <el-option size='small' v-for="item in option2" :key="item.index" :label="item.title" :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="saveData1()" size="mini">确定</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="已选优惠券" :label-width="formLabelWidth" prop="" v-if="prizeform.prize_type == '2'">
            <el-col :span="10">
              <ul>
                <li v-for="(item,index) in couponList" :key="item.index" style="margin:3px 0;">
                  <em> {{ item.coupon_type == '1'? '有赞' : 'H5商城'}}优惠券 </em>
                  {{ item.coupon_name }}&nbsp;
                  <b>{{ Number(item.coupon_threshold)>0 ? '满'+item.coupon_threshold+'元 减'+item.amount+'元' :item.amount +'元无门槛优惠券'}}</b>
                  <i class="el-icon-circle-close" @click="delGoodsItem1(index)"></i>
                </li>
              </ul>
            </el-col>
          </el-form-item>
          <el-form-item label="奖品发放说明" :label-width="formLabelWidth" prop="prize_description">
            <el-col :span="20">
              <el-input type="textarea" :rows="3" v-model="prizeform.prize_description" 
              size="small" clearable placeholder="请输入奖品发放说明"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="canceladdPrize" size="small">取 消</el-button>
          <el-button type="primary" @click="addPrize()" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
    
    <el-col :span="24" class="submitButtons">
      <el-button @click="cancelSubmit()" size="small">&nbsp;取&nbsp;消&nbsp;</el-button>
      <el-button type="primary" @click="saveSubmit()" size="small">&nbsp;保&nbsp;存&nbsp;</el-button>
    </el-col>
  </div>
</template>

<script>
import { campList, campTimesList, insertMatch, updateMatch, getMatch } from "@/api/growthCamp";
import Pagination from "@/components/Pagination";
import Tinymce from '@/components/Tinymce';
import draggable from 'vuedraggable';
import { getPromoList } from '@/api/giftCard';
import { getCouponList } from "@/api/group";
export default {
  components: { Tinymce,Pagination,draggable },
  data() {
    return {
      value1:'',
      value2:'',
      options1: [],
      options2: [],
      options3: [
        {
          value: '1',
          isUsed: false,
          label: '1'
        },
        {
          value: '2',
          isUsed: false,
          label: '2'
        },
        {
          value: '3',
          isUsed: false,
          label: '3'
        },
        {
          value: '4',
          isUsed: false,
          label: '4'
        },
        {
          value: '5',
          isUsed: false,
          label: '5'
        },
        {
          value: '6',
          isUsed: false,
          label: '6'
        },
        {
          value: '7',
          isUsed: false,
          label: '7'
        },
        {
          value: '8',
          isUsed: false,
          label: '8'
        },
        {
          value: '9',
          isUsed: false,
          label: '9'
        },
        {
          value: '10',
          isUsed: false,
          label: '10'
        }
      ],
      options4: [
        {
          value: '1',
          label: '有赞优惠券'
        },
        {
          value: '2',
          label: 'H5商城优惠券'
        },
      ],
      "match_info": {
        "match_id": "",
        "match_name": "",
        "match_start_time": "",
        "match_end_time": "",
        "camp_times_id": "",
        "visible_rule_type": "1",
        "camp_id": ""
      },
      "times_task_info": {
        "is_have_rank": "2",
        "rank_start_time": "",
        "rank_end_time": "",
        "is_have_prize": "2",
        "give_prize_time": "",
        "audio_url": '',
        "audio_length": '',
        "audio_title": ''
      },
      "prize_info":[],
      timeDisabled: false,
      prizeform:{
        prize_name:'',
        prize_type:'1',
        level_sort:'',
        award_name:'',
        prize_img:'',
        coupon_type:'',
        prize_description:'',
        win_prize_people_num:'',
      },
      rules2: {
        prize_name: [
          { required: true, message: '请输入奖项名称', trigger: 'blur' },
        ],
        prize_type: [
          { required: true, message: '请选择奖品类别', trigger: 'blur' },
        ],
        level_sort: [
          { required: true, message: '请输入签到名称', trigger: 'blur' },
        ],
        award_name: [
          { required: true, message: '请输入奖品名称', trigger: 'blur' },
        ],
        coupon_name: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' },
        ],
        coupon_type: [
          { required: true, message: '请选择优惠券', trigger: 'blur' },
        ],
        win_prize_people_num: [
          { required: true, message: '请输入获奖人数', trigger: 'blur' },
        ],
        prize_description: [
          { required: true, message: '请输入奖品描述', trigger: 'blur' },
        ]
      },
      formLabelWidth: '110px',
      timeValue2: [],
      dialogFormVisible: false,
      loading: false,
      isaddPrize: false,
      couponValue: '',
      option2: [],
      couponList: [],
      uploadPoster: {
        bucket: "zm-edu",
        property: 'competitionManagement-poster'
      },
      fileList: [],
      propetry: {
        property: 'audio',
        bucket: 'zm-edu',
      }
    }
  },
  created() {
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    this.campList();
    if (this.$route.params.compid.indexOf('new')) {
      setTimeout(() => {
        this.getMatch();
      }, 500);
    }
  },
  methods: {
    //获取赛区详情
    getMatch(){
      getMatch({ match_id: this.$route.params.compid }).then(res => {
        if (res.code == 200) {
          this.match_info.match_id = res.result.match_info.match_id;
          this.match_info.camp_times_id = res.result.match_info.camp_times_id;
          this.match_info.visible_rule_type = res.result.match_info.visible_rule_type;
          this.match_info.camp_id = res.result.match_info.camp_id;

          //赛区基础信息
          this.times_task_info = res.result.times_task_info;
          if(this.times_task_info.is_have_rank == '1'){
            this.timeValue2[0] = this.times_task_info.rank_start_time;
            this.timeValue2[1] = this.times_task_info.rank_end_time;
          }
          
          //奖品信息
          res.result.prize_info.forEach(m=>{
            //奖项限制
            this.options3.forEach(k=>{
              if(k.label == m.info.level_sort){
                k.isUsed = true;
              }
            })
            //实物奖品
            if(m.info.prize_type == '1'){
              this.prize_info.push(
                {
                  info: m.info,
                  list: [{
                    "win_prize_people_num": m.list[0].win_prize_people_num,
                    "award_name": m.list[0].award_name,
                    "prize_img": m.list[0].prize_img,
                    "prize_description": m.list[0].prize_description,
                    "coupon_type": '',
                    "coupon_name": '',
                    "coupon_id": '',
                    "amount": '',
                    "coupon_threshold": '',
                  }]
                }
              )
            }else{
            //优惠券奖品
              let d = {
                info: m.info,
                list: []
              }
              m.list.forEach(x=>{
                d.list.push(
                  {
                    "win_prize_people_num": x.win_prize_people_num,
                    "award_name": x.award_name,
                    "coupon_type": x.coupon_type,
                    "coupon_id": x.coupon_id,
                    "amount": x.amount,
                    "coupon_threshold": x.coupon_threshold,
                    "prize_img": x.prize_img,
                    "prize_description": x.prize_description,
                    "coupon_name": x.coupon_name,
                  }
                )
              })
              this.prize_info.push(d)
            }
          })
          
          //基础信息回显
          this.value2 = res.result.match_info.camp_times_id;
          this.options1.forEach(k=>{
            if(k.value == res.result.match_info.camp_id){
              this.value1 = k.value;
              this.campTimesList(k.value);
            }
          })
          setTimeout(() => {
            this.options2.forEach(t=>{
              if(t.value == this.value2){
                this.match_info.match_start_time = t.start_time;
                this.match_info.match_end_time = t.end_time;
                this.match_info.match_name = t.label;
                //根据赛区时间判断是否可以修改
                this.timeDisabled = Boolean(this.getNowFormatDate() >= this.match_info.match_start_time);
              }
            })
          }, 550);
        }
      });
    },
    //训练营列表
    campList(){
      campList({page_num: 1,page_size: 999}).then(res => {
        if (res.code == 200) {
          res.result.list.forEach(v=>{
            this.options1.push(
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
      campTimesList({page_num: 1,page_size: 999,camp_id: v}).then(res => {
        if (res.code == 200) {
          res.result.list.forEach(v=>{
            this.options2.push(
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
      this.options2 = [];
      this.value2 = '';
      this.match_info.match_start_time = '';
      this.match_info.match_end_time = '';
      this.match_info.match_name = '';
      this.campTimesList(v);
      this.options1.forEach(k=>{
        if(k.value == v){
          this.match_info.camp_id = k.value;
        }
      })
    },
    changeSkus2(v){
      this.options2.forEach(k=>{
        if(k.value == v){
          this.match_info.match_start_time = k.start_time;
          this.match_info.match_end_time = k.end_time;
          this.match_info.camp_times_id = k.value;
          this.match_info.match_name = k.label;
        }
      })
    },
    newPrize(){
      this.dialogFormVisible = true;
      this.getCouponList();
      this.isaddPrize = true;
      this.couponList = [];
      this.prizeform = {
        prize_name:'',
        prize_type:'1',
        level_sort:'',
        award_name:'',
        prize_img:'',
        coupon_type:'1',
        win_prize_people_num:'',
        prize_description:''
      }
    },
    addPrize(){
      if(this.prizeform.prize_name == '' || this.prizeform.level_sort == '' || this.prizeform.award_name == '' ||
      this.prizeform.prize_description == '' || this.prizeform.win_prize_people_num == ''){
        this.$message({
          message: '奖品必要信息不能为空，请检查！',
          type: 'warning'
        });
      }else{
        this.dialogFormVisible = false;
        //新增奖品
        if(this.isaddPrize){
          //优惠券商品
          if(this.prizeform.prize_type == '2'){
            let d = { info:{} }
            d.info={
              level_sort : this.prizeform.level_sort,
              prize_name : this.prizeform.prize_name,
              prize_type : this.prizeform.prize_type
            }
            let list = []
            this.couponList.forEach(v=>{
              list.push({
                "award_name": this.prizeform.award_name,
                "win_prize_people_num": this.prizeform.win_prize_people_num,
                "prize_description": this.prizeform.prize_description,
                "coupon_type": v.coupon_type,
                "coupon_name": v.coupon_name,
                "amount": v.amount,
                "coupon_id":v.coupon_id,
                "coupon_threshold": v.coupon_threshold,
                "prize_img":''
              })
            })
            d.list = list;
            this.prize_info.push( d )
          }else{
            //实物奖品
            this.prize_info.push(
              {
                info:{
                  "prize_name": this.prizeform.prize_name,
                  "level_sort": this.prizeform.level_sort,
                  "prize_type": this.prizeform.prize_type,
                },
                list:[
                  {
                    "win_prize_people_num": this.prizeform.win_prize_people_num,
                    "prize_description": this.prizeform.prize_description,
                    "award_name": this.prizeform.award_name,
                    "prize_img": this.prizeform.prize_img,
                    "coupon_type": '',
                    "coupon_name": '',
                    "amount": '',
                    "coupon_id": '',
                    "coupon_threshold": '',
                  }
                ]
              }
            )
          }
          this.isaddPrize = false;
          //限制重复奖项
          this.options3.forEach(k=>{
            if(k.label == this.prizeform.level_sort){
              k.isUsed = true;
            }
          })
        }
        
        
        //编辑奖品
        if(this.currEditPrize > -1){
          if(this.prize_info[this.currEditPrize].info.prize_type == '1'){
            //编辑实物奖品
            this.prize_info[this.currEditPrize].info.level_sort = this.prizeform.level_sort;
            this.prize_info[this.currEditPrize].info.prize_name = this.prizeform.prize_name;
            this.prize_info[this.currEditPrize].info.prize_type = this.prizeform.prize_type;
            this.prize_info[this.currEditPrize].list[0].win_prize_people_num = this.prizeform.win_prize_people_num;
            this.prize_info[this.currEditPrize].list[0].prize_img = this.prizeform.prize_img;
            this.prize_info[this.currEditPrize].list[0].award_name = this.prizeform.award_name;
            this.prize_info[this.currEditPrize].list[0].prize_description = this.prizeform.prize_description;
          }else{
            //编辑优惠券奖品
            this.prize_info[this.currEditPrize].info.level_sort = this.prizeform.level_sort;
            this.prize_info[this.currEditPrize].info.prize_name = this.prizeform.prize_name;
            this.prize_info[this.currEditPrize].info.prize_type = this.prizeform.prize_type;
            this.prize_info[this.currEditPrize].list[0].win_prize_people_num = this.prizeform.win_prize_people_num;
            this.prize_info[this.currEditPrize].list[0].award_name = this.prizeform.award_name;
            this.prize_info[this.currEditPrize].list[0].prize_description = this.prizeform.prize_description;
            this.prize_info[this.currEditPrize].list = [];
            if(this.couponList.length>0){
              this.couponList.forEach(v=>{
                this.prize_info[this.currEditPrize].list.push({
                  "award_name": this.prizeform.award_name,
                  "win_prize_people_num": this.prizeform.win_prize_people_num,
                  "prize_description": this.prizeform.prize_description,
                  "coupon_type": v.coupon_type,
                  "coupon_name": v.coupon_name,
                  "amount": v.amount,
                  "coupon_id":v.coupon_id,
                  "coupon_threshold": v.coupon_threshold,
                  "prize_img":''
                })
              })
            }
          }
        }

        this.currEditPrize = -1;
        this.prizeform = {
          prize_name:'',
          prize_type:'1',
          level_sort:'',
          award_name:'',
          prize_img:'',
          coupon_type:'',
          win_prize_people_num:'',
          prize_description:'',
        }
        this.couponList = [];
        this.currEditPrize = -1;
      }
    },
    editPrizes(v,i){
      this.currEditPrize = i;
      this.isaddPrize = false;
      this.prizeform = {};
      this.dialogFormVisible = true;

      //数据回显
      if(v.info.prize_type == '1'){
        //实物奖品
        this.prizeform = {
          prize_name: v.info.prize_name,
          prize_type: '1',
          level_sort: v.info.level_sort,
          award_name: v.list[0].award_name,
          prize_img: v.list[0].prize_img,
          prize_description: v.list[0].prize_description,
          win_prize_people_num: v.list[0].win_prize_people_num
        }
      }else{
        //优惠券奖品
        this.prizeform = {
          prize_img:'',
          prize_name: v.info.prize_name,
          prize_type: '2',
          level_sort: v.info.level_sort,
          award_name: v.list[0].award_name,
          prize_description: v.list[0].prize_description,
          win_prize_people_num: v.list[0].win_prize_people_num
        }
        if(this.couponList.length<1){
          v.list.forEach(v=>{
            this.couponList.push(
              {
                "coupon_id": v.coupon_id,
                "amount": v.amount,
                "coupon_type": v.coupon_type || '1',
                "coupon_name": v.coupon_name,
                "coupon_threshold": v.coupon_threshold
              }
            )
          })
        }
      }
    },
    delPrizes(v,i){
      this.prize_info.splice(i,1);
      this.options3[i].isUsed = false;
    },
    delGoodsItem1(i){
      this.couponList.splice(i, 1)
    },
    canceladdPrize(){
      this.dialogFormVisible = false;
      this.prizeform = {
        prize_name: '',
        prize_type: '1',
        level_sort: '',
        award_name: '',
        prize_img: '',
        coupon_type: '1',
        win_prize_people_num: '',
        prize_description: '',
      }
      this.couponList = [];
      this.currEditPrize = -1;
    },
    getNowFormatDate(){
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    saveSubmit(){
      let data = {
        match_info: this.match_info,
        times_task_info: this.times_task_info,
        prize_info: this.prize_info
      }
      //判断必填项不能为空
      if(!this.value1){
        this.$message({
          message: '训练营为必选项，请检查！',
          type: 'warning'
        });
        return false;
      }else if(!this.value2){
        this.$message({
          message: '训练营营期为必选项，请检查！',
          type: 'warning'
        });
        return false;
      }else if(this.times_task_info.is_have_rank =='1' && !this.timeValue2.length){
        this.$message({
          message: '排行榜统计时间不能为空，请检查！',
          type: 'warning'
        });
        return false;
      }else if(this.times_task_info.is_have_prize =='1' && !this.times_task_info.give_prize_time){
        this.$message({
          message: '颁奖时间不能为空，请检查！',
          type: 'warning'
        });
        return false;
      }else if(this.times_task_info.is_have_prize =='1' && !this.prize_info.length){
        this.$message({
          message: '奖品不能为空，请检查！',
          type: 'warning'
        });
        return false;
      }else{
        //任务基本信息处理
        this.times_task_info.rank_start_time = this.timeValue2[0];
        this.times_task_info.rank_end_time = this.timeValue2[1];
        // console.log('saveSubmit11',data);

        if(this.match_info.match_id){
          updateMatch(data).then(res => {
            if (res.code == 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.$router.go(-1);
            }
          });
        }else{
          insertMatch(data).then(res => {
            if (res.code == 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.$router.go(-1);
            }
          })
        }
      }
    },
    cancelSubmit() {
      this.$router.go(-1);
    },
    saveData1() {
      let amount, id, coupon_type, title, coupon_json, coupon_threshold, bool = true;
      for (let t = 0,len=this.option2.length; t < len; t++) {
        if (this.couponValue == this.option2[t].id) {
          amount = Number(this.option2[t].denominations) / 100;
          id = this.option2[t].id;
          title = this.option2[t].title;
          coupon_json = this.option2[t].originData || this.option2[t];
          coupon_type = this.option2[t].coupon_type || '1';
          coupon_threshold = this.option2[t].conditions / 100;
        }
      }

      if (this.couponValue == '') {
        this.$message({
          message: "优惠券不能为空,请重新选择!",
          type: "warning"
        });
        bool = false;
        return;
      }

      this.couponList.forEach(v=>{
        if(v.coupon_id == id){
          this.$message({
            message: "该优惠券已添加,请重新选择!",
            type: "warning"
          });
          bool = false;
          this.prizeform.coupon_type = '';
          this.couponValue = '';
          return;
        }
      })

      if (bool) {
        this.couponList.push(
          {
            "type": 1,
            "coupon_id": id,
            // "continuity_day": this.continuity_day,
            "amount": amount,
            "coupon_type": coupon_type || '1',
            "coupon_name": title,
            "coupon_threshold": coupon_threshold
          }
        )

        this.prizeform.coupon_type = '';
        this.couponValue = '';
        
        if(this.prizeform.coupon_type == '1'){
          this.getCouponList();
        }else{
          this.getPromoList();
        }
        this.couponList.sort((a,b) => {
          return a.continuity_day - b.continuity_day
        })
      }
    },
    changeType(v){
      this.option2 = [];
      if(v == '1'){
        this.couponValue = '';
        this.getCouponList();
      }else{
        this.couponValue = '';
        this.getPromoList();
      }
    },
    //H5优惠券
    getPromoList(){
      this.option2 = [];
      getPromoList({ status_code: "",page_no: 1,page_size: 299 }).then(res => {
        if (res.code == 200) {
          res.result.rows.forEach( v => {
            this.option2.push({
              title: v.card_name,
              id: v.card_code,
              conditions: v.at_least || 0,
              denominations: v.card_value,
              coupon_type: '2',
              at_least: v.at_least || 0
            })
          })
        }
      })
    },
    //有赞优惠券
    getCouponList(){
      getCouponList({ kdt_id: '1655766', group_type: '9', page_no: 1, page_size: 299 }).then(res => {
        if (res.code == 200) {
          this.option2 = res.result.rows;
        }
      })
    },
    //获取优惠券列表
    remoteMethod(query) {
      if (query !== '') {
        this.option2 = [];
        this.loading = true;
        if(this.prizeform.coupon_type == '1'){
          getCouponList({ kdt_id: '1655766', group_type: '9', page_no: 1, page_size: 299,coupon_name: query }).then(res => {
            if (res.code == 200) {
              this.loading = false;
              this.option2 = res.result.rows;
            }
          })
        }else{
          getPromoList({ status_code: "",page_no: 1,page_size: 299,card_name: query }).then(res => {
            if (res.code == 200) {
              this.loading = false;
              res.result.rows.forEach( v => {
                this.option2.push({
                  title:v.card_name,
                  id: v.card_code,
                  conditions: v.at_least || 0,
                  denominations: v.card_value,
                  coupon_type: '2',
                  at_least: v.at_least || 0,
                })
              })
            }
          })
        }
      } 
      else {
        this.option2 = [];
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
      this.prizeform.prize_img = res.result.urlFile;
    },
    beforeAvatarUpload1(file) {
      const isType = file.type;
      const isSize = file.size / 1024 / 1024 < 200;
      if (isType != 'audio/mp3' && isType != 'audio/mpeg' && isType != 'audio/wav' ) {
        this.$message.error('上传的资料只能是音频格式哦!');
        return false;
      }
      if (!isSize) {
        this.$message.error('上传的资料大小不能超过 200MB!');
      }
      return isType && isSize;
    },
    handleSuccess(response, file, fileList) {
      var name = file.name;
      name = name.substring(0, name.length - 4);
      this.times_task_info.audio_title = name;
      this.times_task_info.audio_url = response.result.urlFile;
      this.times_task_info.audio_length = response.result.audioSecond;
      this.audioTime = response.result.audioTime;
      this.audioSuccess = true;
    },
    changeAudio(v){
      if(v){
        this.fileList = [];
        this.times_task_info.audio_url = '';
        this.times_task_info.audio_title = '';
        this.times_task_info.audio_length = '0';
      }
    },
    delAudio(){
      this.$confirm('确认要删除此文件吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.times_task_info.audio_url = '';
        this.times_task_info.audio_title = '';
        this.times_task_info.audio_length = '0';
        this.fileList = [];
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleExceed(files, fileList) {
      // this.$message.warning('只允许上传一个哦');
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
  }
};
</script>

<style lang="scss" scoped>
.newComp{
  padding: 20px;
  .newComp_container{
    .form-wrap{
      margin-bottom: 130px;;
    }
    ul {
      width: 500px;
      list-style: none;
      padding: 0;
      li {
        height: 20px;
        line-height: 20px;
        overflow: hidden;
        position: relative;
        em{
          font-style: normal;
          font-size: 12px;
          width: 80px;
          height: 20px;
          text-align: center;
          display: inline-block;
          background: lightgray;
        }
        b{
          font-weight: 400;
        }
        span {
          width: 220px;
        }
        i {
          visibility: hidden;
        }
        &:hover i {
          visibility: visible;
        }
      }
    }
    .award_list{
      .award_list_content{
        width: 100%;
        min-height: 40px;
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
        background: rgb(235, 235, 235);
        margin: 5px 0;
        &:hover b{
          visibility: visible;
        }
        h5{
          width:16%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 13px;
          margin: 8px 0;
        }
        section{
          min-height: 50px;
          line-height: 20px;
          width:560px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          p{
            width: 500px;
            float: left;
            margin-left: 15px;
          }
        }
        aside{
          width:560px;
          p{
            margin: 8px 0;
          }
          i{
            font-style: normal;
          }
          span{
            display: inline-block;
            width: 60px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            background: lightgray;
          }
        }
        b{
          float: right;
          font-size: 14px;
          margin:0 10px;
          visibility: hidden;
          cursor: pointer;
        }
        
      }
    }
    .isHidden{
      visibility: hidden !important;
    }
  }
  .submitButtons{
    position: fixed;
    left: 50%;
    bottom: 10px;
  }
}
</style>

<style lang="scss">
.newComp{
  .avatar-uploader .el-upload{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
  .el-upload-list__item{
    display: none;
  }
}
</style>