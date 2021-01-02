<template>
  <el-dialog
      title="Edit FTSI instance for different IPS"
      :visible.sync="dialogVisible"
      width="800px" :close-on-click-modal="false" @close="editDialogClose">
    <!--  main content  -->
    <span>
      <el-form ref="editDetailFormRef" label-width="150px" :model="editDetailForm">
        <!--   FTSI号区域     -->
        <el-form-item label="FTSI Num">
          <el-input class="shortInputForm"
                    :value="editDetailForm.ftsi_num"
                    disabled></el-input>
        </el-form-item>
        <!--   FTSI title区域     -->
        <el-form-item label="FTSI Title" v-show="true">
          <el-input type="textarea" class="longInputForm" :value="editDetailForm.ftsi_title" disabled></el-input>
        </el-form-item>
        <!--   Compliance Statement区域     -->
        <el-form-item label="Compliance Stat.">
          <el-input type="textarea" class="longInputForm" :value="editDetailForm.statement" disabled></el-input>
        </el-form-item>
        <!--   Applied engine区域     -->
        <el-form-item label="Applied IPS">
          <el-col :span="9">
            <el-form-item>
              <el-input class="shortInputForm" :value="editDetailForm.engine_id" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <!--   执行频率区域     -->
            <el-form-item label="Monitor type">
              <el-input class="shortInputForm" :value="editDetailForm.dep_type" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="Last Implement Date">
          <el-input class="shortInputForm" v-model="editDetailForm.last_date"></el-input>
        </el-form-item>
        <el-form-item label="Next Target">
          <el-input class="shortInputForm" v-model="editDetailForm.next_target"></el-input>
          <a> FH</a>
        </el-form-item>
        <el-form-item label="Residual Times">
          <el-input class="shortInputForm" v-model="editDetailForm.residual_times"></el-input>
        </el-form-item>
      </el-form>
    </span>
    <!--  foot area  -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="dialogVisible = false">Submit</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: "editDetail",
  data() {
    return {
      dialogVisible: false,
      editDetailForm: {
        ftsi_info: {
          engine_info:{},
          customize: {}
        }
      }
    }
  },
  methods: {
    //打开编辑窗口时发送request，向后端请求该项的原始数据
    async init(id) {
      //console.log(id)
      const {data: res} = await this.$http.get('ftsiMgr/detailFTSI/getInfo/', {params: {'id': id}});
      if (res.meta.status !== 200) {
        return this.$message.error('failed to obtain the info')
      }
      console.log(res)
      this.editDetailForm = res.data.ftsi2ipsInfo
      this.dialogVisible = true;
    },
    //监听添加对话框的关闭事件
    editDialogClose() {
      this.$refs.editDetailFormRef.resetFields()
    },
  }
}
</script>

<style lang="less" scoped>

</style>
