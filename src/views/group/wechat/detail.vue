<template>
  <div class="app_container-detail">
    <el-col :span="24" class="title-header">
      <el-col :span="24">
        <el-col :span="2" class="success-btn">
          <el-button type="primary" size="small" @click="uploadMedia">上传媒体</el-button>
        </el-col>
        <el-col :span="3" class="margin-20">
          <el-select v-model="listQuery.show_flag" clearable placeholder="全部" size="small" @change="clearTitle">
            <el-option
              v-for="item in [{label:'全部',value: ''},{label:'显示',value: '1'},{label:'不显示',value: '0'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="margin-20">
          <el-select v-model="listQuery.source_id" clearable placeholder="请选择来源" size="small" @change="clearTitle">
            <el-option
              v-for="item in [{label:'全部',value: ''},{label:'群',value: '1'},{label:'成长墙',value: '2'},{label:'好评',value: '3'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="margin-20">
          <el-select v-model="listQuery.first_flag" clearable placeholder="请选择是否置顶" size="small" @change="clearTitle">
            <el-option
              v-for="item in [{label:'全部',value: ''},{label:'已置顶',value: '1'},{label:'未置顶',value: '0'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" align="center" class="margin-20">
          <el-input size="small" clearable placeholder="请输入关键字" prefix-icon="el-icon-search" v-model="listQuery.content" @clear="clearTitle">
          </el-input>
        </el-col>
        <el-col :span="4" align="center" class="margin-20">
          <el-input size="small" clearable placeholder="请输入群名称" prefix-icon="el-icon-search" v-model="listQuery.chatroom_name" @clear="clearTitle">
          </el-input>
        </el-col>
        <el-col :span="1" class="success-btn margin-20">
          <el-button type="success" @click="clearTitle()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
    </el-col>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        highlight-current-row>
        <el-table-column label="用户昵称" prop="title" align="center" width="180">
          <template slot-scope="scope">
            <el-col :span="24"><img :src="scope.row.head_img" class="head-img" alt=""></el-col>
            <el-col :span="24">{{ scope.row.nickname }}</el-col>
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="create_time" align="center">
          <template slot-scope="scope">
            <el-col :span="24">{{scope.row.content}}</el-col>
            <el-col :span="24" v-if="scope.row.video_list.length>0" style="margin-top: 10px;">
              <video controls="controls"  height="100px" :src="scope.row.video_list[0].video_url"></video>
            </el-col>
            <el-col :span="24" v-if="scope.row.image_list.length>0" class="pic-center">
              <el-col :span="4" v-for="(picItem,picIndex) in scope.row.image_list" :key="picIndex" @click.native="previewPic(picIndex,scope.row.image_list)">
                <img class="head-pic" :src="picItem.image_url" alt="">
              </el-col>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column label="来源(微信群名称)" prop="is_show" align="center" width="300">
          <template slot-scope="scope">{{scope.row.chatroom_name}}</template>
        </el-table-column>
        <el-table-column label="发布时间" prop="title" align="center" width="140">
          <template slot-scope="scope">
            <span>{{scope.row.createtime}}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" align="center" width='180'>
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.source_id==3" @click="editStatus(scope.row.content_id)" type="text">编辑</el-button>
            <el-button size="mini" @click="showStatus(scope.row.content_id, scope.row.show_flag)" type="text">{{scope.row.show_flag == 1 ? '取消显示': '显示'}}</el-button>
            <el-button size="mini" @click="changeStatus(scope.row.content_id, scope.row.first_flag)" type="text">{{scope.row.first_flag == 1 ? '取消置顶' : '置顶'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page_no"
        :limit.sync="listQuery.page_size"
        v-on:pagination="getPraiseContent"/>
    </el-col>

    <!-- 上传媒体 -->
    <el-dialog
      :visible.sync="addAlert"
      width="60%"
      :before-close="handleOther"
      class="sheet-details">
        <el-form ref="form" :model="form" :rules="rules" class="form-wrap" label-width="160px">
          <el-form-item label="选择来源(微信群)：" prop="chatroom">
            <el-col :span="12">
              <el-select
                v-model="form.chatroom"
                filterable
                size="small"
                remote
                reserve-keyword
                placeholder="请选择微信群"
                :remote-method="remoteMethod"
                :loading="loading"
                style="width:320px;"
                @change="handleChatroom">
                <el-option
                  v-for="item in groupList"
                  :key="item.chatroom_id"
                  :label="item.chatroom_name"
                  :value='`{"chatroom_id":"${item.chatroom_id}","chatroom_name":"${item.chatroom_name}"}`'>
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="10">tip:仅能选择该商品已经关联的群</el-col>
          </el-form-item>

          <el-form-item label="用户昵称：" prop="user_data">
            <el-col :span="12">
              <el-select
                v-model="form.user_data"
                filterable
                size="small"
                remote
                reserve-keyword
                placeholder="请选择用户"
                style="width:320px;"
                :remote-method="remoteMethodUser"
                :loading="loadingUser">
                <el-option
                  v-for="item in memberList"
                  :key="item.member_id"
                  :label="item.nickname"
                  :value='`{"member_id":"${item.member_id}","nickname":"${item.nickname}","head_img":"${item.head_img}"}`'>
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="10">tip:未找到指定用户，请选择匿名用户</el-col>
          </el-form-item>

          <el-form-item label="好评内容：">
            <el-col :span="12">
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="form.content">
              </el-input>
            </el-col>
          </el-form-item>
          
          <el-form-item label="选择媒体：" prop="upload_type">
            <el-col :span="24">
              <el-radio v-model="form.upload_type" label="1">上传图片</el-radio>
              <el-radio v-model="form.upload_type" label="2">上传视频</el-radio>
            </el-col>
            <!-- 上传图片 -->
            <el-col :span="24" v-if="form.upload_type == 1">
              <el-col :span="24">
                <span class="banner-img-wrap" v-for="(item,index) in form.image_list" :key="index">
                  <img style="margin-right: 5px;" :src="item.image_url" width="80" height="80" alt="">
                  <span class="banner-img-remove">
                    <i class="el-icon-delete" @click="delImgList(index)"></i>
                  </span>
                </span>
              </el-col>
              <el-col :span="24" class="upload_img">
                <el-upload
                  :disabled="form.image_list.length==9"
                  :action="host"
                  :show-file-list="false"
                  list-type="picture-card"
                  :data="uploadData"
                  :multiple="true"
                  :limit="9"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-col :span="24" v-if="form.image_list.length==9" class="tips">最多可以上传9张图片</el-col>
              </el-col>
            </el-col>

            <!-- 上传视频 -->
            <el-col :span="24" v-else-if="form.upload_type == 2">
              <el-col :span="12">
                <el-upload
                  :action="host"
                  :show-file-list="false"
                  :on-success="handleAudioSuccess"
                  :data="uoloadAudio"
                  :before-upload="beforeAudioUpload">
                  <el-button size="small" type="success">点击上传视频</el-button>
                </el-upload>
                <p v-if="form.video_list.length>0">
                  <video controls="controls" width="300px" height="auto" autoplay loop :src="form.video_list[0].video_url"></video>
                </p>
              </el-col>
              <el-col :span="12">
                <el-upload
                  :action="host"
                  :show-file-list="false"
                  :data="uploadPoster"
                  :on-success="handleSuccessPoster"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="small" type="success">点击上传视频封面图</el-button>
                </el-upload>
                <p v-if="form.video_list.length>0 && form.video_list[0].video_img">
                  <img style="margin-right: 5px;" :src="form.video_list[0].video_img" width="300" alt="">
                </p>
              </el-col>             
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="saveContent('form')"
            >保存</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 列表图片预览 -->
    <el-dialog
      :visible.sync="picAlert"
      width="60%"
      :before-close="handlePic">
      <div class="src-pic">
        <img :src="srcPic" height="350" alt="">
      </div>
      <div class="btn-pic">
        <el-button type="primary" size="small" @click="prevPic()" :disabled="currentIndex===0">上一张</el-button>
        <el-button type="primary" size="small" @click="nextPic()" :disabled="currentIndex===(srcList.length-1)">下一张</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
import { 
  getPraiseContent, 
  updateContent, 
  updateFirst, 
  getChatroomRelation,
  getMemberList,
  addPraiseContent
} from "@/api/wechat";
import Pagination from '@/components/Pagination';
import uuidv1 from 'uuid/v1' 

export default {
  name:'',
  components: { Pagination, swiper, swiperSlide },

  data(){
    return{
      listQuery: {
        show_flag: "",
        first_flag: "",
        chatroom_name: "",
        page_no: 1,
        page_size: 10,
        praise_id: "",
        source_id: "",
        content: ""
      },
      host: "",
      listLoading: true,
      total: 0,
      list:[],
      addAlert: false,
      // 上传媒体 提交数据
      form: {
        chatroom_id: "",
        content: "",
        content_id: "",
        createtime: "",
        head_img: "",
        member_id: "",
        msgtype: "9527",
        nickname: "",
        praise_id: "",
        show_flag: 1,
        source_id: 3,
        stat_date: "",
        vcserialno: "",
        add_flag: 1,
        chatroom_name: "",
        user_data: "",
        image_list: [],
        video_list: [],
        chatroom: "",
        upload_type: ""
      },
      rules: {
        chatroom: [
          { required: true, message: "请选择来源(微信群)", trigger: "change" }
        ],
        user_data: [
          { required: true, message: "请选择用户昵称", trigger: "change" }
        ],
        upload_type: [
          { required: true, message: "请选择媒体", trigger: "change" }
        ]
      },
      groupParams: {
        page_no:1,
        page_size: 999999,
        item_id: "",
        chatroom_name: "",
        relation_flag: 1,
      },
      groupList: [],
      loading: false,
      loadingUser: false,
      memberList: false,
      memberParams: {
        page_no: 1,
        page_size: 600,
        chatroom_id: "",
        nickname: ""
      },
      uploadData: {
        bucket: "h5-shop",
        path: 'praise/img'
      },
      uoloadAudio: {
        bucket: "h5-shop",
        path: 'praise/video'
      },
      uploadPoster: {
        bucket: "h5-shop",
        path: 'praise/img'
      },
      fileList: [],
      srcList: [],
      srcPic: "",
      picAlert: false,
      currentIndex: 0,
      editId: 0,
    }
  },
  created(){
    this.listQuery.praise_id = this.$route.params.id;
    this.groupParams.item_id = this.$route.params.id;
    this.host  = process.env.GROUP_API + "/baseapi/aliyun/file_upload";
    if(this.listQuery.praise_id){
      this.getPraiseContent();
    }
  },
  mounted() {
    
  },
  methods:{
    // 查询好评内容列表(结果)
    getPraiseContent(){
      this.listLoading = true;
      getPraiseContent(this.listQuery).then(res => {
        if(res.code == 200){
          this.listLoading = false;
          this.list = res.result.rows;
          this.total = res.result.total;
        }
      })
    },
    showStatus(content_id, show_flag){
      var show = show_flag == 0 ? 1 : 0;
      updateContent({content_id,show_flag:show}).then(res => {
        if(res.code == 200){
          this.$message.success('操作成功');
          this.getPraiseContent();
        }
      })
    },
    changeStatus(content_id, first_flag){
      const firstFlag = first_flag == 0 ? 1 : 0;
      updateFirst({content_id,first_flag:firstFlag}).then(res => {
        if(res.code == 200){
          this.$message.success('操作成功');
          this.getPraiseContent();
        }
      })
    },
    clearTitle(){
      this.listQuery.page_no = 1;
      this.getPraiseContent();
    },
    // 查询群关系列表
    getChatroomRelation(){
      getChatroomRelation(this.groupParams).then(res => {
        if(res.code == 200){
          this.groupList = res.result.rows;
          this.groupList.splice(1, 0);
          this.loading = false;
        }
      })
    },
    handleOther(){
      this.addAlert = false;
    },
    uploadMedia(){
      this.addAlert = true;
      this.getChatroomRelation();
      this.editId = 0;
      for(let key in this.form){
        this.form[key] = '';
      }
      this.form.image_list = [];
      this.form.video_list = [];
      this.form.msgtype = '9527';
      this.form.show_flag = 1;
      this.form.source_id = 3;
      this.form.add_flag = 1;
    },
    remoteMethod(query){
      if(query){
        this.loading = true;
        this.groupParams.chatroom_name = query;
      }else{
        this.groupParams.chatroom_name = "";
      }
      this.getChatroomRelation();
    },
    remoteMethodUser(query){
      if(query){
        this.loadingUser = true;
        this.memberParams.nickname = query;
      }else{
        this.memberParams.nickname = "";
      }
      if(this.memberParams.chatroom_id){
        this.getMember();
      }else{
        this.$message.warning('请先选择来源(微信群)！');
      }
    },
    //查询群成员
    getMember(){
      getMemberList(this.memberParams).then(res => {
        if(res.code == 200){
          this.loadingUser = false;
          this.memberList = res.result.rows;
          this.memberList.unshift({
            member_id: "13800138000",
            nickname: "匿名用户",
            head_img: "http://zm-wechat-image.zmedc.com/wechat/member-cache-head-img/13800138000.jpg"
          })
        }
      })
    },
    handleAudioSuccess(res, file){
      this.form.video_list.push({
        video_url: res.result.file_url
      })
    },
    
    beforeAudioUpload(file){
      const fileType = file.type;
      let isJPG;
      console.log(fileType, 'fileType')
      // const isLt2M = file.size / 1024 / 1024 < 4;
      if (fileType == 'video/mp4') {
        isJPG = true;
      } else {
        this.$message.error('上传的视频只能是MP4格式!');
        isJPG = false;
      }
      // if (!isLt2M) {
      //   this.$message.error('上传海报图片大小不能超过 4MB!');
      // }
      // return isJPG && isLt2M;
      return isJPG;
    },
    handleSuccess(file, fileList) {
      this.form.image_list.push({
        image_url: file.result.file_url
      })
    },
    handleSuccessPoster(file, fileList){
      if(this.form.video_list.length>0){
        this.$set(this.form.video_list[0], 'video_img', file.result.file_url);
      }else{
        this.$message.error('请先上传视频哦！');
      }
    },
    handleExceed(files, fileList){
       // this.$message.warning(`对多上传9张图片哦，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
       this.$message.warning("最多上传9张图片哦！");
    },
    handleRemove(file, fileList) {
      for(let key in this.form.image_list){
        if(this.form.image_list[key].image_url === file.response.result.file_url){
          this.form.image_list.splice(key, 1);
        }
      }
    },
    beforeAvatarUpload(file){
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
    delImgList(index){
      this.form.image_list.splice(index, 1);
    },
    // 获取当前时间  createtime
    getCurrentTime: function (){
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      let hour = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = `${year}-${month}-${strDate}\xa0${hour}:${minutes}:${seconds}`
      return currentdate;
    },
    // 获取当前年月日  stat_date
    getStatDate: function (){
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
     
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let statDate = `${year}${month}${strDate}`;
      return statDate;
    },
    saveContent(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          let userData = JSON.parse(this.form.user_data);
          this.form.member_id = userData.member_id;
          this.form.nickname = userData.nickname;
          this.form.head_img = userData.head_img;
          let chatroomData = JSON.parse(this.form.chatroom);
          this.form.chatroom_id = chatroomData.chatroom_id;
          this.form.chatroom_name = chatroomData.chatroom_name;
          if(this.form.upload_type == 1){
            //上传图片
            this.form.video_list.length = 0;
          }else if (this.form.upload_type == 2){
            this.form.image_list.length = 0;
          }
          if(this.editId == 0){
            this.form.content_id = uuidv1();
            this.form.vcserialno = uuidv1();
            this.form.createtime = this.getCurrentTime();
            this.form.stat_date = this.getStatDate();
          }
          this.addPraiseContent();
        } else {
          this.$message.warning('请填写必填信息哦');
          return false;
        }
      });
    },
    addPraiseContent(){
      addPraiseContent(this.form).then(res => {
        if(res.code == 200){
          this.$message.success('保存成功');
          this.addAlert = false;
          this.getPraiseContent();
        }
      })
    },
    previewPic(index, imgList){
      this.srcList = imgList;
      this.srcPic = this.srcList[index].image_url;
      this.currentIndex = index;
      this.picAlert = true;
    },
    handlePic(){
      this.picAlert = false;
    },
    prevPic(index){
      if(this.currentIndex>0){
        this.currentIndex = this.currentIndex-1;
        this.srcPic = this.srcList[this.currentIndex].image_url;
      }
    },
    nextPic(index){
      if(this.currentIndex<this.srcList.length){
        this.currentIndex = this.currentIndex+1;
        this.srcPic = this.srcList[this.currentIndex].image_url;
      }
    },
    editStatus(content_id){
      getPraiseContent({page_no:1,page_size:10,content_id}).then(res => {
        if(res.code == 200){
          const data = res.result.rows[0];
          this.editId = 1;
          for(let key in data){
            for(let item in this.form){
              if(key == item){
                this.form[item] = data[key];
              }
            }
          }
          this.groupParams.item_id = data.praise_id;
          this.getChatroomRelation();
          this.form.chatroom = `{"chatroom_id":"${data.chatroom_id}","chatroom_name":"${data.chatroom_name}"}`;
          if(data.image_list.length>0){
            this.form.upload_type = '1';
          }
          if(data.video_list.length>0){
            this.form.upload_type = '2'
          }
          this.memberParams.chatroom_id = data.chatroom_id;
          this.getMember();
          this.form.user_data = `{"member_id":"${data.member_id}","nickname":"${data.nickname}","head_img":"${data.head_img}"}`;
          this.addAlert = true;
        }
      })
    },
    handleChatroom(){
      this.form.member_id = "";
      this.form.user_data = "";
      this.memberParams.chatroom_id = this.form.chatroom ? JSON.parse(this.form.chatroom).chatroom_id :'';
      if(this.memberParams.chatroom_id){
        this.getMember();
      }
    }
  }
}
</script>

