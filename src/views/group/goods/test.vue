<template>
  <div class="app-container">
    <div>顶顶顶顶</div>
    <table class="table">
      <tr v-for="(item,index) in properties" :key="index">
        <td>
          <strong>{{item.Name}}：</strong>
        </td>
        <td>
          <label v-for="(value,idx) in item.values" :key="idx">
            <input type="checkbox" :value="value" v-model="item.selectedValues">
            {{value.Name}}
          </label>

          <!-- <table class="list_table" v-if="item.Name!='发货地'&&item.selectedValues.length>0">
            <tbody>
              <tr>
                <th>{{item.Name}}</th>
                <th>自定义名称</th>
                <th v-if="item.Name=='颜色'">图片（无图片可以不填）</th>
              </tr>

              <tr v-for="selectedValue in item.selectedValues">
                <td>{{selectedValue.Name}}</td>
                <td>
                  <input type="text" v-model="selectedValue.DefinitionName" maxlength="20">
                </td>
                <td v-if="item.Name=='颜色'">
                  <div style="float: left">
                    <input type="file" style="width: 63px;">
                  </div>
                  <div style="float: right">
                    <a href rel="link" target="_blank">
                      <img :src="selectedValue.ImageUrl" width="30" height="35">
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>-->
        </td>
      </tr>
      <tr>
        <td align="right"></td>
        <td>
          <p class="c_a4">下表的零售价是最终展示给买家的产品价格。</p>
          <table id="skuPrice_table" class="product_list_table break-word mt_0">
            <tbody>
              <tr>
                <td colspan="4">
                  批量设置零售价：US $
                  <input type="text" id="batchPrice" maxlength="9">
                  <input type="button" onclick="batchSetPrice()" value="确定"> 批量设置库存：
                  <input type="text" id="batchStockQuantity" maxlength="9">
                  <input type="button" onclick="batchSetStockQuantity()" value="确定">
                </td>
              </tr>
              <tr>
                <th v-for="(item,index) in properties" :key="index" v-if="item.selectedValues.length>0">{{item.Name}}</th>
                <th>
                  <span class="c_red">*</span>零售价
                </th>
                <th>
                  <span class="c_red">*</span>库存
                </th>
                <th>商品编码</th>
              </tr>
              <tr v-for="(sku,skuIndex) in skus" :key="skuIndex">
                <td v-for="(item,idx) in properties" :key="idx" v-if="item.selectedValues.length>0">{{getValueName(sku,item)}}</td>
                <td>
                  US $
                  <input type="text" v-model="sku.SkuPrice" class="w50" maxlength="9">
                  <span name="productUnitTips"></span>
                </td>
                <td>
                  <input type="text" v-model="sku.StockQuantity" class="w50" maxlength="9">
                </td>
                <td>
                  <input type="text" v-model="sku.SkuCode" class="w180" maxlength="20">
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>
    {{skusResult}}
    {{propertyResult}}
    <el-form>
      <el-row>
        <el-form-item label="商品规格：">
          <el-row v-for="(item, index) in specMore" :key="index">
            <!-- 规格名 -->
            <el-row style="margin-top:20px;">
              <el-col :span="2">规格名：</el-col>
              <el-col :span="6">
                <el-select v-model="specMore[index].id" filterable clearable allow-create default-first-option
                  placeholder="请选择规格名" value-key="sku_kid" @change="changeSpecName(index)">
                  <el-option v-for="checkItem in specOptions" :key="checkItem.sku_kid"
                    :label="checkItem.sku_k" :value="checkItem"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <!-- 规格值 -->

            <el-row style="margin-top:20px;">
              <el-col :span="2">规格值{{index}}：</el-col>
              <el-col :span="4" v-for="(valueItem,valueIndex) in specMore[index].value" :key="valueIndex">
                <!-- {{valueItem + 'valueItem'}} -->
                <el-select v-model="specMore[index].value[valueIndex]" filterable clearable allow-create
                  default-first-option value-key="sku_vid" placeholder="请选择规格值"
                  @change="handleSpecValue(index, valueIndex)">
                  <el-option v-for="sItem in options[index]" :key="sItem.sku_vid" :label="sItem.sku_v"
                    :value="sItem"></el-option>
                </el-select>
              </el-col>

              <el-col :span="2">
                <el-button type="text" @click="addSpecValue(index)">添加规格值</el-button>
              </el-col>
            </el-row>
          </el-row>
          <el-row style="margin-top:20px;">
            <el-button v-if="specMore.length<=2" size="mini" @click="addSpecProject">添加规格项目</el-button>
          </el-row>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getGoodsDetail } from "@/api/group";
