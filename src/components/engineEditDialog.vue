<template>
  <el-dialog
      title="Change the engine information"
      :visible.sync="dialogVisible"
      width="800px" :close-on-click-modal="false" @close="engineEditClose">
    <!--  main content  -->
    <span>
      <h2 style="margin-top: 0px">IPS: {{engineForm.engine}}</h2>
      <el-form ref="engineFormRef" :inline="true" label-width="150px" :model="engineForm" @close="engineEditClose">
        <el-form-item label="Aircraft Num." prop="aircraft"
                      :rules="[{required: true, message: 'cannot be blank', trigger: 'blur'}]">
          <el-input class="shortInputForm" v-model="engineForm.aircraft"></el-input>
        </el-form-item>
        <el-form-item label="Left/Right" prop="left_right">
          <el-input class="shortInputForm" v-model="engineForm.left_right"></el-input>
        </el-form-item>
        <el-form-item label="Flight Day" prop="flight_day"
                      :rules="[{required: true, message: 'cannot be blank', trigger: 'blur'},
                              {validator:onlyNum}]">
          <el-input class="shortInputForm" v-model="engineForm.flight_day"></el-input>
        </el-form-item>
        <el-form-item label="Flight Hour" prop="flight_time"
                      :rules="[{required: true, message: 'cannot be blank', trigger: 'blur'},
                              {validator:onlyNum}]">
          <el-input class="shortInputForm" v-model="engineForm.flight_time"></el-input>
        </el-form-item>
        <el-form-item label="Flight Cycle" prop="flight_cycle"
                      :rules="[{required: true, message: 'cannot be blank', trigger: 'blur'},
                              {validator:onlyNum}]">
          <el-input class="shortInputForm" v-model="engineForm.flight_cycle"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="Engine Hour" prop="run_time"
                      :rules="[{required: true, message: 'cannot be blank', trigger: 'blur'},
                              {validator:onlyNum}]">
          <el-input class="shortInputForm" v-model="engineForm.run_time"></el-input>
        </el-form-item>
        <el-form-item label="C1 Cycle" prop="c1_cycle"
                      :rules="[{required: true, message: 'cannot be blank', trigger: 'blur'},
                              {validator:onlyNum}]">
          <el-input class="shortInputForm" v-model="engineForm.c1_cycle"></el-input>
        </el-form-item>
        <el-form-item label="Engine Starts" prop="engine_starts"
                      :rules="[{required: true, message: 'cannot be blank', trigger: 'blur'},
                              {validator:onlyNum}]">
          <el-input class="shortInputForm" v-model="engineForm.engine_starts"></el-input>
        </el-form-item>
                <el-form-item label="Reverse Cycle" prop="reverse_cycle"
                              :rules="[{required: true, message: 'cannot be blank', trigger: 'blur'},
                              {validator:onlyNum}]">
          <el-input class="shortInputForm" v-model="engineForm.reverse_cycle"></el-input>
        </el-form-item>
      </el-form>
    </span>
    <!--  foot area  -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="engineEditClose">close</el-button>
    <el-button type="primary">submit</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: "aircraftInfoChange",
  data() {
    return {
      engineForm:{},
      orginalForm:{},
      dialogVisible: false,
    }
  },
  methods: {
    async init(engineNum) {
      const {data: res} = await this.$http.get('common/engineEditInfo/',{params:{'engine': engineNum}})
      console.log(res)
      this.engineForm=res.data
      this.dialogVisible = true
    },
    //监听输入的飞行数据，并得到在此基础上的飞行总体数据值
    onlyNum(rule, value, callback) {
      const regNum = /^[0-9_.]*$/
      if (!regNum.test(value)) {
        callback(new Error('The format of the input is illegal'))
      } else {
        callback()
      }
    },
    engineEditClose(){
      this.$refs.engineFormRef.resetFields()
      this.dialogVisible = false
    },
  }
}
</script>

<style lang="less" scoped>

</style>
