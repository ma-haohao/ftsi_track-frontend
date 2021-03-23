<template>
  <div>
    <h3>Welcome</h3>
    <!-- card view   -->
    <el-card style="height:700px;width:900px">
      <!--   search and add area   -->
      <el-form ref="dateFormRef" :model="dateForm">
        <el-form-item prop="submitDate" class="required"
                      :rules="[{required: true, message: 'please enter the date', trigger: 'blur'}]">
          <el-date-picker v-model="dateForm.submitDate" type="date"
                        placeholder="Choose date"
                        style="width:190px" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
          <el-button type="primary" style="margin-left: 20px" @click="submitEngineInfo">Submit</el-button>
        </el-form-item>
      </el-form>
      <!--  发动机数据    -->
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
      engineInfo: [],
      dateForm:{
        submitDate: ""
      }
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
    },
    async submitEngineInfo(){
      this.$refs.dateFormRef.validate(async valid => {
        if (!valid) return
        //可以发起添加请求
        const {data: res} = await this.$http.put('common/submitEngineHistory/', this.dateForm)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
      })
    }
  }
}

</script>

<style lang="less" scoped>

</style>
