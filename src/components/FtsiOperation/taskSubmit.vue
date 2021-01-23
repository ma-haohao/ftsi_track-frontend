<template>
  <div style="width: 100%">
    <!--  breakcrumb navigation  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>FTSI Operation</el-breadcrumb-item>
      <el-breadcrumb-item>Task Submit</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  发动机选择栏  -->
    <div class="select_bar">
      <el-radio-group v-model="queryForm.aircraftMSN" size="small" @change="getEngineNum">
        <el-radio-button v-for="item in aircraftList" :label="item"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="rightIPS" style="margin-top: 20px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card>
            <h3>LHE: {{ leftEngineForm.engineNum }}</h3>
            <el-form ref="leftEngineRef" :model="leftEngineForm" label-width="130px" :rules="EngineRules">
              <el-form-item label="Implement FTSI" prop="implementFTSI">
                <el-input v-model="leftEngineForm.implementFTSI"
                          placeholder="The number of the FTSIs, separated by  ' / ' "></el-input>
              </el-form-item>
              <el-form-item label="Date" prop="implementDate">
                <el-date-picker type="date" placeholder="Choose the implement date" style="width:240px"
                                format="yyyy-MM-dd" v-model="leftEngineForm.implementDate"
                                value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="warning" @click="checkFTSIinfo(leftEngineForm,$refs.leftEngineRef)">Check</el-button>
                <el-button type="primary" @click="submitFTSIinfo(leftEngineForm,$refs.leftEngineRef)">Submit</el-button>
              </el-form-item>
            </el-form>
            <span style="width: 100%">
              <el-table :data="leftCheckResult" border stripe
                        :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}" style="font-size: 13px">
                <el-table-column label="FTSI Num." prop="ftsi_num,rev" width="110">
                  <template slot-scope="scope"> {{ scope.row.ftsi_num }} Rev. {{ scope.row.rev }}
                  </template>
                </el-table-column>
                <el-table-column label="FTSI Title" prop="ftsi_title"></el-table-column>
                <el-table-column label="Comments" prop="comments"></el-table-column>
              </el-table>
            </span>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <h3>RHE: {{ rightEngineForm.engineNum }}</h3>
            <el-form ref="rightEngineRef" :model="rightEngineForm" label-width="130px" :rules="EngineRules">
              <el-form-item label="Implement FTSI" prop="implementFTSI">
                <el-input v-model="rightEngineForm.implementFTSI"
                          placeholder="The number of the FTSIs, separated by  ' / ' "></el-input>
              </el-form-item>
              <el-form-item label="Date" prop="implementDate">
                <el-date-picker type="date" placeholder="Choose the implement date" style="width:240px"
                                format="yyyy-MM-dd" v-model="rightEngineForm.implementDate"
                                value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="warning" @click="checkFTSIinfo(rightEngineForm,$refs.rightEngineRef)">Check</el-button>
                <el-button type="primary" @click="submitFTSIinfo(rightEngineForm,$refs.rightEngineRef)">Submit</el-button>
              </el-form-item>
            </el-form>
            <span style="width: 100%">
              <el-table :data="rightCheckResult" border stripe
                        :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}" style="font-size: 13px">
                <el-table-column label="FTSI Num." prop="ftsi_num,rev" width="110">
                  <template slot-scope="scope"> {{ scope.row.ftsi_num }} Rev. {{ scope.row.rev }}
                  </template>
                </el-table-column>
                <el-table-column label="FTSI Title" prop="ftsi_title"></el-table-column>
                <el-table-column label="Comments" prop="comments"></el-table-column>
              </el-table>
            </span>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-dialog title="Attention" :visible.sync="dialogVisible" width="30%" @close="attentionDialogClose">
        <span v-html="attentionInfo"></span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "taskSubmit",
  created() {
    this.getSelectBar()
  },
  data() {
    var checkonlyNumRules = (rule, value, callback) => {
      const regFTSInum = /^[0-9/]*$/
      if (!regFTSInum.test(value)) {
        callback(new Error('The format of the input is illegal'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      attentionInfo: '',
      queryForm: {
        aircraftMSN: ''
      },
      aircraftList: [],
      leftEngineForm: {
        engineNum: '',
        implementFTSI: '',
        implementDate:''
      },
      rightEngineForm: {
        engineNum: '',
        implementFTSI: '',
        implementDate:''
      },
      leftCheckResult: [],
      rightCheckResult: [],
      EngineRules: {
        implementFTSI: [
          {required: true, message: 'please enter the FTSI number', trigger: 'blur'},
          {validator: checkonlyNumRules, trigger: 'blur'}
        ],
        implementDate: [
          {required: true, message: 'please enter the implement Date', trigger: 'blur'}]
      }
    }
  },
  methods: {
    async getSelectBar() {
      const {data: res} = await this.$http.get('ftsiOpt/selectBar/')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.aircraftList = res.data.aircraft_list
    },
    async getEngineNum() {
      const {data: res} = await this.$http.get('ftsiOpt/getEngineNum/', {params: this.queryForm})
      if (res.meta.status !== 200) {
        return this.$message.error('failed to obtain the engine information')
      }
      this.leftEngineForm.engineNum = res.data.left_engine
      this.rightEngineForm.engineNum = res.data.right_engine
    },
    async checkFTSIinfo(engineForm,validateRef) {
      if (engineForm.engineNum === '') {
        return this.$message.error('Please select the aircraft first.')
      }
      validateRef.validate(async valid => {
        if (!valid) return
        //可以发起添加请求
        const {data: res} = await this.$http.get('ftsiOpt/checkFTSIinfo/', {params: engineForm})
        console.log(res)
        if (engineForm.engineNum === this.leftEngineForm.engineNum) {
          this.leftCheckResult = res.data.FTSI_info
        }else{this.rightCheckResult = res.data.FTSI_info}

        if (res.data.warning_info !== "") {
          this.attentionDialogOpen(res.data.warning_info)
        }
      })
    },
    async submitFTSIinfo(engineForm,validateRef) {
      if (engineForm.engineNum === '') {
        return this.$message.error('Please select the aircraft first.')
      }
      validateRef.validate(async valid => {
        if (!valid) return
        //可以发起添加请求
        const {data: res} = await this.$http.put('ftsiOpt/submitFTSIinfo/', engineForm)
        if (res.meta.status !== 200) {
          return this.$message.error('failed to submit the info')
        }
        this.$message.success(res.meta.msg)
        if (res.data.warning_info !== "") {
          this.attentionDialogOpen(res.data.warning_info)
        }
      })
    },
    attentionDialogOpen(info) {
      this.attentionInfo = info
      this.dialogVisible = true
    },
    attentionDialogClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
