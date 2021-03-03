<template>
  <el-dialog
      title="Add new FTSI"
      :visible.sync="dialogVisible"
      width="800px" :close-on-click-modal="false" @close="addDialogClose">
    <!--  main content  -->
    <span>
      <el-form ref="addFormRef" label-width="150px" :model="addForm" :rules="addFormRules">
        <!--   FTSI号区域     -->
        <el-form-item label="FTSI Number" prop="ftsi_num" class="required">
          <el-input class="shortInputForm" v-model="addForm.ftsi_num" :disabled=pendingFlag></el-input>
        </el-form-item>
        <!--   版本号区域     -->
        <el-form-item label="Rev." prop="rev" class="required">
          <el-input class="shortInputForm" v-model="addForm.rev" :disabled=pendingFlag></el-input>
        </el-form-item>
        <!--   FTSI title区域     -->
        <el-form-item label="FTSI Title" prop="ftsi_title">
          <el-input type="textarea" class="longInputForm" v-model="addForm.ftsi_title" :disabled=pendingFlag></el-input>
        </el-form-item>
        <!--   Compliance Statement区域     -->
        <el-form-item label="Compliance Stat." prop="statement">
          <el-input type="textarea" class="longInputForm" v-model="addForm.statement" :disabled=pendingFlag></el-input>
        </el-form-item>
        <!--   监控类型区域     -->
        <el-form-item label="Monitor Type" prop="dep_type" class="required">
          <el-select placeholder="Please choice" v-model="addForm.dep_type" @change="monitorTypeCheck">
            <el-option v-for="item in monitorType" :label="item[1]" :value="item[0]"></el-option>
          </el-select>
        </el-form-item>
        <!--    当type为customize时格外产生的表单内容   -->
        <div v-show="showCustomizeForm" class="customizeForm">
          <!--   初始激活项       -->
          <el-form-item label="Trigger">
            <el-col :span="9">
              <el-form-item prop="customizePara.trigger.type">
                <el-select placeholder="Please choice" v-model="addForm.customizePara.trigger.type"
                           @change="paraShowControl">
                  <el-option v-for="item in triggerType" :label="item[1]" :value="item[0]"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <div v-show="showTriggerFTSI">
                <el-form-item label="FTSI num." prop="customizePara.trigger.parameter" class="required"
                              :rules="[{required: showTriggerFTSI, message: 'please enter the related FTSI', trigger: 'blur'},
                              {validator:onlyNum}]">
                  <el-input class="shortInputForm" v-model="addForm.customizePara.trigger.parameter"></el-input>
                </el-form-item>
              </div>
              <div v-show="showTriggerDate">
                <el-form-item label="Date" prop="triggerDateForm" class="required"
                              :rules="[{required: showTriggerDate, message: 'please choose the start date', trigger: 'blur'}]">
                  <el-date-picker v-model="addForm.triggerDateForm" type="date"
                                  placeholder="Choose date"
                                  style="width:190px" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-form-item>
          <!--  customize中可增加的monitor type(动态), 最大数量为3  -->
          <div v-for="(item,index) in addForm.customizePara.monitorParam" :key="item.key">
              <el-form-item :label="'Monitor Type '+(index+1)"
                            :prop="'customizePara.monitorParam.'+index+'.type'"
                            class="required"
                            :rules="[{required: showCustomizeForm, message:'please choose the monitor type', trigger: 'change'}]">
                  <el-form-item>
                    <el-select placeholder="Please choice" v-model="item.type">
                      <el-option v-for="item in monitorType.slice(0,-1)" :label="item[1]" :value="item[0]"></el-option>
                    </el-select>
                    <el-button type="info" style="margin-left: 20px" @click="deleteCusMonitor(item)">Delete</el-button>
                  </el-form-item>
              </el-form-item>
              <el-form-item label="Period">
                <el-col :span="9">
                  <el-form-item :prop="'customizePara.monitorParam.'+index+'.period'">
                    <el-input class="shortInputForm" v-model="item.period"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="13">
                  <el-form-item label="Total Times" :prop="'customizePara.monitorParam.'+index+'.times'"
                                class="required"
                                :rules="[{required: showCustomizeForm, message:'please enter total times', trigger: 'blur'},
                                {validator:onlyNum}]">
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
              <el-form-item prop="period">
                <el-input class="shortInputForm" v-model="addForm.period"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <!--   执行频率区域     -->
              <el-form-item label="Total Times" prop="total_times" class="required"
                            :rules="[{required: !this.showCustomizeForm, message: 'please enter total times', trigger: 'blur'},
                            {validator:onlyNum}]">
                <el-input class="shortInputForm" v-model="addForm.total_times"></el-input>
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
    //自定义transfer框中的内容
    const generateIPSData = _ => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: 600100 + i,
          label: `${600100 + i}`,
        });
      }
      return data;
    }
    /*自定义校验规则区域*/
    //FTSI num rules
    var checkonlyNumRules = (rule, value, callback) => {
      const regFTSInum = /^[0-9_]*$/
      if (!regFTSInum.test(value)) {
        callback(new Error('The format of the input is illegal'))
      } else {
        callback()
      }
    }
    var checkRevRules = (rule, value, callback) => {
      const regRev = /^[A-Z]{1}$/
      if (!regRev.test(value)) {
        callback(new Error('The format of the Rev. is illegal'))
      } else {
        callback()
      }
    }
    /*参数区域*/
    return {
      IPSdata: generateIPSData(),
      dialogVisible: false,
      activeDisabled: false,
      pendingFlag:false,/*请求是否来自pendingList页面*/
      monitorType: [], /*监控的类型*/
      triggerType: [], /*FTSI的激活类型*/
      /*控制部分表单元素的可视与否*/
      showCustomizeForm: false,
      showTriggerFTSI: false,
      showTriggerDate: false,
      addForm: {
        triggerDateForm: '',
        ftsi_num: '',
        rev: '',
        ftsi_title: '',
        statement: '',
        dep_type: '',
        period: '',
        total_times: '',
        appliedIPS: [],
        customizePara: {
          trigger: {
            type: 'NA',
            parameter: ''
          },
          monitorParam: [{
            type: '',
            period: '',
            times: '',
          }]
        }
      },
      addFormRules: {
        ftsi_num: [
          {required: true, message: 'please enter the FTSI number', trigger: 'blur'},
          {validator: checkonlyNumRules, trigger: 'blur'},
          {validator: this.validateFTSIexist, trigger: 'blur'},
        ],
        rev: [
          {required: true, message: 'please enter the Revision', trigger: 'blur'},
          {validator: checkRevRules, trigger: 'blur'}
        ],
        dep_type: [
          {required: true, message: 'please choose the monitor type', trigger: 'change'},
        ],
        appliedIPS: [
          {required: true, message: 'At least one IPS must be chosen', trigger: 'change'},
        ]
      }
    }
  },
  methods: {
    init() {
      this.getTypeFTSI()
    },
    initForPending(item){
      this.addForm.pending_id=item.id
      this.addForm.ftsi_num=item.ftsi_no
      this.addForm.rev=item.revision
      this.addForm.ftsi_title=item.ftsi_title
      this.addForm.statement=item.statement
      this.addForm.appliedIPS=item.impact_ips
      this.getTypeFTSI()
      this.pendingFlag=true
    },
    onlyNum(rule, value, callback) {
      const regNum = /^[0-9_-]*$/
      if (!regNum.test(value)) {
        callback(new Error('The format of the input is illegal'))
      } else {
        callback()
      }
    },
    /*验证该项是否存在原数据库中*/
    async validateFTSIexist(rule,value,callback){
      if (!value){
        return callback()
      }
      const {data:res}=await this.$http.get('ftsiMgr/FTSInumExistCheck/',{params:{ftsi_num:this.addForm.ftsi_num}})
      if (res.meta.status!==200){
        callback(new Error(res.meta.msg))
      } else{callback()}
    },
    //监听添加对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
      this.showCustomizeForm = false
      this.showTriggerFTSI = false
      this.showTriggerDate = false
    },
    //获取添加FTSI时下拉菜单的权限
    async getTypeFTSI() {
      const {data: res} = await this.$http.get('ftsiMgr/paraforAddFTSI/')
      if (res.meta.status !== 200) this.$message.error('failed to get the type list')
      this.monitorType = res.data.monitorType
      this.triggerType = res.data.triggerType
      this.dialogVisible = true;
    },
    monitorTypeCheck() {
      if (this.addForm.dep_type === 'CUS') {
        this.addForm.total_times=1
        this.addForm.period=''
        return this.showCustomizeForm = true
      } else {
        this.showCustomizeForm = false
        this.showTriggerFTSI=false
        this.showTriggerDate=false
      }
    },
    addCusMonitor() {
      if (this.addForm.customizePara.monitorParam.length > 2) return this.$message.error('The amount must be no more than 3!')
      this.addForm.customizePara.monitorParam.push({
        type: '',
        period: '',
        times: '',
      })
    },
    deleteCusMonitor(item, index) {
      var index = this.addForm.customizePara.monitorParam.indexOf(item)
      if (index !== -1) {
        this.addForm.customizePara.monitorParam.splice(index, 1)
      }
    },
    //点击按钮，添加新的FTSI
    addFTSI() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        if(this.showTriggerDate===true){this.addForm.customizePara.trigger.parameter=this.addForm.triggerDateForm}
        //可以发起添加请求
        const {data: res} = await this.$http.post('ftsiMgr/addFTSI/', this.addForm)
        if (res.meta.status !== 201) {return this.$message.error(res.meta.msg)}
        if(this.pendingFlag===true){
          const {data: res} = await this.$http.put('ftsiMgr/PendingClose/', this.addForm)
          if (res.meta.status !== 200) {this.$message.error(res.meta.msg)}
          this.$message.success(res.meta.msg)
        }
        this.dialogVisible = false
        this.$emit('updateList')
      })
    },
    //控制trigger的输入参数的显示
    paraShowControl() {
      this.addForm.customizePara.trigger.parameter = ''
      if (this.addForm.customizePara.trigger.type === 'NA') {
        this.showTriggerFTSI = false
        this.showTriggerDate = false
      } else if (this.addForm.customizePara.trigger.type === 'TFTSI') {
        this.showTriggerFTSI = true
        this.showTriggerDate = false
      } else {
        this.showTriggerFTSI = false
        this.showTriggerDate = true
      }
    },
  }
}
</script>

<style lang="less" scoped>
.customizeForm {
  margin-left: 30px;
}
</style>
