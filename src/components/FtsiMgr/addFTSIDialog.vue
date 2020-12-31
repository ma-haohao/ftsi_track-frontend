<template>
  <el-dialog
      title="Add new FTSI"
      :visible.sync="dialogVisible"
      width="800px" :close-on-click-modal="false" @close="addDialogClose">
    <!--  main content  -->
    <span>
      <el-form ref="addFormRef" label-width="150px" :model="addForm" :rules="addFormRules">
        <!--   FTSI号区域     -->
        <el-form-item label="FTSI Number" prop="FTSI_num">
          <el-row :gutter="0">
            <el-col :span="9">
              <el-input class="shortInputForm" v-model="addForm.FTSI_num"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary">Check</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <!--   版本号区域     -->
        <el-form-item label="Rev." prop="revision" class="required">
          <el-input class="shortInputForm" v-model="addForm.revision"></el-input>
        </el-form-item>
        <!--   FTSI title区域     -->
        <el-form-item label="FTSI Title" v-show="true">
          <el-input type="textarea" class="longInputForm" v-model="addForm.FTSI_title"></el-input>
        </el-form-item>
        <!--   Compliance Statement区域     -->
        <el-form-item label="Compliance Stat.">
          <el-input type="textarea" class="longInputForm" v-model="addForm.compliance"></el-input>
        </el-form-item>
        <!--   监控类型区域     -->
        <el-form-item label="Monitor Type" prop="type" class="required">
          <el-select placeholder="Please choice" v-model="addForm.type" @change="monitorTypeCheck">
            <el-option v-for="item in monitorType" :label="item[1]" :value="item[0]"></el-option>
          </el-select>
        </el-form-item>
        <!--    当type为customize时格外产生的表单内容   -->
        <div v-show="showCustomizeForm" class="customizeForm">
          <!--   初始激活项       -->
          <el-form-item label="Trigger">
            <el-col :span="9">
              <el-form-item>
                <el-select placeholder="Please choice" v-model="addForm.customizePara.trigger.type">
                  <el-option v-for="item in triggerType" :label="item[1]" :value="item[0]"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <el-form-item label="Parameter">
                <el-input class="shortInputForm" v-model="addForm.customizePara.trigger.parameter"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <!--  customize中可增加的monitor type(动态), 最大数量为3  -->
          <div v-for="(item,index) in addForm.customizePara.monitorParam" :key="item.key">
              <el-form-item :label="'Monitor Type '+(index+1)">
                  <el-form-item>
                    <el-select placeholder="Please choice" v-model="item.type">
                      <el-option v-for="item in monitorType.slice(0,-1)" :label="item[1]" :value="item[0]"></el-option>
                    </el-select>
                    <el-button type="info" style="margin-left: 20px" @click="deleteCusMonitor">Delete</el-button>
                  </el-form-item>
              </el-form-item>
              <el-form-item label="Period">
                <el-col :span="9">
                  <el-form-item>
                    <el-input class="shortInputForm" v-model="item.period"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="13">
                  <el-form-item label="Total Times">
                    <el-input class="shortInputForm" v-model="item.times"></el-input>
                  </el-form-item>
                </el-col>
              </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="addCusMonitor">add Monitor</el-button>
          </el-form-item>
        </div>
        <div v-show="!showCustomizeForm">
          <!--   执行周期区域     -->
          <el-form-item label="Period">
            <el-col :span="9">
              <el-form-item>
                <el-input class="shortInputForm" v-model="addForm.period"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <!--   执行频率区域     -->
              <el-form-item label="Total Times">
                <el-input class="shortInputForm" v-model="addForm.times"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </div>

        <!--   Applied IPS区域     -->
        <el-form-item label="Applied IPS" prop="appliedIPS">
          <el-transfer :titles="['Unapplied','Applied']" v-model="addForm.appliedIPS" :data="IPSdata"></el-transfer>
        </el-form-item>
      </el-form>
    </span>
    <!--  foot area  -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="addFTSI">Submit</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "addFTSI",
  data() {
    const generateIPSData = _ => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: 600100 + i,
          label: `${600100 + i}`,
        });
      }
      return data;
    };
    return {
      IPSdata: generateIPSData(),
      dialogVisible: false,
      activeDisabled: false,
      monitorType: [], /*监控的类型*/
      triggerType: [], /*FTSI的激活类型*/
      showCustomizeForm: false, /*激活自定义类型所需的表单*/
      addForm: {
        FTSI_num: '',
        revision: '',
        FTSI_title: '',
        compliance: '',
        type: '',
        period: '',
        times: '',
        appliedIPS: [],
        customizePara: {
          trigger: {
            type: 'NO',
            parameter: ''
          },
          monitorParam:[{
            type: '',
            period: '',
            times: '',
          }]
        }
      },
      addFormRules: {
        FTSI_num: [
          {required: true, message: 'please enter the FTSI number', trigger: 'blur'},
        ],
        revision: [
          {required: true, message: 'please enter the Revision', trigger: 'blur'},
        ],
        type: [
          {required: true, message: 'please choose the monitor type', trigger: 'change'},
        ],
        times: [
          {required: true, message: 'please enter total implement times', trigger: 'blur'},
        ],
        appliedIPS: [
          {required: true, message: 'At least one IPS must be chosen', trigger: 'change'},
        ],
      }
    }
  },
  methods: {
    init() {
      this.dialogVisible = true;
      this.getTypeAddFTSI()
    },
    //监听添加对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
      this.showCustomizeForm = false
    },
    //获取添加FTSI时下拉菜单的权限
    async getTypeAddFTSI() {
      const {data: res} = await this.$http.get('ftsiMgr/paraforAddFTSI/')
      if (res.meta.status !== 200) this.$message.error('failed to get the type list')
      this.monitorType = res.data.monitorType
      this.triggerType = res.data.triggerType
    },
    monitorTypeCheck() {
      if (this.addForm.type === 'CUS') {
        return this.showCustomizeForm = true
      } else this.showCustomizeForm = false
    },
    addCusMonitor(){
      if(this.addForm.customizePara.monitorParam.length>2) return this.$message.error('The amount must be no more than 3!')
      this.addForm.customizePara.monitorParam.push({
        type: '',
        period: '',
        times: '',
      })
    },
    deleteCusMonitor(item,index){
      this.index = this.addForm.customizePara.monitorParam.indexOf(item)
      if (index !== -1) {
        this.addForm.customizePara.monitorParam.splice(index, 1)
      }
    },
    //点击按钮，添加新的FTSI
    addFTSI() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        //可以发起添加请求
        const {data: res} = await this.$http.post('ftsiMgr/addFTSI/', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.dialogVisible = false
        this.$parent.getFTSIList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.shortInputForm {
  width: 193px;
}

.longInputForm {
  width: 580px;
}

.customizeForm {
  margin-left: 30px;
}
</style>
