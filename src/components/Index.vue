<template>
  <div class="index">
    <el-container>
      <el-header>
        <div class="logo">
          <img src="../assets/logo.png" alt />
        </div>
        <div class="title">
          <h3>电商后台管理系统--练习1</h3>
        </div>
        <div class="logout">
          欢迎光临~
          <a @click="logout" href="javascript:;">退出</a>
        </div>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <el-menu
            unique-opened
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
          <!-- 用户管理 -->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">用户列表</span>
              </el-menu-item>
            </el-submenu>
            <!-- 权限管理 -->
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item index="2-1">
                <i class="el-icon-menu"></i>
                <span slot="title">角色列表</span>
              </el-menu-item>
              <el-menu-item index="2-2">
                <i class="el-icon-menu"></i>
                <span slot="title">权限列表</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体 -->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$confirm('是否退出', '温馨提示', {
        type: 'warning'
      })
        .then(() => {
          /// / 销毁本地的token
          localStorage.removeItem('token')
          // 跳转到登录页
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消'
          })
        })
    }
  }
}
</script>

<style  lang="less" >
.index,
.el-container {
  height: 100%;
  .el-header {
    display: flex;
    background-color: #d8d8d8;
    .logo {
      width: 180px;
      img {
        height: 40px;
        margin: 10px;
      }
    }
    .title {
      flex: 1;
      height: 60px;
      line-height: 60px;
      text-align: center;
      h3 {
        height: 60px;
        color: #545c64;
      }
    }
    .logout {
      height: 60px;
      line-height: 60px;
      a {
        color: orange;
      }
    }
  }

  .el-aside {
    background-color: #545c64;
    .el-menu {
      border: none;
    }
  }
  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
