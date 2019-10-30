<template>
  <div class="login">
    <!-- <img src="../assets/touxiang.jpg" alt=""> -->

    <el-form :rules="rules" class="my-form" ref="form" :model="form" label-width="80px">
      <img src="../assets/tuoxiang.jpg" class="touxiang" alt />
      <el-form-item label="用户名:" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn" type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['change', 'blur'] },
          { min: 3, max: 12, message: '用户名长度必须是3-12位', trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['change', 'blur'] },
          { min: 3, max: 12, message: '密码长度必须是3-12位', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    reset () {
      // 重置
      this.$refs.form.resetFields()
    },
    async  login () {
      await this.$refs.form.validate()
      const { meta, data } = await this.$axios.post('login',
        this.form)
      // const { meta, data } = res
      if (meta.status === 200) {
        localStorage.setItem('token', data.token)
        console.log(meta.msg)
        this.$message({
          message: '登陆成功',
          type: 'success'
        })
        this.$router.push({ name: 'index' })
      } else {
        console.log(meta.msg)
        this.$message.error('登陆失败')
      }
    }
  }
}
</script>

<style  lang="less">
* {
  margin: 0;
  padding: 0;
}
body {
  background: #2d434c;
}
.my-form {
  width: 400px;
  background-color: #fff;
  padding: 20px;
  padding-top: 70px;
  margin: 0 auto;
  margin-top: 200px;
  border-radius: 20px;
  position: relative;
}
.btn {
  margin: 80px;
}

.touxiang {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 2px solid pink;
  position: absolute;
  top: -75px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 60px;
}
</style>
