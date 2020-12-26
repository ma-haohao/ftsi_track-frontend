<template>
  <div>
    <h3>Welcome</h3>
    <!-- card view   -->
    <el-card style="height:700px;width:850px">
      <el-scrollbar style="height: 650px; width:800px">
        <el-table :data="engineInfo" :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}" border stripe>
          <el-table-column label="Engine" prop="engine"></el-table-column>
          <el-table-column label="Aircraft" prop="aircraft"></el-table-column>
          <el-table-column label="Left or Right" prop="left_right"></el-table-column>
          <el-table-column label="Flight hours" prop="flight_time"></el-table-column>
          <el-table-column label="Flight Day" prop="flight_day"></el-table-column>
          <el-table-column label="Run hours" prop="run_time"></el-table-column>
          <el-table-column label="C1 cycle" prop="c1_cycle"></el-table-column>
        </el-table>
      </el-scrollbar>
    </el-card>

  </div>
</template>

<script>
export default {
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
  }
}

</script>

<style lang="less" scoped>

</style>
