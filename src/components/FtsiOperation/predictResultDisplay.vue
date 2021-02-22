<template>
  <el-dialog
      title="Results for the Predicted flight parameters"
      :visible.sync="dialogVisible"
      width="800px">
    <!--  main content  -->
    <span v-show="showOnWingPredict">
      <div>
        <!--    左发    -->
        <h3>LHE: {{ results.leftIPS.engine }}</h3>
        <el-table :data="results.ftsiForLeft" border stripe
                  :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}" style="font-size: 13px">
          <el-table-column label="FTSI Num." prop="ftsi_info.ftsi_num,ftsi_info.rev" width="110">
                <template slot-scope="scope"> {{ scope.row.ftsi_info.ftsi_num }} Rev. {{ scope.row.ftsi_info.rev }}
                </template>
          </el-table-column>
          <el-table-column label="FTSI Title" prop="ftsi_info.ftsi_title"></el-table-column>
          <el-table-column label="Comments" prop="content">
            <template slot-scope="scope"> {{ scope.row.content }} left.
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <!--    右发    -->
        <h3>RHE: {{ results.rightIPS.engine }}</h3>
        <el-table :data="results.ftsiForRight" border stripe
                  :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}" style="font-size: 13px">
          <el-table-column label="FTSI Num." prop="ftsi_info.ftsi_num,ftsi_info.rev" width="110">
                <template slot-scope="scope"> {{ scope.row.ftsi_info.ftsi_num }} Rev. {{ scope.row.ftsi_info.rev }}
                </template>
          </el-table-column>
          <el-table-column label="FTSI Title" prop="ftsi_info.ftsi_title"></el-table-column>
          <el-table-column label="Comments" prop="content">
            <template slot-scope="scope"> {{ scope.row.content }} left.
            </template>
          </el-table-column>
        </el-table>
      </div>
    </span>
    <span v-show="showOffWingPredict">
      <div>
        <!--    左发    -->
        <h3>Off Wing IPS: {{ results.leftIPS.engine }}</h3>
        <el-table :data="results.ftsiForLeft" border stripe
                  :header-cell-style="{backgroundColor:'#6BA4FD', color:'#ffffff'}" style="font-size: 13px">
          <el-table-column label="FTSI Num." prop="ftsi_info.ftsi_num,ftsi_info.rev" width="110">
                <template slot-scope="scope"> {{ scope.row.ftsi_info.ftsi_num }} Rev. {{ scope.row.ftsi_info.rev }}
                </template>
          </el-table-column>
          <el-table-column label="FTSI Title" prop="ftsi_info.ftsi_title"></el-table-column>
          <el-table-column label="Comments" prop="content">
            <template slot-scope="scope"> {{ scope.row.content }} left.
            </template>
          </el-table-column>
        </el-table>
      </div>
    </span>
    <!--  foot area  -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible=false">close</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: "predictResultDisplay",
  data() {
    return {
      dialogVisible: false,
      showOnWingPredict:true,
      showOffWingPredict:false,
      results: {
        leftIPS:{},
        rightIPS:{}
      }
    }
  },
  methods: {
    init(info) {
      this.results = info
      this.showOnWingPredict = this.results.rightIPS.engine !== 'NA';
      this.showOffWingPredict=!this.showOnWingPredict
      this.dialogVisible = true
      console.log(this.results)
    },
  }
}
</script>

<style lang="less" scoped>

</style>
