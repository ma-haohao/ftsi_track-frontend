<template>
  <div>
    <!--  breakcrumb navigation  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>History</el-breadcrumb-item>
      <el-breadcrumb-item>Submit Failed</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card style="height:100%;width:100%">
      <!--   ftsi info table area   -->
      <el-table :data="submitList" border stripe :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="Activity Date" prop="activity_date" width="150"></el-table-column>
        <el-table-column label="IPS Num." prop="identification" width="150"></el-table-column>
        <el-table-column label="FTSI Num." prop="ftsi_info" width="150"></el-table-column>
        <el-table-column label="FTSI Title" prop="ftsi_title"></el-table-column>
      </el-table>
    </el-card>
  </div>

</template>

<script>
export default {
  data() {
    return {
      //获取FTSI 信息列表参数对象
      submitList: [],
      total:''
    }
  },
  created() {
    this.getHistoryList()
  },
  methods: {
    async getHistoryList() {
      const {data: res} = await this.$http.get('historyRecord/submitFailed/')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('failed to get the submit failed record')
      }
      this.submitList = res.data.
      this.total = res.data.totalitems
    }
  }
}
</script>

<style lang="less" scoped>

</style>
