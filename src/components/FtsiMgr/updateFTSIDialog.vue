<template>
  <el-dialog
      title="Update FTSI"
      :visible.sync="dialogVisible"
      width="800px" :close-on-click-modal="false" @close="updateDialogClose">
    <!--  main content  -->
    <span>
      <el-form ref="updateFormRef" label-width="150px" :model="updateForm" :rules="updateFormRules">
        <!--   FTSI号区域     -->
        <el-form-item label="FTSI Number" prop="ftsi_num" class="required">
          <el-input class="shortInputForm" v-model="updateForm.ftsi_num" :disabled="true"></el-input>
        </el-form-item>
        <!--   版本号区域     -->
        <el-form-item label="Rev." prop="rev" class="required">
          <el-input class="shortInputForm" v-model="updateForm.rev" :disabled=pendingFlag></el-input>
        </el-form-item>
        <!--   起效时间     -->
        <el-form-item label="Issue Date" prop="issueDate" class="required"
                      :rules="[{required: true, message: 'please choose the start date', trigger: 'blur'}]">
          <el-date-picker v-model="updateForm.issueDate" type="date"
                          placeholder="Choose date" :disabled=pendingFlag
                          style="width:190px" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <!--   FTSI title区域     -->
        <el-form-item label="FTSI Title" prop="ftsi_title">
          <el-input type="textarea" class="longInputForm" v-model="updateForm.ftsi_title" :disabled=pendingFlag></el-input>
        </el-form-item>
        <!--   Compliance Statement区域     -->
        <el-form-item label="Compliance Stat." prop="compliance">
          <el-input type="textarea" class="longInputForm" v-model="updateForm.statement" :disabled=pendingFlag></el-input>
        </el-form-item>
        <!--   单选框：是否改变监控类型    -->
        <el-form-item>
          <el-switch v-model="modifyType" active-text="Modify the type information"></el-switch>
        </el-form-item>
        <div v-show="modifyType">
          <!--   监控类型区域     -->
          <el-form-item label="Monitor Type" prop="type" class="required">
            <el-select placeholder="Please choice" v-model="updateForm.dep_type" @change="monitorTypeCheck">
              <el-option v-for="item in monitorType" :label="item[1]" :value="item[0]"></el-option>
            </el-select>
          </el-form-item>
          <!--    当type为customize时格外产生的表单内容   -->
          <div v-show="showCustomizeForm" class="customizeForm">
            <!--   初始激活项       -->
            <el-form-item label="Trigger">
              <el-col :span="9">
                <el-form-item prop="customizePara.trigger.type">
                  <el-select placeholder="Please choice" v-model="updateForm.customizePara.trigger.type"
                             @change="paraShowChange">
                    <el-option v-for="item in triggerType" :label="item[1]" :value="item[0]"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="13">
                <div v-show="showTriggerFTSI">
                  <el-form-item label="FTSI num." prop="customizePara.trigger.parameter" class="required"
                                :rules="[{required: showTriggerFTSI, message: 'please enter the related FTSI', trigger: 'blur'},
                                {validator:onlyNum}]">
                    <el-input class="shortInputForm" v-model="updateForm.customizePara.trigger.parameter"></el-input>
                  </el-form-item>
                </div>
                <div v-show="showTriggerDate">
                  <el-form-item label="Date" prop="triggerDateForm" class="required"
                                :rules="[{required: showTriggerDate, message: 'please choose the start date', trigger: 'blur'}]">
                    <el-date-picker v-model="updateForm.triggerDateForm" type="date"
                                    placeholder="Choose date"
                                    style="width:190px" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
            </el-form-item>
            <!--  customize中可增加的monitor type(动态), 最大数量为3  -->
            <div v-for="(item,index) in updateForm.customizePara.monitorParam" :key="item.key">
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
                  <el-input class="shortInputForm" v-model="updateForm.period"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="13">
                <!--   执行频率区域     -->
                <el-form-item label="Total Times" prop="total_times" class="required"
                              :rules="[{required: !this.showCustomizeForm, message: 'please enter total times', trigger: 'blur'},
                              {validator:onlyNum}]">
                  <el-input class="shortInputForm" v-model="updateForm.total_times"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </div>
        </div>
        <!--   单选框：改变文件的适用范围   -->
        <el-form-item>
          <el-switch v-model="modifyRange" active-text="Modify the effective range"></el-switch>
        </el-form-item>
        <!--   Applied IPS区域     -->
        <div v-show="modifyRange">
          <el-form-item label="Applied IPS" prop="appliedIPS">
            <el-transfer :titles="['Unapplied','Applied']" v-model="updateForm.appliedIPS" :data="IPSdata"></el-transfer>
          </el-form-item>
        </div>
      </el-form>
    </span>
    <!--  foot area  -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="updateFTSI">Submit</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "editFTSI",
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
      pendingFlag:false,
      monitorType: [], /*监控的类型*/
      triggerType: [], /*FTSI的激活类型*/
      /*控制部分表单元素的可视与否*/
      showCustomizeForm: false,
      showTriggerFTSI: false,
      showTriggerDate: false,
      revOriginal:'',
      updateForm: {
        issueDate:'',
        customizePara: {
          triggerDateForm:'',
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
      modifyType:false,
      modifyRange:false,
      updateFormRules: {
        ftsi_num: [
          {required: true, message: 'please enter the FTSI number', trigger: 'blur'},
          {validator: checkonlyNumRules, trigger: 'blur'}
        ],
        rev: [
          {required: true, message: 'please enter the Revision', trigger: 'blur'},
          {validator: checkRevRules, trigger: 'blur'},
          {validator: this.validateRevUpdate, trigger: 'blur'},
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
    applied_ips_compare(old_list,new_list){
      if(old_list.sort().toString()!==new_list.sort().toString()){
        this.modifyRange=true
      }
    },
    init(id) {
      this.getTypeFTSI()
      this.getFTSIInfo(id)
    },
    async initForPending(item){
      this.getTypeFTSI()
      await this.getFTSIInfo(item.id)
      this.updateForm.pending_id=item.pending_id
      this.updateForm.rev=item.revision
      this.updateForm.ftsi_title=item.ftsi_title
      if(this.updateForm.statement!==item.statement){this.modifyType=true}
      this.updateForm.statement=item.statement
      this.updateForm.issueDate=item.issue_date
      this.applied_ips_compare(this.updateForm.appliedIPS,item.impact_ips)
      this.updateForm.appliedIPS=item.impact_ips
      this.pendingFlag=true
    },
    validateRevUpdate(rule,value,callback){
      if(value<=this.revOriginal){
        callback(new Error('The version number needs to be greater than the original'))
      }else{
        callback()
      }
    },
    async getFTSIInfo(id){
      const {data:res}=await this.$http.get('ftsiMgr/getFTSIInfo/',{params: {'id': id}})
      this.updateForm=res.data
      console.log(this.updateForm)
      this.revOriginal=this.updateForm.rev
      this.monitorTypeCheck()
      this.paraShowControl()
      if(this.showTriggerDate===true){this.updateForm.triggerDateForm=this.updateForm.customizePara.trigger.parameter}
    },
    onlyNum(rule, value, callback) {
      const regNum = /^[0-9_-]*$/
      if (!regNum.test(value)) {
        callback(new Error('The format of the input is illegal'))
      } else {
        callback()
      }
    },
    async updateFTSI(){
      this.$refs.updateFormRef.validate(async valid => {
        if (!valid) return
        //可以发起添加请求
        this.updateForm.modifyType = this.modifyType;
        this.updateForm.modifyRange = this.modifyRange;
        if(this.showTriggerDate===true){this.updateForm.customizePara.trigger.parameter=this.updateForm.triggerDateForm}
        const {data: res} = await this.$http.put('ftsiMgr/updateFTSI/', this.updateForm)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        }
        if(this.pendingFlag===true){
          const {data: res} = await this.$http.put('ftsiMgr/PendingClose/', this.updateForm)
          if (res.meta.status !== 200) {this.$message.error(res.meta.msg)}
          this.$message.success(res.meta.msg)
        }
        this.dialogVisible = false
        this.$emit('updateList')
      })
    },
    //监听添加对话框的关闭事件
    updateDialogClose() {
      this.$refs.updateFormRef.resetFields()
      this.modifyRange = false
      this.modifyType = false
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
      if (this.updateForm.dep_type === 'CUS') {
        this.updateForm.total_times=1
        this.updateForm.period=''
        return this.showCustomizeForm = true
      } else {
        this.showCustomizeForm = false
        this.showTriggerFTSI=false
        this.showTriggerDate=false
      }
    },
    addCusMonitor() {
      if (this.updateForm.customizePara.monitorParam.length > 2) return this.$message.error('The amount must be no more than 3!')
      this.updateForm.customizePara.monitorParam.push({
        type: '',
        period: '',
        times: '',
      })
    },
    deleteCusMonitor(item, index) {
      var index = this.updateForm.customizePara.monitorParam.indexOf(item)
      if (index !== -1) {
        this.updateForm.customizePara.monitorParam.splice(index, 1)
      }
    },
    //控制trigger的输入参数的显示
    paraShowControl() {
      if (this.updateForm.customizePara.trigger.type === 'NA') {
        this.showTriggerFTSI = false
        this.showTriggerDate = false
      } else if (this.updateForm.customizePara.trigger.type === 'TFTSI') {
        this.showTriggerFTSI = true
        this.showTriggerDate = false
      } else {
        this.showTriggerFTSI = false
        this.showTriggerDate = true
      }
    },
    paraShowChange(){
      this.updateForm.customizePara.trigger.parameter=''
      this.paraShowControl()
    }
  }
}
</script>

<style lang="less" scoped>
.customizeForm {
  margin-left: 30px;
}
</style>
