<template>
  <div style="width: 100%">
    <!--  breakcrumb navigation  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>FTSI Operation</el-breadcrumb-item>
      <el-breadcrumb-item>Cache Area</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  选择栏  -->
    <div class="select_bar">
      <el-button type="primary" size="small" style="margin-bottom: 15px" @click="openCacheDialog">Cached Aircraft
      </el-button>
      <br>
      <el-radio-group style="margin-right: 30px" v-model="queryForm.aircraftMSN" @change="getFTSIforAifcraft" size="small">
        <el-radio-button v-for="item in aircraftList" :label="item"></el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="queryForm.typeSelect" @change="getFTSIforAifcraft" size="small">
        <el-radio-button v-for="item in typeList" :label="item"></el-radio-button>
      </el-radio-group>
    </div>
    <!--  表单栏，左右发动机的数据  -->
    <div class="ftsi_list">
      <el-card style="height:100%;width:100%">
        <p style="margin-top: 0px">Cache Date: {{cacheDate}}</p>
        <!--    预测栏    -->
        <el-form :inline="true" class="demo-form-inline" :model="predictForm" :rules="predictFormRules"
                 ref="predictFormRef">
          <el-form-item label="FD" prop="flightDay">
            <el-input v-model="predictForm.flightDay" class="predictInputForm"></el-input>
          </el-form-item>
          <el-form-item label="FH" prop="flightHour">
            <el-input v-model="predictForm.flightHour" class="predictInputForm"></el-input>
          </el-form-item>
          <el-form-item label="EH" prop="engineHour">
            <el-input v-model="predictForm.engineHour" class="predictInputForm"></el-input>
          </el-form-item>
          <el-form-item label="C1 cycle" prop="c1Cycle">
            <el-input v-model="predictForm.c1Cycle" class="predictInputForm"></el-input>
          </el-form-item>
          <el-form-item label="FC" prop="flightCycle">
            <el-input v-model="predictForm.flightCycle" class="predictInputForm"></el-input>
          </el-form-item>
          <el-form-item label="TR cycle" prop="TRCycle">
            <el-input v-model="predictForm.TRCycle" class="predictInputForm"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="predictAction">Predict</el-button>
          </el-form-item>
        </el-form>
        <!--   发动机数据   -->
        <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="'LHE: '+leftIPS" name="first">
            <span>Total: {{ amountLeft }}</span>
            <el-table :data="leftForm" border stripe
                      :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}" style="font-size: 13px"
                      :cell-style="changeTrStyle">
              <el-table-column label="FTSI Num." prop="ftsi_info.ftsi_num,ftsi_info.rev" width="110">
                <template slot-scope="scope"> {{ scope.row.ftsi_info.ftsi_num }} Rev. {{ scope.row.ftsi_info.rev }}
                </template>
              </el-table-column>
              <el-table-column label="FTSI Title" prop="ftsi_info.ftsi_title"></el-table-column>
              <el-table-column label="Last implement" prop="last_date"></el-table-column>
              <el-table-column label="Compliance Statement" prop="ftsi_info.statement" width="500"></el-table-column>
              <el-table-column label="Comments" prop="comments"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="'RHE: '+rightIPS" name="second">
            <span>Total: {{ amountRight }}</span>
            <el-table :data="rightForm" border stripe
                      :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}" style="font-size: 13px"
                      :cell-style="changeTrStyle">
              <el-table-column label="FTSI Num." prop="ftsi_info.ftsi_num,ftsi_info.rev" width="110">
                <template slot-scope="scope"> {{ scope.row.ftsi_info.ftsi_num }} Rev. {{ scope.row.ftsi_info.rev }}
                </template>
              </el-table-column>
              <el-table-column label="FTSI Title" prop="ftsi_info.ftsi_title"></el-table-column>
              <el-table-column label="Last implement" prop="last_date"></el-table-column>
              <el-table-column label="Compliance Statement" prop="ftsi_info.statement" width="500"></el-table-column>
              <el-table-column label="Comments" prop="comments"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="'TOTAL'" name="third">
            <span>Total: {{ amountTotal }}</span>
            <el-table :data="totalForm" border stripe
                      :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}" style="font-size: 13px"
                      :cell-style="changeTrStyleForTotal">
              <el-table-column label="FTSI Num." prop="ftsi_info.ftsi_num,ftsi_info.rev" width="110">
                <template slot-scope="scope"> {{ scope.row.ftsi_info.ftsi_num }} Rev. {{ scope.row.ftsi_info.rev }}
                </template>
              </el-table-column>
              <el-table-column label="FTSI Title" prop="ftsi_info.ftsi_title"></el-table-column>
              <el-table-column label="Compliance Statement" prop="ftsi_info.statement" width="400"></el-table-column>
              <el-table-column label="Comments(LH)" prop="comments_LH"></el-table-column>
              <el-table-column label="Comments(RH)" prop="comments_RH"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <editDetail ref="editDetailRef" v-on:updateList="getFTSIforAifcraft"></editDetail>
    <predict-result ref="predictResultRef"></predict-result>
    <cacheAircraftDialog ref="cacheAircraftDialogRef"></cacheAircraftDialog>
  </div>
