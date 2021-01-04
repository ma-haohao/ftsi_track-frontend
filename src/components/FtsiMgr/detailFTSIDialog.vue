<template>
  <el-dialog
      title="Condition for Applied IPS"
      :visible.sync="dialogVisible"
      width="1000px">
    <!--  main content  -->
    <span>
      <span>
        <a>FTSI: LEAP-1C-FTSI-{{ FTSIinfo.ftsi_num }} Rev. {{ FTSIinfo.rev }}</a><br>
        <a>FTSI Title: {{ FTSIinfo.ftsi_title }}</a><br>
        <a>Compliance Statement: {{ FTSIinfo.statement }}</a><br>
        <a>Monitor Type: {{ FTSIinfo.dep_type }}</a><br>
        <a>Period: {{ FTSIinfo.period }}</a>
      </span>

      <!--   table area: FTSI for different engines   -->
      <el-table :data="detailForm" border stripe
                :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}">
        <el-table-column label="Applied IPS" prop="engine_id" width="110"></el-table-column>
        <el-table-column label="Last implement date" prop="last_date"></el-table-column>
        <el-table-column label="Current type" prop="current_type"></el-table-column>
        <el-table-column label="Next target" prop="next_target"></el-table-column>
        <el-table-column label="Residual times" prop="residual_times"></el-table-column>
        <el-table-column label="Status" width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.active_status" @change="statusChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="100" align="center">
          <template slot-scope="scope">
            <!--     文件编辑按钮       -->
            <el-tooltip effect="dark" content="Edit" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-edit" size="mini"
                         @click="openEditDetailDialog(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <editDetail ref="editDetailRef" v-on:updateList="showFTSIDetail(ftsi_id)"></editDetail>
    </span>
    <!--  foot area  -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">Close</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {
    editDetail: () => import("./editDetailDialog")
  },
  data() {
    return {
      dialogVisible: false,
      ftsi_id:'',
      //查询到的FTSI的细节信息
      detailForm: {},
      FTSIinfo: {
        ftsi_num: '',
        rev: '',
        ftsi_title: '',
        statement: '',
        dep_type: '',
        period: ''
      }
    }
  },
  methods: {
    init(id) {
      this.ftsi_id=id;
      this.showFTSIDetail();
    },
    async showFTSIDetail() {
      const {data: res} = await this.$http.get('ftsiMgr/detailFTSI/', {params: {'id': this.ftsi_id}})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('failed to get the FTSI details!')
      }
      this.detailForm = res.data['ipsDetail'];
      this.FTSIinfo = res.data['FTSI'];
      this.dialogVisible = true;
    },
    //监听状态的改变
    async statusChanged(stateInfo) {
      console.log(stateInfo)
      const {data: res} = await this.$http.put('ftsiMgr/detailFTSI/statusChange/',
          {'id': stateInfo.id, 'active_status': stateInfo.active_status})
      if (res.meta.status !== 200) {
        stateInfo.active_status = !stateInfo.active_status
        return this.$message.error('failed to update the status of the applied IPS')
      }
    },
    openEditDetailDialog(id) {
      this.$refs.editDetailRef.init(id)
    },
  }
}
</script>

<style lang="less" scoped>

</style>
