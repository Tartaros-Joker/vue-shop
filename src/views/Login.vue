<!-- eslint-disable vue/multi-word-component-names -->
<template>
 <div class="login_container">
  <div class="login_box">
    <!-- 图片 -->
    <div class="login_img">
      <img src="../assets/logo.png" alt="">
    </div>
    <div>
      <!-- 输入区域 -->
      <el-form class="login_ipt" :model="loginForm" :rules="login_rules" ref="loginFromRef">
        <el-form-item prop="username">
          <el-input  v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input   v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
          <!-- 按钮区域 -->
          <div class="login_but">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="loginReset">重置</el-button></div>
        </el-form>
    </div>
  </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      login_rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 7 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginReset () {
      console.log(this)
      this.$refs.loginFromRef.resetFields()
    },
    login () {
      this.$refs.loginFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message({
          message: '登陆成功',
          type: 'success'
        })
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height:100%;
}
.login_box{
  background-color: white;
  width:450px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.login_img{
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  position: absolute;
  left:50%;
  transform: translate(-50%,-50%);
}
img{
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
  .login_ipt{
  padding: 20px;
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  top: 80px;}
.login_but{
  padding-left: 260px;
}
</style>
