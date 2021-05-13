<template>
  <div>
    <!--  breakcrumb navigation  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>FTSI Manage</el-breadcrumb-item>
      <el-breadcrumb-item>Pending List</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card style="height:100%;width:100%">
      <!--   ftsi info table area   -->
      <el-table :data="pendingList" border stripe :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="FTSI Num" prop="ftsi_no" width="100"></el-table-column>
        <el-table-column label="FTSI Title" prop="ftsi_title"></el-table-column>
        <el-table-column label="Rev." prop="revision" width="60"></el-table-column>
        <el-table-column label="Compliance Statement" prop="statement"></el-table-column>
        <el-table-column label="Issue Date" prop="issue_date" width="120"></el-table-column>
        <el-table-column prop="action_type" label="Action" width="120" show-overflow-tooltip align="center">
          <template scope="scope">
            <div v-if="scope.row.action_type==='add'">
              <el-button type="primary" size="mini"
                           @click="openAddDialog(scope.row)">ADD</el-button>
            </div>
            <div v-if="scope.row.action_type==='update'">
              <el-button type="success" size="mini"
                           @click="opendUpdateDialog(scope.row)">UPDATE</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <addFTSI ref="addFTSIRef" v-on:updateList="getPendingList()"></addFTSI>
    <updateFTSI ref="updateFTSIRef" v-on:updateList="getPendingList()"></updateFTSI>
  </div>

</template>

<script>

export default {
  components: {
    addFTSI: () => import("./addFTSIDialog.vue"),
    updateFTSI: () => import("./updateFTSIDialog.vue")
  },
  data() {
    return {
      //获取FTSI 信息列表参数对象
      pendingList: []
    }
  },
  created() {
    this.getPendingList()
  },
  methods: {
    async getPendingList() {
      const {data: res} = await this.$http.get('ftsiMgr/getPendingList/')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('failed to get the FTSI list')
      }
      this.pendingList = res.data.pending_info
    },
    /*激活不同功能的弹窗*/
    openAddDialog(item) {
      this.$refs.addFTSIRef.initForPending(item)
    },
    opendUpdateDialog(id) {
      this.$refs.updateFTSIRef.initForPending(id)
    },
  }
}
</script>

<style lang="less" scoped>
.el-select {
  width: 150px;
}

</style>
