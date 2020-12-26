<template>
  <el-dialog
      title="Add new FTSI"
      :visible.sync="dialogVisible"
      width="800px" :close-on-click-modal="false" @close="addDialogClose">
    <!--  main content  -->
    <span>
      <el-form ref="addFormRef" label-width="150px" :model="addForm" :rules="addFormRules">
        <!--   FTSI号区域     -->
        <el-form-item label="FTSI Number" prop="FTSI_num">
          <el-row :gutter="0">
            <el-col :span="9">
              <el-input class="shortInputForm" v-model="addForm.FTSI_num"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary">Check</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <!--   版本号区域     -->
        <el-form-item label="Rev." prop="revision" class="required">
          <el-input class="shortInputForm" v-model="addForm.revision"></el-input>
        </el-form-item>
        <!--   FTSI title区域     -->
        <el-form-item label="FTSI Title">
          <el-input type="textarea" class="longInputForm" v-model="addForm.FTSI_title"></el-input>
        </el-form-item>
        <!--   Compliance Statement区域     -->
        <el-form-item label="Compliance Stat.">
          <el-input type="textarea" class="longInputForm" v-model="addForm.compliance"></el-input>
        </el-form-item>
        <!--   监控类型区域     -->
        <el-form-item label="Monitor Type" prop="type" class="required">
          <el-select placeholder="Please choice" v-model="addForm.type">
            <el-option label="--Please choice--" value=""></el-option>
            <el-option label="Flight day dependence" value="FD"></el-option>
            <el-option label="Flight hour dependence" value="FH"></el-option>
            <el-option label="Engine hour dependence" value="EH"></el-option>
            <el-option label="C1 cycle dependence" value="CC"></el-option>
            <el-option label="Date dependence" value="DATE"></el-option>
            <el-option label="On condition" value="OTHER"></el-option>
          </el-select>
        </el-form-item>
        <!--   执行周期区域     -->
        <el-form-item label="Period">
          <el-input class="shortInputForm" v-model="addForm.period"></el-input>
        </el-form-item>
        <!--   执行频率区域     -->
        <el-form-item label="Implement Times" prop="times" class="required">
          <el-input class="shortInputForm" v-model="addForm.times"></el-input>
        </el-form-item>
        <!--   Applied IPS区域     -->
        <el-form-item label="Applied IPS" prop="appliedIPS">
          <el-transfer :titles="['Unapplied','Applied']" v-model="addForm.appliedIPS" :data="IPSdata"></el-transfer>
        </el-form-item>
      </el-form>
    </span>
    <!--  foot area  -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="addFTSI">Submit</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "addFTSI",
  data() {
    const generateIPSData = _ => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: 600100+i,
          label: `${ 600100+i }`,
        });
      }
      return data;
    };
    return {
      IPSdata: generateIPSData(),
      dialogVisible: false,
      activeDisabled:false,
      addForm:{
        FTSI_num:'',
        revision:'',
        FTSI_title:'',
        compliance:'',
        type:'',
        period:'',
        times:'',
        appliedIPS: []
      },
      addFormRules:{
        FTSI_num: [
          {required: true, message: 'please enter the FTSI number', trigger: 'blur'},
        ],
        revision: [
          {required: true, message: 'please enter the Revision', trigger: 'blur'},
        ],
        type: [
          {required: true, message: 'please choose the monitor type', trigger: 'change'},
        ],
        times: [
          {required: true, message: 'please enter total implement times', trigger: 'blur'},
        ],
        appliedIPS: [
          {required: true, message: 'At least one IPS must be chosen', trigger: 'change'},
        ],
      }
    }
  },
  methods: {
    init() {
      this.dialogVisible = true;
    },
    //监听添加对话框的关闭事件
    addDialogClose(){
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮，添加新的FTSI
    addFTSI(){
      this.$refs.addFormRef.validate(async valid=>{
        console.log(valid)
        if(!valid) return
        //可以发起添加请求
        const {data:res}=await this.$http.post('ftsiMgr/addFTSI/',this.addForm)
        console.log(res)
        if(res.meta.status!==201){
          this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.dialogVisible=false
        //重新获取更新后的FTSI列表
        this.$parent.getFTSIList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.shortInputForm{
  width: 193px;
}
.longInputForm{
  width: 580px;
}
</style>
