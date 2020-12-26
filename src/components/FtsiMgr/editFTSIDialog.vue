<template>
  <el-dialog
      title="edit FTSI"
      :visible.sync="dialogVisible"
      width="50%" :close-on-click-modal="false">
    <!--  main content  -->
    <span>This is a message</span>
    <!--  foot area  -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: "addFTSI",
  data(){
    return{
      dialogVisible:false
    }
  },
  methods:{
    init(){
      this.dialogVisible=true;
    }
  }
}
</script>

<style lang="less" scoped>

</style>
