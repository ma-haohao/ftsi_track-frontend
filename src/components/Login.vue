<template>
  <div class="login_container">
    <div class="login_box">
      <h1>LOGIN</h1>
      <el-form ref="loginFormRef" label-width="0px" :model="loginForm" :rules="loginFormRules">
        <!--   用户名区域     -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-dengluyonghu" placeholder="Username"
                    type="username"></el-input>
        </el-form-item>
        <!--   用户密码区域     -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-denglu-mima" placeholder="Password"
                    type="password" @keyup.enter.native="login"></el-input>
        </el-form-item>
        <!--   按钮区域     -->
        <el-form-item class="btn1">
          <el-button type="primary" round @click="login" >Login</el-button>
          <el-button type="info" round @click="resetLoginForm">Reset</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>


<!---------------------------------------------------------------------------------->
<script>
export default {
  data() {
    return {
      /*the data instances for login form*/
      loginForm: {
        username: "",
        password: "",
      },
      /*input pre-validation rules*/
      loginFormRules: {
        username: [
          {required: true, message: 'please enter the account number', trigger: 'blur'},
          //{ min: 5, max: 10, message: 'The length must be between 5-10.', trigger: 'blur' }
        ],
        password: [
          {required: true, message: 'please enter the password', trigger: 'blur'},
          //{ min: 8, max: 15, message: 'The length must be between 8-15.', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /*点击重置输入框*/
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    /*登录函数，包括数据的预校验以及后台数据验证*/
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const {data:res}=await this.$http.post('login/userLogin/',this.loginForm);
        console.log(res)
        if(res.meta.status!==200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        window.sessionStorage.setItem('token',res.data.token);
        this.$router.push('/home')

      });
    }
  }
}
</script>


<!---------------------------------------------------------------------------------->
<style lang="less" scoped>

.el-icon-circle-check:before {
  color: #000000;
}

.login_container {
  background-image: url("../assets/background.jpeg");
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
}

.login_box {
  padding: 20px 50px;
  background-color: #ffffff90;
  width: 400px;
  height: 300px;
  border-radius: 10px;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  button {
    margin-top: 10px;
    width: 120px;
    font-size: 16px;
    padding: 10px 10px;
  }

}
</style>
