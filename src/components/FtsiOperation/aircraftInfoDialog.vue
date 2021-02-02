<template>
  <el-dialog
      title="Change the Cached aircraft information"
      :visible.sync="dialogVisible"
      width="700px" :close-on-click-modal="false" @close="aircraftInfoClose">
    <!--  main content  -->
    <span>
      <h2 style="margin-top: 0px">{{aircraftForm.aircraftMSN}}</h2>
      <el-form ref="aircraftFormRef" label-width="150px" :model="aircraftForm" @close="aircraftInfoClose">
        <h3 style="margin-top: 0px">Aircraft Information</h3>
        <el-form-item label="Flight days" prop="addFD"
                      :rules="[{required: true, message: 'cannot be blank', trigger: 'blur'},
                              {validator:onlyNum}]">
          <el-input class="shortInputForm" v-model="aircraftForm.addFD" @blur="calTotalValue"></el-input>
          <a> Total {{TotalValue.totalFD}} FD.</a>
        </el-form-item>
        <el-form-item label="Flight hours" prop="addFH"
                      :rules="[{required: true, message: 'cannot be blank', trigger: 'blur'},
                              {validator:onlyNum}]">
          <el-input class="shortInputForm" v-model="aircraftForm.addFH" @blur="calTotalValue"></el-input>
          <a> Total {{TotalValue.totalFH}} FH.</a>
        </el-form-item>
        <el-form-item label="Flight cycles" prop="addFC"
                      :rules="[{required: true, message: 'cannot be blank', trigger: 'blur'},
                              {validator:onlyNum}]">
          <el-input class="shortInputForm" v-model="aircraftForm.addFC" @blur="calTotalValue"></el-input>
          <a> Total {{TotalValue.totalFC}} FC.</a>
        </el-form-item>
        <h3>Engine Information</h3>
        <el-form-item label="Engine hours" prop="addEH"
                      :rules="[{required: true, message: 'cannot be blank', trigger: 'blur'},
                              {validator:onlyNum}]">
          <el-input class="shortInputForm" v-model="aircraftForm.addEH" @blur="calTotalValue"></el-input>
          <a> Total {{TotalValue.totalLHEH}} LHEH, {{TotalValue.totalRHEH}} RHEH.</a>
        </el-form-item>
        <el-form-item label="C1 cycles" prop="addCC"
                      :rules="[{required: true, message: 'cannot be blank', trigger: 'blur'},
                              {validator:onlyNum}]">
          <el-input class="shortInputForm" v-model="aircraftForm.addCC" @blur="calTotalValue"></el-input>
          <a> Total {{TotalValue.totalLHCC}} LHCC, {{TotalValue.totalRHCC}} RHCC.</a>
        </el-form-item>
        <el-form-item label="Engine starts" prop="addES">
          <el-input class="shortInputForm" v-model="aircraftForm.addES" @blur="calTotalValue"></el-input>
          <a> Total {{TotalValue.totalLHES}} LHES, {{TotalValue.totalRHES}} RHES.</a>
        </el-form-item>
        <el-form-item label="Reverse cycles" prop="addRC"
                      :rules="[{required: true, message: 'cannot be blank', trigger: 'blur'},
                              {validator:onlyNum}]">
          <el-input class="shortInputForm" v-model="aircraftForm.addRC" @blur="calTotalValue"></el-input>
          <a> Total {{TotalValue.totalLHRC}} LHRC, {{TotalValue.totalRHRC}} RHRC.</a>
        </el-form-item>

      </el-form>

    </span>
    <!--  foot area  -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="aircraftInfoClose">close</el-button>
    <el-button @click="modifyCahcedMSNinfo" type="primary">submit</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: "aircraftInfoChange",
  data() {
    return {
      aircraftForm:{
        aircraftMSN:'',
        addFD:0,
        addFH:0,
        addFC:0,
        addEH:0,
        addCC:0,
        addES:0,
        addRC:0
      },
      orginalForm:{},
      TotalValue:{
        totalFD:'',
        totalFH:'',
        totalFC:'',
        totalLHEH:'',
        totalLHCC:'',
        totalLHES:'',
        totalLHRC:'',
        totalRHEH:'',
        totalRHCC:'',
        totalRHES:'',
        totalRHRC:'',
      },
      dialogVisible: false,
    }
  },
  methods: {
    async init(original_info,aircraftMSN) {
      this.orginalForm=original_info
      this.aircraftForm.aircraftMSN=aircraftMSN
      this.calTotalValue()
      this.dialogVisible = true
    },
    //监听输入的飞行数据，并得到在此基础上的飞行总体数据值
    calTotalValue(){
      this.TotalValue.totalFD = (parseFloat(this.aircraftForm.addFD) + this.orginalForm.FD).toFixed(0)
      this.TotalValue.totalFH = (parseFloat(this.aircraftForm.addFH) + this.orginalForm.FH).toFixed(0)
      this.TotalValue.totalFC = (parseFloat(this.aircraftForm.addFC) + this.orginalForm.FC).toFixed(0)
      this.TotalValue.totalLHEH = (parseFloat(this.aircraftForm.addEH) + this.orginalForm.LHEH).toFixed(0)
      this.TotalValue.totalLHCC = (parseFloat(this.aircraftForm.addCC) + this.orginalForm.LHCC).toFixed(0)
      this.TotalValue.totalLHES = (parseFloat(this.aircraftForm.addES) + this.orginalForm.LHES).toFixed(0)
      this.TotalValue.totalLHRC = (parseFloat(this.aircraftForm.addRC) + this.orginalForm.LHRC).toFixed(0)
      this.TotalValue.totalRHEH = (parseFloat(this.aircraftForm.addEH) + this.orginalForm.RHEH).toFixed(0)
      this.TotalValue.totalRHCC = (parseFloat(this.aircraftForm.addCC) + this.orginalForm.RHCC).toFixed(0)
      this.TotalValue.totalRHES = (parseFloat(this.aircraftForm.addES) + this.orginalForm.RHES).toFixed(0)
      this.TotalValue.totalRHRC = (parseFloat(this.aircraftForm.addRC) + this.orginalForm.RHRC).toFixed(0)
    },
    onlyNum(rule, value, callback) {
      const regNum = /^[0-9_.]*$/
      if (!regNum.test(value)) {
        callback(new Error('The format of the input is illegal'))
      } else {
        callback()
      }
    },
    //将输入的飞行修改参数传回后端，并在数据库中进行更新
    async modifyCahcedMSNinfo(){
      this.$refs.aircraftFormRef.validate(async valid => {
        if (!valid) return
        //可以发起添加请求
        const {data: res} = await this.$http.put('userOpt/cacheMSNinfoChange/', this.aircraftForm)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.dialogVisible = false
      })
    },
    aircraftInfoClose(){
      this.$refs.aircraftFormRef.resetFields()
      this.dialogVisible = false
    },
  }
}
</script>

<style lang="less" scoped>

</style>
