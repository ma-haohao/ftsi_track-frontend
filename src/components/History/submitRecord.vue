<template>
  <div>
    <!--  breakcrumb navigation  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>History</el-breadcrumb-item>
      <el-breadcrumb-item>Submit Record</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card style="height:100%;width:100%">
      <!--   search and add area   -->
      <el-input placeholder="Please enter what you are searching for" v-model="queryInfo.input"
                class="input-with-select" @keyup.enter.native="getFTSIList" style="width: 700px">
        <el-select v-model="queryInfo.select" slot="prepend" placeholder="According to">
          <el-option label="Implement Date" value="date"></el-option>
          <el-option label="A/C MSN" value="aircraft"></el-option>
          <el-option label="Engine" value="engine"></el-option>
          <el-option label="FTSI info." value="ftsi_info"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getFTSIList"></el-button>
      </el-input>

      <!--   ftsi info table area   -->
      <el-table :data="submitList" border stripe :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="Date" prop="date" width="150"></el-table-column>
        <el-table-column label="A/C MSN" prop="aircraft" width="120"></el-table-column>
        <el-table-column label="Engine" prop="engine" width="100"></el-table-column>
        <el-table-column label="FTSI info." prop="ftsi_info"></el-table-column>
        <el-table-column label="Implement info." prop="implement_info" width="200"></el-table-column>
        <el-table-column label="Next step" prop="next_step" width="200"></el-table-column>
      </el-table>
      <!--  分页区域    -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
  </div>

</template>

<script>
export default {
  data() {
    return {
      //获取FTSI 信息列表参数对象
      queryInfo: {
        select: '',
        input: '',
        pagenum: 1,
        pagesize: 10
      },
      submitList: [],
      total: 0,
    }
  },
  created() {
    this.getHistoryList()
  },
  methods: {
    async getHistoryList() {
      const {data: res} = await this.$http.get('historyRecord/submitHistory/', {params: this.queryInfo})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('failed to get the history submit list')
      }
      this.submitList = res.data.submit_info
      this.total = res.data.totalitems
    },
    /*监听pagesize改变的事件*/
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getHistoryList()
    },
    /*监听页码值改变的事件*/
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getHistoryList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-select {
  width: 150px;
}

</style>
