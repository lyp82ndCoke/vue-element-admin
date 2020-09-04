<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
        <el-col :span="24" class="title">如何加入好妈妈代言人</el-col>
        <el-col :span="10" class="left-box">
          <div style="height: 200px;">
            <el-steps direction="vertical" :active="2">
              <el-step title="第一步"></el-step>
              <el-step title="第二步"></el-step>
            </el-steps>
            <div class="goods">
              <ul>
                <li v-for="item in itemList" :key="item.id">
                  {{item.remarks}}
                </li>
              </ul>
            </div>
            <div class="cards">
              <ul>
                <li v-for="item in cardList" :key="item.card_task_id">
                  {{item.remarks}}
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      
        <el-col :span="13" class="right-box">
          <el-tabs type="border-card">
            <el-tab-pane label="下单任务">
              <el-col :span="24">
                <el-col :span="24" :xs="10">
                  <el-button size="small" type="text"  @click="addGoods()">添加</el-button>
                </el-col>
                <el-col :span="24" class="title-content">
                  <el-table
                    v-loading="listLoading"
                    :data="itemList"
                    element-loading-text="Loading"
                    border
                    height="250"
                    fit
                    size='mini'
                    highlight-current-row>
                    <el-table-column label="商品名称" prop="item_name" align="center" width="220">
                    </el-table-column>
                    <el-table-column label="任务说明" prop="remarks" align="center">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
                      <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="editItem(scope.row)">编辑</el-button>
                        <el-button size="mini" type="text" @click="delItem(scope.row.item_task_id)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-col>  
            </el-tab-pane>

            <el-tab-pane label="礼品卡任务">
              <el-col :span="24">
                <el-col :span="24" :xs="10">
                  <el-button size="small" type="text"  @click="addCards()">添加</el-button>
                </el-col>
                <el-col :span="24" class="title-content">
                  <el-table
                    v-loading="listLoading"
                    :data="cardList"
                    element-loading-text="Loading"
                    border
                    height="250"
                    fit
                    size='mini'
                    highlight-current-row>
                    <el-table-column label="礼品卡名称" prop="item_name" align="center" width="250">
                    </el-table-column>
                    <el-table-column label="任务说明" prop="remarks" align="center">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
                      <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="editCard(scope.row)">编辑</el-button>
                        <el-button size="mini" type="text" @click="delCard(scope.row.card_task_id)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </el-col>
            
        <el-col :span="24" class="title">爱心值来源配置</el-col>
        <el-col :span="10" class="heart-box" style="margin:0 0 15px 5px;border:1px solid #eee;border-radius:5px;">
          <div class="top tables">粉丝每领取一张卡代言人即可获得<el-input placeholder="爱心值" v-model="formInline.each_draw" style="width: 150px;margin:0 10px"></el-input>爱心值</div>
          <div class="top tables">粉丝每使用一张卡代言人即可获得<el-input placeholder="爱心值" v-model="formInline.each_use" style="width: 150px;margin:0 10px"></el-input>爱心值</div>
          <div class="bot tables">
            代言人自己每消费<el-input placeholder="爱心值" v-model="formInline.each_consume_amount" style="width: 90px;margin:0 10px"></el-input>元
            获得<el-input placeholder="爱心值" v-model="formInline.each_consume_score" style="width: 90px;margin:0 10px"></el-input>爱心值
          </div>
          <div class="bot2 tables">
            粉丝每消费<el-input placeholder="爱心值" v-model="formInline.each_fans_consume" style="width: 90px;margin:0 10px"></el-input>元
            获得<el-input placeholder="爱心值" v-model="formInline.each_fans_score" style="width: 90px;margin:0 10px"></el-input>爱心值
          </div>
          <div class="tables buttons">
            <el-button type="primary" @click="submitForm()">保存</el-button>
          </div>
        </el-col>
    </el-col>
  </div>
</template>