</template>

<script>
export default {
  components: {
    editDetail: () => import("../FtsiMgr/editDetailDialog"),
    predictResult: () => import("./predictResultDisplay"),
    cacheAircraftDialog: () => import("./cacheAircraftDialog")
  },
  created() {
    this.getSelectBar()
  },
  data() {
    var onlyNum = (rule, value, callback) => {
      const regFTSInum = /^[0-9.]*$/
      if (!regFTSInum.test(value)) {
        callback(new Error('The format of the input is illegal'))
      } else {
        callback()
      }
    }
    return {
      //记录选择项的值，用于传回后端来进行查询
      activeName: 'first',
      queryForm: {
        aircraftMSN: '',
        typeSelect: 'All',
      },
      predictForm: {
        flightDay: 1,
        flightHour: 5,
        engineHour: 5,
        c1Cycle: 1,
        flightCycle: 1,
        TRCycle:1,
        aircraftMSN: ''
      },
      predictFormRules: {
        flightDay: [
          {required: true, message: 'please enter the FTSI number', trigger: 'blur'},
          {validator: onlyNum, trigger: 'blur'}
        ],
        flightHour: [
          {required: true, message: 'please enter the Revision', trigger: 'blur'},
          {validator: onlyNum, trigger: 'blur'}
        ],
        engineHour: [
          {required: true, message: 'please choose the monitor type', trigger: 'change'},
          {validator: onlyNum, trigger: 'blur'}
        ],
        c1Cycle: [
          {required: true, message: 'At least one IPS must be chosen', trigger: 'change'},
          {validator: onlyNum, trigger: 'blur'}
        ]
      },
      //从后端获取选择项的列表
      aircraftList: [],
      cacheDate:'',
      typeList: [],
      //左发与右发中FTSI的表格数据
      leftIPS: '',
      rightIPS: '',
      amountLeft: '',
      amountRight: '',
      leftForm: [],
      rightForm: [],
      totalForm:[],
      amountTotal:'',
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    async getSelectBar() {
      const {data: res} = await this.$http.get('ftsiOpt/selectBar/')
      const {data: res1} = await this.$http.get('userOpt/obrtainCachedAircraft/')
      this.typeList = res.data.type_list
      this.aircraftList = res1.data
    },
    async getFTSIforAifcraft() {
      if (this.aircraftMSN === '') return this.$message.error('Please select the aircraft first.')
      const {data: res} = await this.$http.get('userOpt/cachedFTSIforAircraft/', {params: this.queryForm})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.leftIPS = res.data.leftIPS.engine
      this.rightIPS = res.data.rightIPS.engine
      this.leftForm = res.data.ftsiForLeft
      this.rightForm = res.data.ftsiForRight
      this.amountLeft = res.data.amountLeft
      this.amountRight = res.data.amountRight
      this.cacheDate=res.data.cacheDate
      this.totalForm=res.data.ftsiForTotal
      this.amountTotal=res.data.amountTotal
    },
    changeTrStyle({row, column, rowIndex, columnIndex}) {
      if (row.reminds === 'attention' && column.label === 'Comments') {
        return 'background:#FE5E02'
      } else if (row.reminds === 'warning' && column.label === 'Comments') {
        return 'background:#FFD102'
      }
    },
    changeTrStyleForTotal({row, column, rowIndex, columnIndex}) {
      if (row.reminds_LH === 'attention' && column.label === 'Comments(LH)') {
        return 'background:#FE5E02'
      } else if (row.reminds_LH === 'warning' && column.label === 'Comments(LH)') {
        return 'background:#FFD102'
      } else if (row.reminds_RH === 'attention' && column.label === 'Comments(RH)') {
        return 'background:#FE5E02'
      } else if (row.reminds_RH === 'warning' && column.label === 'Comments(RH)') {
        return 'background:#FFD102'
      }else if (row.reminds_RH === 'NA' && column.label === 'Comments(RH)') {
        return 'background:#949596'
      }else if (row.reminds_LH === 'NA' && column.label === 'Comments(LH)') {
        return 'background:#949596'
      }
    },
    openCacheDialog() {
      this.$refs.cacheAircraftDialogRef.init()
    },
    //发起预测请求
    predictAction() {
      this.$refs.predictFormRef.validate(async valid => {
        if (!valid) return
        //可以发起添加请求
        this.predictForm.aircraftMSN = this.queryForm.aircraftMSN
        const {data: res} = await this.$http.get('userOpt/cachedPredictFTSI/', {params: this.predictForm})
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$refs.predictResultRef.init(res.data)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.select_bar {
  width: 100%;
  margin-bottom: 15px;
}

.ftsi_list {
  width: 100%;
  margin-bottom: 15px;
  font-size: 20px;
}

.el-select {
  width: 150px;
}

.select_input {
  width: 40%;
  margin-bottom: 15px;
}
</style>
