<template>
  <div style="width: 100%">
    <!--  breakcrumb navigation  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>FTSI Operation</el-breadcrumb-item>
      <el-breadcrumb-item>Task Query</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  选择栏  -->
    <el-card style="margin-bottom: 20px;width: 100%;padding-bottom: 0">
      <el-tabs type="card" v-model="queryForm.onWing" @tab-click="tabChange">
        <el-tab-pane label="On Wing" name="true">
          <div class="select_bar">
            <el-radio-group style="margin-right: 30px" v-model="queryForm.aircraftMSN" @change="getFTSIforAifcraft"
                            size="small">
              <el-radio-button v-for="item in aircraftList" :label="item"></el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="queryForm.typeSelect" @change="getFTSIforAifcraft" size="small">
              <el-radio-button v-for="item in typeList" :label="item"></el-radio-button>你
            </el-radio-group>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Off Wing" name="false">
          <div class="select_bar">
            <el-radio-group style="margin-right: 30px" v-model="queryForm.engineIPS" @change="getFTSIforAifcraft"
                            size="small">
              <el-radio-button v-for="item in offWingList" :label="item"></el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="queryForm.typeSelect" @change="getFTSIforAifcraft" size="small">
              <el-radio-button v-for="item in typeList" :label="item"></el-radio-button>
            </el-radio-group>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--  表单栏，左右发动机的数据  -->
    <div class="ftsi_list">
      <el-card style="height:100%;width:100%">
        <!--   自定义监控参数栏   -->
        <el-button type="primary" @click="openParaDialog" style="margin-bottom: 15px">Monitor Parameters</el-button>
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
        <!--  搜索栏    -->
        <div class="select_input">
          <el-input placeholder="Please enter what you are searching for" v-model="queryForm.input"
                    class="input-with-select" @keyup.enter.native="getFTSIforAifcraft" clearable>
            <el-select v-model="queryForm.select" slot="prepend" placeholder="According to">
              <el-option label="FTSI Num." value="ftsi_num"></el-option>
              <el-option label="FTSI Title" value="ftsi_title"></el-option>
              <el-option label="Compliance State." value="statement"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="getFTSIforAifcraft"></el-button>
          </el-input>
        </div>
        <!--   发动机数据   -->
        <el-tabs type="card" v-model="activeName" @tab-click="handleClick" v-show="showOnWingTable">
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
              <el-table-column label="Opt." width="70" align="center">
                <template slot-scope="scope">
                  <!--     文件编辑按钮       -->
                  <el-tooltip effect="dark" content="Edit" placement="top" :enterable="false">
                    <el-button type="warning" icon="el-icon-edit" size="mini"
                               @click="openEditDetailDialog(scope.row.id)"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
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
              <el-table-column label="Opt." width="70" align="center">
                <template slot-scope="scope">
                  <!--     文件编辑按钮       -->
                  <el-tooltip effect="dark" content="Edit" placement="top" :enterable="false">
                    <el-button type="warning" icon="el-icon-edit" size="mini"
                               @click="openEditDetailDialog(scope.row.id)"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
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
        <div class="offWingTable" v-show="showOffWingTable">
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
            <el-table-column label="Opt." width="70" align="center">
              <template slot-scope="scope">
                <!--     文件编辑按钮       -->
                <el-tooltip effect="dark" content="Edit" placement="top" :enterable="false">
                  <el-button type="warning" icon="el-icon-edit" size="mini"
                             @click="openEditDetailDialog(scope.row.id)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <editDetail ref="editDetailRef" v-on:updateList="getFTSIforAifcraft"></editDetail>
    <predict-result ref="predictResultRef"></predict-result>
    <monitorPara ref="monitorParaRef" v-on:updateList="getFTSIforAifcraft"></monitorPara>

  </div>
</template>

<script>
export default {
  components: {
    editDetail: () => import("../FtsiMgr/editDetailDialog"),
    predictResult: () => import("./predictResultDisplay"),
    monitorPara: () => import("./monitorParaDisplay"),
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
        onWing: 'true',
        select: '',
        input: '',
        aircraftMSN: '',
        engineIPS: '',
        typeSelect: 'All',
      },
      predictForm: {
        flightDay: 1,
        flightHour: 5,
        engineHour: 5,
        c1Cycle: 1,
        flightCycle: 1,
        TRCycle:1,
        aircraftMSN: '',
        engineIPS: '',
        onWing: '',
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
      showOnWingTable: true,
      showOffWingTable: false,
      aircraftList: [],
      offWingList: [],
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
    /*tab类型改变时触发*/
    clearSelectContent() {
      this.queryForm.aircraftMSN = ''
      this.queryForm.engineIPS = ''
      this.queryForm.typeSelect = 'All'
    },
    clearTable() {
      this.leftIPS = ''
      this.rightIPS = ''
      this.amountLeft = ''
      this.amountRight = ''
      this.leftForm = []
      this.rightForm = []
    },
    tabChange() {
      /*清空之前的内容*/
      this.clearSelectContent()
      this.clearTable()
      /*修改显示的table*/
      this.showOnWingTable = this.queryForm.onWing === 'true';
      this.showOffWingTable = !this.showOnWingTable
    },
    async getSelectBar() {
      const {data: res} = await this.$http.get('ftsiOpt/selectBar/')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.aircraftList = res.data.aircraft_list
      this.offWingList = res.data.offWing_list
      this.typeList = res.data.type_list
    },
    async getFTSIforAifcraft() {
      if (this.aircraftMSN === '') return this.$message.error('Please select the aircraft first.')
      const {data: res} = await this.$http.get('ftsiOpt/ftsiforAircraft/', {params: this.queryForm})
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
    openEditDetailDialog(id) {
      this.$refs.editDetailRef.init(id)
    },
    //发起预测请求
    predictAction() {
      this.$refs.predictFormRef.validate(async valid => {
        if (!valid) return
        //可以发起添加请求
        this.predictForm.aircraftMSN = this.queryForm.aircraftMSN
        this.predictForm.engineIPS = this.queryForm.engineIPS
        this.predictForm.onWing = this.queryForm.onWing
        const {data: res} = await this.$http.get('ftsiOpt/predictFTSI/', {params: this.predictForm})
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$refs.predictResultRef.init(res.data)
      })
    },
    //打开用户自定义显示的监控参数设置界面
    openParaDialog(){
      this.$refs.monitorParaRef.init()
    }
  }
}
</script>

<style lang="less" scoped>
.select_bar {
  width: 100%;
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
