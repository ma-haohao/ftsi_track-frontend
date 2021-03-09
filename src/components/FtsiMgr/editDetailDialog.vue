<template>
  <el-dialog
      title="Edit FTSI instance for different IPS"
      :visible.sync="dialogVisible"
      width="800px" :close-on-click-modal="false" @close="editDialogClose" append-to-body>
    <!--  main content  -->
    <span>
      <el-form ref="editDetailFormRef" label-width="150px" :model="editDetailForm" @close="editDetailClose">
        <!--   FTSI号区域     -->
        <el-form-item label="FTSI Num">
          <el-col :span="9">
            <el-form-item>
            <el-input class="shortInputForm" :value="editDetailForm.ftsi_num" disabled></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="13">
            <!--   激活状态    -->
            <el-form-item label="Status">
              <el-switch v-model="editDetailForm.active_status"></el-switch>
            </el-form-item>
          </el-col>
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
            <!--   执行类型区域     -->
            <el-form-item label="Monitor type">
              <el-input class="shortInputForm" :value="editDetailForm.dep_type" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!--   上一次执行的时间区域     -->
        <el-form-item label="Last Implement Date">
          <el-input class="shortInputForm" v-model="editDetailForm.last_date"></el-input>
        </el-form-item>
        <!--    Customize的情况下分段选择区域    -->
        <el-form-item label="Customize Step" v-show="showCustomizeType">
          <el-select placeholder="Please choice" v-model="editDetailForm.current_type" @change="customizeTypeJudge">
                  <el-option v-for="item in editDetailForm.customize" :label="item.type_value+': '+item.type_label" :value="item.type_value"></el-option>
                </el-select>
        </el-form-item>
        <!-- 下次执行时间区域-type1-->
        <el-form-item label="Next Target" v-show="showType1">
          <el-input class="shortInputForm" v-model="editDetailForm.next_target" @blur="calLeftTime"></el-input>
          <a> {{ editDetailForm.unit }}, {{ left_time }} {{ editDetailForm.unit }} left.</a>
        </el-form-item>
        <!--   下次执行时间区域-type2 for date    -->
        <el-form-item label="Next Target" v-show="showType2">
          <el-date-picker v-model="editDetailForm.dateStorage" type="date"
                          placeholder="Choose date"
                          style="width:190px" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @blur="dateTransfer"></el-date-picker>
        </el-form-item>
        <!--   剩余次数区域     -->
        <el-form-item label="Residual Times">
          <el-input class="shortInputForm" v-model="editDetailForm.residual_times"></el-input>
        </el-form-item>
      </el-form>
    </span>
    <!--  foot area  -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="editDetailInfo">Submit</el-button>
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
        issueDate:"",
        engine_info: {},
        customize: {},
        dateStorage:''
      },
      left_time: "",
      //用于控制不同type下的表单可视与否
      showType1:'',
      showType2:'',
      showCustomizeType:'',
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
      this.editDetailForm = res.data
      this.typeJudge()
      this.dialogVisible = true;
      this.calLeftTime()
    },
    //监听表单关闭事件
    editDetailClose(){
      this.$refs.editDetailFormRef.resetFields()
    },
    //监听monitor type参数，并且返回对应该类型所用的表格类型
    isInArray(arr,value){
      for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
          return true;
        }}
      return false
    },
    typeJudge(){
      const arr=['OTHER','DATE','trigger_factor']
      const arr2=['dep_type1','dep_type2','dep_type3']
      var current_type=''
      this.showCustomizeType =this.isInArray(['Customize'], this.editDetailForm.dep_type);
      if (this.isInArray(arr2,this.editDetailForm.current_type)){
        current_type=this.editDetailForm.customize[this.editDetailForm.current_type]['type_label']
      }else{current_type=this.editDetailForm.current_type}
      this.showType1 = !this.isInArray(arr, current_type);
      this.showType2 =this.isInArray(['DATE'],current_type);
      if(this.isInArray(['DATE'],current_type)){this.editDetailForm.dateStorage=this.editDetailForm.next_target}
    },
    customizeTypeJudge(){
      this.typeJudge()
      if(this.editDetailForm.current_type!=='trigger_factor'){
        var current_type=this.editDetailForm.customize[this.editDetailForm.current_type]
        this.editDetailForm.residual_times=current_type['total_times']
        this.editDetailForm.DB_keyword=current_type['DB_keyword']
        this.editDetailForm.unit=current_type['unit']
        if(!this.isInArray(['DATE','OTHER'],current_type['type_label'])){
          this.editDetailForm.next_target=(this.editDetailForm.engine_info[current_type['DB_keyword']]+parseInt(current_type['period']))+''
        }else{
          this.editDetailForm.next_target=''
        }
        this.calLeftTime()
      }
    },
    //监听添加对话框的关闭事件
    editDialogClose() {
      this.$refs.editDetailFormRef.resetFields()
    },
    //监听Next_target的变化，并得到剩余时间的变化值
    calLeftTime() {
      this.left_time = (parseFloat(this.editDetailForm.next_target) - this.editDetailForm.engine_info[this.editDetailForm.DB_keyword]).toFixed(0)
    },
    dateTransfer(){
      this.editDetailForm.next_target=this.editDetailForm.dateStorage
      console.log(this.editDetailForm.next_target)
    },
    async editDetailInfo(){

      const {data:res}=await this.$http.put('ftsiMgr/detailFTSI/infoChange/',this.editDetailForm)
      if(res.meta.status!==200){
        return this.$message.error(res.meta.msg)
      }
      this.dialogVisible=false
      this.$message.success(res.meta.msg)
      this.$emit('updateList')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