<style lang="scss">
.app_container-detail{
  padding: 20px;
  .margin-20{
    margin-left:20px;
  }
  .title-header{
    margin-bottom: 20px;
  }
  .head-img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }
  .sheet-details{
    .upload_img .el-upload--picture-card{
      width: 80px;
      height: 80px;
      line-height: 80px;
    }
    .el-upload-list--picture-card .el-upload-list__item{
      width: 80px;
      height: 80px;
    }
  }
  .src-pic{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn-pic{
    margin-top: 20px;
    display: flex;
    justify-content: space-evenly;
  }

  .banner-img-wrap {
    display: inline-block;
    margin-right: 10px;
    position: relative;
    cursor: pointer;
    .banner-img {
      height: 100%;
    }
    .banner-img-remove {
      z-index: 20;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-size: 30px;
      display: none;
      background-color: rgba($color: #000000, $alpha: 0.2);
      height: 80px;
      width: 80px;
      .el-icon-delete {
        z-index: 10;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        // color: #000000;
      }
      .el-icon-delete:hover {
        color: #1989fa;
      }
    }
    &:hover > .banner-img-remove {
      display: block;
      // background-color: #fff;
    }
  }
  .pic-center{
    margin-top: 10px;
  }
  .head-pic{
    width: 60px;
    height: 60px;
    cursor: pointer;
  }
  .tips{
    color:red;
    font-size:14px;
  }



}
</style>
