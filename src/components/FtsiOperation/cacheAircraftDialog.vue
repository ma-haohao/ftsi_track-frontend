<template>
  <el-dialog
      title="Change the Cached Aircraft"
      :visible.sync="dialogVisible"
      width="700px">
    <!--  main content  -->
    <span>
        <el-transfer :titles="['Unapplied','Applied']" v-model="cachedAircraft.aircraftNum" :data="IPSdata"></el-transfer>
    </span>
    <!--  foot area  -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">close</el-button>
    <el-button @click="changeCachedAircraft" type="primary">submit</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: "cacheAircraftDialog",
  data() {
    //自定义transfer框中的内容
    const generateIPSData = _ => {
      const data = [];
      for (let i = 1; i <= 6; i++) {
        data.push({
          key: 'AC'+(10100 + i),
          label: 'AC'+`${10100 + i}`,
        });
      }
      return data;
    }
    return {
      IPSdata: generateIPSData(),
      cachedAircraft:{
        aircraftNum:[]
      },
      dialogVisible: false,
    }
  },
  methods: {
    init() {
      this.dialogVisible = true
    },
    async changeCachedAircraft(){
      const {data:res}=await this.$http.put('userOpt/changeCachedArea/', this.cachedAircraft)
      console.log(res)

      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
