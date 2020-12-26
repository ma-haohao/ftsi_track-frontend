<template>
  <el-dialog
      title="Condition for Applied IPS"
      :visible.sync="dialogVisible"
      width="900px">
    <!--  main content  -->
    <span>
      <span>
        <a>FTSI: LEAP-1C-FTSI-{{ detailForm['FTSI']['ftsi_num'] }} Rev. {{ detailForm['FTSI']['rev'] }}</a><br>
        <a>FTSI Title: {{ detailForm['FTSI']['ftsi_title'] }}</a><br>
        <a>Compliance Statement: {{ detailForm['FTSI']['statement'] }}</a><br>
        <a>Monitor Type: {{ detailForm['FTSI']['dep_type'] }}</a><br>
        <a>Period: {{ detailForm['FTSI']['period'] }}</a>
      </span>

      <!--   table area: FTSI for different engines   -->
      <el-table :data="detailForm['ipsDetail']" border stripe
                :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}">
        <el-table-column label="Applied IPS" prop="engine_id"></el-table-column>
        <el-table-column label="Last implement date" prop="last_date"></el-table-column>
        <el-table-column label="Next target" prop="next_target"></el-table-column>
        <el-table-column label="Residual times" prop="residual_times"></el-table-column>
        <el-table-column label="Status" width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.active"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="100" align="center">
          <template slot-scope="scope">
            <!--     文件编辑按钮       -->
            <el-tooltip effect="dark" content="Edit" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </span>
    <!--  foot area  -->
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">Close</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: "addFTSI",
  data() {
    return {
      dialogVisible: false,
      //查询到的FTSI的细节信息
      detailForm: {}

    }
  },
  methods: {
    init(id) {
      this.showFTSIDetail(id);
    },
    async showFTSIDetail(id) {
      const {data: res} = await this.$http.get('ftsiMgr/detailFTSI/', {params: {'id': id}})
      if (res.meta.status !== 200) {
        return this.$message.error('failed to get the FTSI details!')
      }
      this.detailForm = res.data;
      this.dialogVisible = true;
    }
  }
}
</script>

<style lang="less" scoped>

</style>
