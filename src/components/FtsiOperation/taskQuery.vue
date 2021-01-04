<template>
  <div style="width: 100%">
    <!--  breakcrumb navigation  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>FTSI Operation</el-breadcrumb-item>
      <el-breadcrumb-item>Task Query</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  选择栏  -->
    <div class="select_bar">
      <el-row :gutter="0">
        <el-col :span="9">
          <el-radio-group v-model="queryForm.aircraftMSN" @change="getFTSIforAifcraft" size="small">
            <el-radio-button v-for="item in aircraftList" :label="item"></el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="8">
          <el-radio-group v-model="queryForm.typeSelect" @change="getFTSIforAifcraft" size="small">
            <el-radio-button v-for="item in typeList" :label="item"></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
    </div>
    <!--  表单栏，左右发动机的数据  -->
    <div class="ftsi_list">
      <el-row :gutter="20">
        <!--  左发数据  -->
        <el-col :span="12">
          <el-card style="height:100%;width:100%">
            <h2>LHE: {{ leftIPS }}</h2>
            <el-table :data="leftForm" border stripe
                      :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}" style="font-size: 10px"
                      :cell-style="changeTrStyle">
              <el-table-column label="FTSI Num." prop="ftsi_info.ftsi_num,ftsi_info.rev" width="110">
                <template slot-scope="scope"> {{ scope.row.ftsi_info.ftsi_num }} Rev. {{ scope.row.ftsi_info.rev }}
                </template>
              </el-table-column>
              <el-table-column label="Last implement" prop="last_date"></el-table-column>
              <el-table-column label="Current type" prop="current_type"></el-table-column>
              <el-table-column label="Comments" prop="comments"></el-table-column>
              <!--              <el-table-column label="Status" width="80" align="center">
                              <template slot-scope="scope">
                                <el-switch v-model="scope.row.active_status" @change="statusChanged(scope.row)"></el-switch>
                              </template>
                            </el-table-column>-->
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
          </el-card>
        </el-col>
        <!--  右发数据  -->
        <el-col :span="12">
          <el-card style="height:100%;width:100%">
            <h2>RHE: {{ rightIPS }}</h2>
            <el-table :data="rightForm" border stripe
                      :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}" style="font-size: 10px"
                      :cell-style="changeTrStyle">
              <el-table-column label="FTSI Num." prop="ftsi_info.ftsi_num,ftsi_info.rev" width="110">
                <template slot-scope="scope"> {{ scope.row.ftsi_info.ftsi_num }} Rev. {{ scope.row.ftsi_info.rev }}
                </template>
              </el-table-column>
              <el-table-column label="Last implement" prop="last_date"></el-table-column>
              <el-table-column label="Current type" prop="current_type"></el-table-column>
              <el-table-column label="Comments" prop="comments"></el-table-column>
              <!--              <el-table-column label="Status" width="80" align="center">
                              <template slot-scope="scope">
                                <el-switch v-model="scope.row.active_status" @change="statusChanged(scope.row)"></el-switch>
                              </template>
                            </el-table-column>-->
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
          </el-card>
        </el-col>
      </el-row>
    </div>
    <editDetail ref="editDetailRef"></editDetail>
  </div>
</template>

<script>
export default {
  components: {
    editDetail: () => import("../FtsiMgr/editDetailDialog")
  },
  created() {
    this.getSelectBar()
  },
  data() {
    return {
      //记录选择项的值，用于传回后端来进行查询
      queryForm: {
        aircraftMSN: '',
        typeSelect: 'All',
      },
      //从后端获取选择项的列表
      aircraftList: [],
      typeList: [],
      //左发与右发中FTSI的表格数据
      leftIPS: '',
      rightIPS: '',
      leftForm: [],
      rightForm: [],
    }
  },
  methods: {
    async getSelectBar() {
      const {data: res} = await this.$http.get('ftsiOpt/selectBar/')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.aircraftList = res.data.aircraft_list
      this.typeList = res.data.type_list
    },
    async getFTSIforAifcraft() {
      if (this.aircraftMSN === '') return
      const {data: res} = await this.$http.get('ftsiOpt/ftsiforAircraft/', {params: this.queryForm})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('failed to get the FTSI list')
      }
      this.leftIPS = res.data.leftIPS.engine
      this.rightIPS = res.data.rightIPS.engine
      this.leftForm = res.data.ftsiForLeft
      this.rightForm = res.data.ftsiForRight
    },
    changeTrStyle({row, column, rowIndex, columnIndex}) {
      if (row.reminds === 'attention' && column.label === 'Comments') {
        return 'background:#FE5E02'
      } else if (row.reminds === 'warning' && column.label === 'Comments') {
        return 'background:#FFD102'
      }
    },
    openEditDetailDialog(id) {
      this.$refs.editDetailRef.init(id)
    },
    updateList(){
      this.getFTSIforAifcraft()
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
  font-size: 15px;
}
</style>
