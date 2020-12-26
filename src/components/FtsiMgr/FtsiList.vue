<template>
  <div>
    <!--  breakcrumb navigation  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>FTSI Manage</el-breadcrumb-item>
      <el-breadcrumb-item>FTSI List</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card style="height:100%;width:100%">
      <!--   search and add area   -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="Please enter what you are searching for" v-model="queryInfo.input"
                    class="input-with-select" @keyup.enter.native="getFTSIList">
            <el-select v-model="queryInfo.select" slot="prepend" placeholder="According to">
              <el-option label="FTSI Num." value="ftsi_num"></el-option>
              <el-option label="FTSI Title" value="ftsi_title"></el-option>
              <el-option label="Type" value="dep_type"></el-option>

            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="getFTSIList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="openAddDialog">Add FTSI</el-button>
        </el-col>

      </el-row>
      <!--   ftsi info table area   -->
      <el-table :data="ftsiList" border stripe :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="FTSI Num" prop="ftsi_num" width="100"></el-table-column>
        <el-table-column label="FTSI Title" prop="ftsi_title"></el-table-column>
        <el-table-column label="Rev." prop="rev" width="60"></el-table-column>
        <el-table-column label="Compliance Statement" prop="statement"></el-table-column>
        <el-table-column label="Type" prop="dep_type" width="200"></el-table-column>
        <el-table-column label="Operation" width="200">
          <template slot-scope="scope">
            <!--     details: 显示该文件适用的每个发动机的情况       -->
            <el-tooltip effect="dark" content="Details" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-s-order" size="mini" @click="opendDetailDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!--     文件编辑按钮       -->
            <el-tooltip effect="dark" content="Edit" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="opendEditDialog"></el-button>
            </el-tooltip>
            <!--     文件升版按钮       -->
            <el-tooltip effect="dark" content="Update" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-upload2" size="mini" @click="opendUpdateDialog"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
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
    <addFTSI ref="addFTSIRef"></addFTSI>
    <detailFTSI ref="detailFTSIRef"></detailFTSI>
    <editFTSI ref="editFTSIRef"></editFTSI>
    <updateFTSI ref="updateFTSIRef"></updateFTSI>
  </div>

</template>

<script>

export default {
  components: {
    addFTSI: () => import("./addFTSIDialog.vue"),
    detailFTSI: () => import("./detailFTSIDialog.vue"),
    editFTSI: () => import("./editFTSIDialog.vue"),
    updateFTSI: () => import("./updateFTSIDialog.vue")
  },
  data() {
    return {
      //获取FTSI 信息列表参数对象
      queryInfo: {
        select: '',
        input: '',
        pagenum: 1,
        pagesize: 10
      },
      ftsiList: [],
      total: 0,
    }
  },
  created() {
    this.getFTSIList()
  },
  methods: {
    async getFTSIList() {
      const {data: res} = await this.$http.get('ftsiMgr/getFTSI/', {params: this.queryInfo})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('failed to get the FTSI list')
      }
      this.ftsiList = res.data.ftsi_info
      this.total = res.data.totalitems
    },
    /*监听pagesize改变的事件*/
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getFTSIList()
    },
    /*监听页码值改变的事件*/
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getFTSIList()
    },
    /*激活不同功能的弹窗*/
    openAddDialog() {
      this.$refs.addFTSIRef.init()
    },
    opendUpdateDialog() {
      this.$refs.updateFTSIRef.init()
    },
    opendDetailDialog(id) {
      this.$refs.detailFTSIRef.init(id)
    },
    opendEditDialog() {
      this.$refs.editFTSIRef.init()
    }
  }
}
</script>

<style lang="less" scoped>
.el-select {
  width: 150px;
}

</style>
