<template>
  <div>
    <h3>Welcome</h3>
    <!-- card view   -->
    <el-card style="height:700px;width:900px">
      <el-scrollbar style="height: 650px; width:850px">
        <el-table :data="engineInfo" :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}" border stripe>
          <el-table-column label="Engine" prop="engine"></el-table-column>
          <el-table-column label="Aircraft" prop="aircraft"></el-table-column>
          <el-table-column label="Left/Right" prop="left_right"></el-table-column>
          <el-table-column label="Flight hours" prop="flight_time"></el-table-column>
          <el-table-column label="Flight Day" prop="flight_day"></el-table-column>
          <el-table-column label="Run hours" prop="run_time"></el-table-column>
          <el-table-column label="C1 cycle" prop="c1_cycle"></el-table-column>
          <el-table-column label="Operation" width="100" align="center">
            <template slot-scope="scope">
              <!--     文件编辑按钮       -->
              <el-tooltip effect="dark" content="Edit" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-edit" size="mini"
                           @click="openEngineEditDialog(scope.row.engine)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-card>
    <engineEdit ref="engineEditRef"></engineEdit>
  </div>
</template>

<script>
export default {
  components: {
    engineEdit: () => import("./engineEditDialog.vue"),
  },
  created() {
    this.getEngineInfoList()
  },
  data() {
    return {
      engineInfo: []
    }
  },
  methods: {
    /*获取发动机的信息数据，并赋值给engineInfo*/
    async getEngineInfoList() {
      const {data: res} = await this.$http.get("common/engineInfo/");
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error("failed to get the information")
      }
      this.engineInfo = res.data
    },
    async openEngineEditDialog(engineNum){
      this.$refs.engineEditRef.init(engineNum)
    }
  }
}

</script>

<style lang="less" scoped>

</style>