<script>
import { updateScoreRule,getScoreRule,getSpokesRuleList,deleteSpokesRule } from "@/api/spokesperson";
import Pagination from "@/components/Pagination";
import Sticky from "@/components/Sticky";
import Request from "@/utils/request";
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      listLoading: true,
      formInline:{
        each_draw: '',
        each_use: '',
        each_consume_amount: '',
        each_consume_score: '',
        each_fans_consume: '',
        each_fans_score: '',
      },
      showAlert: false,
      cardList:[],
      itemList:[],
    };
  },
  created() {
    this.goodsListId = this.$route.params.id;
    //获取树形 结构
    this.getScoreRule();
    this.getSpokesRuleList();
  },
  mounted(){
    sessionStorage.clear();
  },
  methods: {
    getSpokesRuleList(){
      this.listLoading = true;
      getSpokesRuleList().then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.cardList = res.result.card_task;
          this.itemList = res.result.item_task;
          // console.log('this.cardList',this.cardList)
          // console.log('this.itemList',this.itemList)
        }
      });
    },
    getScoreRule(){
      this.listLoading = true;
      getScoreRule().then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.formInline.each_draw = res.result.each_draw.score;
          this.formInline.each_use = res.result.each_use.score;
          this.formInline.each_fans_consume = res.result.each_fans_consume.each_consume_amount;
          this.formInline.each_fans_score = res.result.each_fans_consume.score;
          this.formInline.each_consume_score = res.result.each_consume.score;
          this.formInline.each_consume_amount = res.result.each_consume.each_consume_amount;
        }
      });
    },
    submitForm(){
      let params = {
        each_draw: {
          "score": this.formInline.each_draw
        },
        each_use: {
          "score": this.formInline.each_use
        },
        each_consume: {
          each_consume_amount: this.formInline.each_consume_amount,
          score: this.formInline.each_consume_score
        },
        each_fans_consume: {
          each_consume_amount: this.formInline.each_fans_consume,
          score: this.formInline.each_fans_score
        }
      }
      updateScoreRule(params).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.getScoreRule();
        }
      });
    },
    addGoods(){
      this.$router.push({ path: `./goodsRules/${0}` })
    },
    editItem(data){
      sessionStorage.setItem('editItem',JSON.stringify(data))
      this.$router.push({ path: `./goodsRules/${data.item_task_id}` })
    },
    delItem(id){
      deleteSpokesRule({ task_id:id,task_type:1 }).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getSpokesRuleList();
        }
      });
    },
    addCards(){
      this.$router.push({ path: `./cardRules/${0}` })
    },
    editCard(data){
      sessionStorage.setItem('editCard',JSON.stringify(data))
      this.$router.push({ path: `./cardRules/${data.card_task_id}` })
    },
    delCard(id){
      deleteSpokesRule({ task_id:id,task_type:2 }).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getSpokesRuleList();
        }
      });
    },
    goDetail() {},
    start() {},
    stop() {},
    alertShow() {
      this.showAlert = true;
    }
  }
};
</script>
<style lang="scss">
.app-container {
  position: relative;
  padding: 0 0 20px;
  .table-wrap {
    // padding:0 20px;
    .title {
      font-weight: 500;
      padding: 10px 10px;
      border-bottom: 1.5px solid #DCDFE6;
      margin-bottom: 10px;
    }
    .left {
      &-box {
        height: 400px;
        box-sizing: border-box;
        margin: 0 20px;
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 10px;
        position: relative;
        .goods{
          position: absolute;
          top: -3px;
          left: 95px;
          height: 180px;
          width: 70%;
          overflow: hidden;
          ul{
            overflow: auto;
            height: 180px;
            width: 100%;
            li{
              height: 20px;
              width: 100%;
              line-height: 20px;
            }
          }
        }
        .cards{
          position: absolute;
          top: 160px;
          left: 95px;
          height: 150px;
          width: 70%;
          overflow: hidden;
          margin-top: 10px;
          ul{
            overflow: auto;
            height: 190px;
            width: 100%;
            li{
              height: 20px;
              width: 100%;
              line-height: 20px;
            }
          }
        }
    }
    .right {
      &-box {
        height: 380px;
        overflow-y: auto;
        margin: 10px 20px;
        padding: 10px 0;
        border-radius: 4px;
        &-title {
          padding: 10px 0;
        }
        .input-right-wrap {
          background-color: #fff;
          border-radius: 4px;
          .input-left-text {
            padding: 12px 10px;
          }
        }
        
      }
    }
  }
  
  }
  .tables{
    margin: 10px 0;
    margin-left: 20px;
  }
  .bot{
    margin-left: 30px;
  }
  .bot2{
    margin-left: 78px;
  }
  .buttons{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    margin-left: -15px;
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
    padding: 100px 150px 100px 200px;
  }
  &-content-wrap {
    border-radius: 5px;
    height: 100%;
    width: 100%;
    padding: 120px 50px;
    background-color: #fff;
    overflow-y: auto;
    .margin-top-30 {
      margin-top: 30px;
    }
  }
}
.close-alert {
  text-align: right;
  font-size: 30px;
  color: #ccc;
}

.success-btn {
  text-align: right;
}

.text_overflow {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}
</style>