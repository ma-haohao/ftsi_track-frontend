<template>
  <el-dialog
      title="Monitor Parameters Settings"
      :visible.sync="dialogVisible"
      width="600px" :close-on-click-modal="false">
    <!--  main content  -->
    <span>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="Warning" name="warning">
          <el-form :model="queryForm" ref="queryFormRef" label-width="120px">
            <el-row :gutter="30">
              <el-col :span="11">
                <el-form-item label="Flight day" prop="w_FD"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.w_FD"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="Flight hour" prop="w_FH"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.w_FH"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11">
                <el-form-item label="Flight cycle" prop="w_FC"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.w_FC"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="engine hour" prop="w_EH"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.w_EH" class="required"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11">
                <el-form-item label="C1 cycle" prop="w_CC"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.w_CC"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="engine starts" prop="w_ES"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.w_ES"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11">
                <el-form-item label="TR cycle" prop="w_RC"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.w_RC"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="Date" prop="w_DATE"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.w_DATE"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <!-- Attention 页  -->
        <el-tab-pane label="Attention" name="attention">
          <el-form :model="queryForm" ref="queryFormRef" label-width="120px">
            <el-row :gutter="30">
              <el-col :span="11">
                <el-form-item label="Flight day" prop="a_FD"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.a_FD"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="Flight hour" prop="a_FH"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.a_FH"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11">
                <el-form-item label="Flight cycle" prop="a_FC"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.a_FC"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="engine hour" prop="a_EH"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.a_EH" class="required"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11">
                <el-form-item label="C1 cycle" prop="a_CC"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.a_CC"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="engine starts" prop="a_ES"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.a_ES"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11">
                <el-form-item label="TR cycle" prop="a_RC"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.a_RC"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="Date" prop="a_DATE"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.a_DATE"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <!--    predict 页    -->
        <el-tab-pane label="Predict" name="predict">
          <el-form :model="queryForm" ref="queryFormRef" label-width="120px">
            <el-row :gutter="30">
              <el-col :span="11">
                <el-form-item label="Flight day" prop="p_FD"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.p_FD"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="Flight hour" prop="p_FH"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.p_FH"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11">
                <el-form-item label="Flight cycle" prop="p_FC"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.p_FC"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="engine hour" prop="p_EH"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.p_EH" class="required"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11">
                <el-form-item label="C1 cycle" prop="p_CC"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.p_CC"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="engine starts" prop="p_ES"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.p_ES"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11">
                <el-form-item label="TR cycle" prop="p_RC"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.p_RC"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="Date" prop="p_DATE"
                              :rules="[{required: true, message: 'cannot be blank.', trigger: 'blur'},
                            {validator:onlyNum}]">
                  <el-input v-model="queryForm.p_DATE"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="changePara">Submit</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "predictResultDisplay",
  data() {
    return {
      activeName: 'warning',
      dialogVisible: false,
      queryForm: {}
    }
  },
  methods: {
    async init() {
      this.dialogVisible = true
      const {data:res}=await this.$http.get('ftsiOpt/obtainPara/')
      console.log(res)
      this.queryForm=res.data
    },
    onlyNum(rule, value, callback) {
      const regNum = /^[0-9]*$/
      if (!regNum.test(value)) {
        callback(new Error('Only int allowed'))
      } else {
        callback()
      }
    },
    async changePara(){
      this.$refs.queryFormRef.validate(async valid => {
        if (!valid) return
        //可以发起添加请求
        const {data: res} = await this.$http.put('ftsiOpt/changePara/', this.queryForm)
        if (res.meta.status !== 200) {return this.$message.error(res.meta.msg)}
        this.$message.success(res.meta.msg)
        this.dialogVisible = false
        this.$emit('updateList')
      })
    }

  }
}
</script>

<style lang="less" scoped>

</style>