import {
  getSkuList,
  getSkuValueList,
  addItemContent,
  addItemInfo,
  addSkuProject,
  addSkuValue,
  getEduGoods
} from "@/api/qecode";
function descartes(list) {
  // console.log(list)
  //parent上一级索引;count指针计数
  var point = {};
  var result = [];
  var pIndex = null;
  var tempCount = 0;
  var temp = [];
  //根据参数列生成指针对象
  console.log(JSON.stringify(list), 'list')
  for (var index in list) {

    if (typeof list[index] == 'object') {
      point[index] = { 'parent': pIndex, 'count': 0 }
      pIndex = index;
    }
  }
  //单维度数据结构直接返回
  if (pIndex == null) {
    return list;
  }
  //动态生成笛卡尔积
  while (true) {
    for (var index in list) {
      tempCount = point[index]['count'];
      temp.push(list[index][tempCount]);
    }
    //压入结果数组
    result.push(temp);
    temp = [];
    //检查指针最大值问题
    while (true) {
      if (point[index]['count'] + 1 >= list[index].length) {
        point[index]['count'] = 0;
        pIndex = point[index]['parent'];
        if (pIndex == null) {
          // console.log('笛卡尔积：', result)
          return result;
        }
        //赋值parent进行再次检查
        index = pIndex;
      }
      else {
        point[index]['count']++;
        break;
      }
    }
  }
}
export default {
  data() {
    return {
      list: [{ "sku1_k": "阅读营期", "sku1_kid": 15, "spec": [{ "sku1_v": "阅读33期", "sku1_vid": 13 }, { "sku1_v": "阅读31期", "sku1_vid": 11 }], "price": "", "number": "", "specLen": 2, "rowspan": 2 }, { "sku1_k": "辅导员", "sku1_kid": 1, "spec": [{ "sku1_v": "张老师", "sku1_vid": 2 }, { "sku1_v": "王老师", "sku1_vid": 3 }], "price": "", "number": "", "specLen": 2, "rowspan": 1 }],
      // 规格值数据
      specOptions: [],
      specMore: [{ id: "", value: [""] }],
      options: [],
      properties: [
        {
          Id: 10,
          Name: '材质',
          values: [
            {
              PropertyId: 10,
              Id: 351785,
              Name: 'ABS',

            },
            {
              PropertyId: 10,
              Id: 477,
              Name: '铝',

            },
            {
              PropertyId: 10,
              Id: 529,
              Name: '帆布',

            },
            {
              PropertyId: 10,
              Id: 365211,
              Name: '棉布',

            },
            {
              PropertyId: 10,
              Id: 365212,
              Name: '斜纹布',

            },
            {
              PropertyId: 10,
              Id: 395,
              Name: 'EVA',

            },
            {
              PropertyId: 10,
              Id: 396,
              Name: '皮革',

            },
            {
              PropertyId: 10,
              Id: 365213,
              Name: '微纤维',

            },
            {
              PropertyId: 10,
              Id: 1064,
              Name: '合成橡胶',

            },
            {
              PropertyId: 10,
              Id: 63,
              Name: '尼龙',

            },
            {
              PropertyId: 10,
              Id: 437,
              Name: 'PE',

            },
            {
              PropertyId: 10,
              Id: 124,
              Name: '塑料',

            },
            {
              PropertyId: 10,
              Id: 48,
              Name: '涤纶',

            },
            {
              PropertyId: 10,
              Id: 438,
              Name: 'PP',

            },
            {
              PropertyId: 10,
              Id: 452,
              Name: 'PU',

            },
            {
              PropertyId: 10,
              Id: 439,
              Name: 'PVC',

            },
            {
              PropertyId: 10,
              Id: 1170,
              Name: '硅胶',

            },
            {
              PropertyId: 10,
              Id: 352621,
              Name: 'Vinyl',

            },
            {
              PropertyId: 10,
              Id: 1042,
              Name: '真皮',

            },
            {
              PropertyId: 10,
              Id: 1179,
              Name: 'TPU',

            },
            {
              PropertyId: 10,
              Id: 4,
              Name: '其它',

            },
            {
              PropertyId: 10,
              Id: 501,
              Name: 'PC',

            },
            {
              PropertyId: 10,
              Id: 201662808,
              Name: 'PC + TPU',

            }
          ],
          selectedValues: []
        },
        {
          Id: 14,
          Name: '颜色',
          values: [
            {
              PropertyId: 14,
              Id: 771,
              Name: '米色',
              DefinitionName: 'Transparent',
              ImageUrl:
                'https://g04.a.alicdn.com/kf/HTB1B0TWOVXXXXalXVXXq6xXFXXXn.jpg'
            },
            {
              PropertyId: 14,
              Id: 193,
              Name: '黑色',
              DefinitionName: 'Mixture',
              ImageUrl:
                'https://g01.a.alicdn.com/kf/HTB13ZPMOVXXXXa2aXXXq6xXFXXXU.jpg'
            },
            {
              PropertyId: 14,
              Id: 173,
              Name: '蓝色',
              DefinitionName: 'Random',
              ImageUrl:
                'https://g02.a.alicdn.com/kf/HTB1pC_COVXXXXakapXXq6xXFXXXU.jpg'
            },
            {
              PropertyId: 14,
              Id: 1254,
              Name: '天蓝色',
              DefinitionName: 'Brown',
              ImageUrl:
                'https://g03.a.alicdn.com/kf/HTB1wj3lOVXXXXaxXXXXq6xXFXXX9.jpg'
            },
            {
              PropertyId: 14,
              Id: 365458,
              Name: '褐色',
              DefinitionName: 'Purple',
              ImageUrl:
                'https://g01.a.alicdn.com/kf/HTB1SPcjOVXXXXcrXXXXq6xXFXXX5.jpg'
            },
            {
              PropertyId: 14,
              Id: 100018786,
              Name: '透明',
              DefinitionName: 'Blue',
              ImageUrl:
                'https://g01.a.alicdn.com/kf/HTB1L9vDOVXXXXXAapXXq6xXFXXXY.jpg'
            },
            {
              PropertyId: 14,
              Id: 350850,
              Name: '金色',
              DefinitionName: 'Cyan',
              ImageUrl:
                'https://g02.a.alicdn.com/kf/HTB1TCcjOVXXXXaUXXXXq6xXFXXX8.jpg'
            },
            {
              PropertyId: 14,
              Id: 691,
              Name: '灰色',

            },
            {
              PropertyId: 14,
              Id: 200004890,
              Name: '深灰色',

            },
            {
              PropertyId: 14,
              Id: 175,
              Name: '绿色',

            },
            {
              PropertyId: 14,
              Id: 200004889,
              Name: '军绿色',

            },
            {
              PropertyId: 14,
              Id: 200002130,
              Name: '象牙白',

            },
            {
              PropertyId: 14,
              Id: 200001438,
              Name: '卡其色',

            },
            {
              PropertyId: 14,
              Id: 200003699,
              Name: '多色',

            },
            {
              PropertyId: 14,
              Id: 350852,
              Name: '橙色',

            },
            {
              PropertyId: 14,
              Id: 1052,
              Name: '粉色',

            },
            {
              PropertyId: 14,
              Id: 496,
              Name: '紫色',

            },
            {
              PropertyId: 14,
              Id: 200004891,
              Name: '紫罗兰',

            },
            {
              PropertyId: 14,
              Id: 10,
              Name: '红色',

            },
            {
              PropertyId: 14,
              Id: 350853,
              Name: '银色',

            },
            {
              PropertyId: 14,
              Id: 29,
              Name: '白色',

            },
            {
              PropertyId: 14,
              Id: 366,
              Name: '黄色',

            },
            {
              PropertyId: 14,
              Id: 201447303,
              Name: '玫瑰色',

            },
            {
              PropertyId: 14,
              Id: 201447325,
              Name: '深红',

            },
            {
              PropertyId: 14,
              Id: 201447326,
              Name: '深蓝',

            },
            {
              PropertyId: 14,
              Id: 202007806,
              Name: '磨砂黑',

            }
          ],
          selectedValues: []
        },
        {
          Id: 200007763,
          Name: '发货地',
          values: [
            {
              PropertyId: 200007763,
              Id: 201336100,
              Name: 'CN',

            },
            {
              PropertyId: 200007763,
              Id: 201336106,
              Name: 'US',

            },
            {
              PropertyId: 200007763,
              Id: 201336105,
              Name: 'UK',

            },
            {
              PropertyId: 200007763,
              Id: 201336101,
              Name: 'DE',

            },
            {
              PropertyId: 200007763,
              Id: 201336104,
              Name: 'ES',

            },
            {
              PropertyId: 200007763,
              Id: 201336099,
              Name: 'AU',

            },
            {
              PropertyId: 200007763,
              Id: 201336103,
              Name: 'RU',

            },
            {
              PropertyId: 200007763,
              Id: 201336102,
              Name: 'ID',

            },
            {
              PropertyId: 200007763,
              Id: 201336342,
              Name: 'FR',

            },
            {
              PropertyId: 200007763,
              Id: 201336343,
              Name: 'IT',

            }
          ],
          selectedValues: []
        },
        {
          Id: 200000828,
          Name: '套餐',
          values: [
            {
              PropertyId: 200000828,
              Id: 201655809,
              Name: '壳＋贴膜',

            },
            {
              PropertyId: 200000828,
              Id: 201655810,
              Name: '壳＋挂绳',

            }
          ],
          selectedValues: []
        }
      ],

      checkedProperties: [
        {
          Id: 14,
          Name: '颜色'
        }
      ],
      skus: [{ "SkuCode": "", "SkuPrice": "", "StockQuantity": "", "values": [{ "propertyId": 14, "valueId": 175 }, { "propertyId": 200007763, "valueId": 201336106 }] }, { "SkuCode": "", "SkuPrice": "", "StockQuantity": "", "values": [{ "propertyId": 14, "valueId": 175 }, { "propertyId": 200007763, "valueId": 201336343 }] }, { "SkuCode": "", "SkuPrice": "", "StockQuantity": "", "values": [{ "propertyId": 14, "valueId": 200004891 }, { "propertyId": 200007763, "valueId": 201336106 }] }, { "SkuCode": "", "SkuPrice": "", "StockQuantity": "", "values": [{ "propertyId": 14, "valueId": 200004891 }, { "propertyId": 200007763, "valueId": 201336343 }] }]
    }
  },
  created() {
    this.getSkuList();
    // descartes(this.list)
  },
  computed: {
    allCheckedLength: function () {
      var length = 0
      this.properties.forEach(function (item) {
        length += item.selectedValues.length
      })
      return length
    },
    skusResult: function () {
      return JSON.stringify(this.skus)
    },
    propertyResult: function () {
      var result = []
      this.properties.forEach(function (item) {
        item.selectedValues.forEach(function (item) {
          result.push(item)
        })
      })
      return JSON.stringify(result)
    }
  },
  watch: {
    allCheckedLength: {
      handler: 'reBuild'
    }
  },
  methods: {
    //获取sku 规格列表
    getSkuList() {
      getSkuList().then(res => {
        if (res.code == 200) {
          this.specOptions = res.result;
        }
      });
    },
    //添加规格项目
    addSpecProject() {
      if (this.specMore.length <= 2) {
        this.specMore.push({ id: "", value: [''] });
      }
    },
    // 选择规格名
    changeSpecName(index) {
      // console.log(index, "取值");

      const clearValue = this.specMore[index].value;
      for (let i = 0; i < clearValue.length; i++) {
        clearValue[i] = '';
      }

      //创建规格名 
      // if(typeof(this.specMore[index].id) === 'string' && this.specMore[index].id != ''){
      //   // 添加sku规格项
      //   const createItem = {
      //     sku_k: this.specMore[index].sku_k
      //   }
      //   addSkuProject(createItem).then((res) => {
      //     if(res.code == 200){
      //       this.seleteValue(index);
      //       this.$message({
      //         type:'success',
      //         message: '创建成功'
      //       })
      //     }
      //   })
      // } 
      this.seleteValue(index);
    },
    // 获取规格值list
    seleteValue(index) {
      const map = {
        sku_kid: this.specMore[index].id.sku_kid
      };
      getSkuValueList(map).then(res => {
        if (res.code == 200) {
          const list = res.result;
          this.$set(this.options, index, list)
        }
      });
    },
    //添加规格值
    addSpecValue(index) {
      this.specMore[index].value.push('')
    },
    // 选择规格值
    handleSpecValue(index, valueIndex) {
      const specMore = this.specMore[index].value;

      if (typeof (specMore[valueIndex]) === 'string' && specMore[valueIndex]) {
        //创建规格值
        const createValue = {
          sku_v: specMore[valueIndex],
          sku_kid: this.specMore[index].id
        }
        addSkuValue(createValue).then(res => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.seleteValue(index);
          }
        })
      }

      let count = 0;
      specMore.forEach(item => {
        if (specMore[valueIndex] == item) {
          count++;
        }
      })
      if (count >= 2) {
        this.$message({
          type: 'error',
          message: '选择重复'
        })
        specMore[valueIndex] = '';
      }
    },



    reBuild: function (val, oldVal) {
      // console.log(434324234)
      var vm = this
      var oriSkus = JSON.parse(JSON.stringify(this.skus))
      var vmSkus = (this.skus = [])
      var propertyChecked = []
      var skuCount = 1
      var ori = []
      this.properties.forEach(function (item, index) {
        // console.log(item, 'item')
        var selectValues = item.selectedValues

        if (selectValues.length > 0) {
          propertyChecked.push(index)
          skuCount *= selectValues.length
          ori.push(selectValues)
        }
      })
      /*$.each(propertyChecked,
                        function () {
                            ori.push(vm.properties[this].selectedValues);
                        });*/
      // console.log(JSON.stringify(ori), 'ori')
      var ret = descartes(ori)
      // console.log(ret, 'ret-----------')
      // console.log(JSON.stringify(ret), 'ret+++++++++')
      for (var i = 0; i < ret.length; i++) {
        var sku = { SkuCode: '', SkuPrice: '', StockQuantity: '' }
        sku.values = []
        ret[i].forEach(function (item) {
          // console.log('哈哈哈item:', item)
          sku.values.push({ propertyId: item.PropertyId, valueId: item.Id })
        })
        if (oriSkus.length >= ret.length) {
          sku.SkuCode = oriSkus[i].SkuCode
          sku.SkuPrice = oriSkus[i].SkuPrice
          sku.StockQuantity = oriSkus[i].StockQuantity
        } else {
          if (i < oriSkus.length) {
            sku.SkuCode = oriSkus[i].SkuCode
            sku.SkuPrice = oriSkus[i].SkuPrice
            sku.StockQuantity = oriSkus[i].StockQuantity
          } else {
            sku.SkuCode = ''
            sku.SkuPrice = ''
            sku.StockQuantity = ''
          }
        }
        vmSkus.push(sku)
      }
      // console.log(JSON.stringify(vmSkus), 'vmSkus')
    },
    getValueName: function (sku, property) {
      var valueName = ''
      sku.values.forEach(function (item) {
        // var _this = this
        if (item.propertyId == property.Id) {
          property.selectedValues.forEach(function (itemValue) {
            if (item.valueId == itemValue.Id) {
              valueName = itemValue.Name
              return false
            }
          })
        }
      })
      return valueName
    }
  }
}
</script>
<style lang="scss" scoped>
table {
  border-collapse: collapse;
}

table th {
  background-color: antiquewhite;
}

table td,
th {
  border: solid 1px #b4aba1;
}

.table label {
  margin-left: 30px;
  float: left;
  width: 150px;
}

.table label input {
  margin-top: 4px;
}

.table td {
  min-width: 100px;
}

.list_table {
  clear: both;
  margin-left: 30px;
  margin-top: 10px;
}
</style>
