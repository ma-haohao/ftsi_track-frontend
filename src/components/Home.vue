<template>
  <el-container class="home-container">
    <!--    头部区域  -->
    <el-header>
      <div>
        <img src="../assets/GE_Logo.png" alt="">
        <span>FTSI Tracking System</span>
      </div>
      <el-button type="info" @click="logout" id="logout_button">
        <span class="iconfont icon-tuichudenglu"> LOGOUT</span>
      </el-button>
    </el-header>
    <!--    页面主体区  -->
    <el-container>
      <!--    侧边栏  -->
      <el-aside :width="isCollapse? '64px' :'200px'">
        <div class="toggle-buttun" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened
                 :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">

          <!-- 一级菜单 -->
          <el-submenu :index="item.id+' '" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                          @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>

            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--    右侧内容主题  -->
      <el-main>
        <!--    路由占位符    -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  <!-- logout按钮 -->

</template>

<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menulist: [],
      iconsObj: {
        '101': 'iconfont icon-database-fill',
        '201': 'iconfont icon-databaseset-fill',
        '301': 'iconfont icon-user-fill'
      },
      isCollapse: true,
      activePath:''
    }
  },
  created() {
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    /*按下logout按钮的触发事件*/
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取所有的菜单
    async getMenuList() {
      const {data: res} = await this.$http.get('common/menus/')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data;
      //console.log(res)
    },
    //点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath=activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  align-items: center;
  color: white;
  font-size: 30px;

  > div {
    display: flex;
    align-items: center;

    img {
      height: 50px;
    }

    span {
      margin-left: 15px;
    }
  }

  /*style for logout buttun*/

  #logout_button {
    padding: 10px 10px;

    span {
      font-size: 10px;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: None;
  }
}

.el-main {
  background-color: #EAEDF1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-buttun {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: white;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>
