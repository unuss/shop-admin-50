<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->

    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button @click="searchUser" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button @click="showAddDialog" type="success" plain>添加用户</el-button>

    <!-- 表格 -->
    <el-table :data="userList">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop label="用户状态">
        <template v-slot:default="obj">
          {{obj.row.mg_state}}
          <el-switch
            @change="changeState(obj.row.id, obj.row.mg_state)"
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop label="操作">
        <template v-slot:default="obj">
          <el-button
            plain
            size="small"
            icon="el-icon-edit"
            type="primary"
            @click="showEditDialog( obj.row)"
          ></el-button>
          <el-button
            @click="delUser(obj.row.id)"
            plain
            size="small"
            icon="el-icon-delete"
            type="danger"
          ></el-button>
          <el-button plain size="small" icon="el-icon-check" type="success">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- :current-page="pagenum" 当前页  -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- //添加弹框 -->
    <el-dialog @close="closeDialog" title="添加用户" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button @click="addUser" type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- //修改弹框 -->
    <el-dialog title="修改用户" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button @click="editUser" type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  // data有数据了 才发送请求，生命周期函数
  created () {
    this.getUserlist()
  },
  methods: {
    // 发送ajax获取数据，存储在 getUserlist中，封装一个方法
    async getUserlist () {
      const { meta, data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // const { meta, data } = res
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      //  修改了每页条数后, 之前有些页码就没有了, 推荐: 从第一页开始展示
      this.pagesize = 1
      this.pagesize = val
      this.getUserlist()
    },
    // 更新当前页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserlist()
    },
    // 删除用户
    async delUser (id) {
      // console.log(id)
      try {
        // 等待用户确认
        await this.$confirm('你确认要删除么', '温馨提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`users/${id}`)
        // const { meta } = res
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          // 当前页只有一条数据 删除后页码减一
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
            // 重新渲染
          }
          this.getUserlist()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 搜索用户
    searchUser () {
      this.pagenum = 1
      this.getUserlist()
    },
    // 开关的点击事件 改变状态
    async changeState (id, flag) {
      // console.log(flag)
      // put 全量修改  patch 局部修改 但是以接口为准
      // const res = await this.$axios.put(`users/${id}/state/${flag}`)
      const { meta } = await this.$axios.put(`users/${id}/state/${flag}`)
      // console.log(res)
      // const { meta } = res
      if (meta.status === 200) {
        // console.log(meta.msg)
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 展示弹框 -添加用户
    showAddDialog () {
      this.dialogVisible = true
    },
    // 添加用户
    async addUser () {
      try {
        // 校验 发送AJAX
        await this.$refs.form.validate()
        console.log('校验成功')
        const { meta } = await this.$axios.post('users', this.form)
        // console.log(meta)
        if (meta.status === 201) {
          // 打印正确信息
          this.$message.success(meta.msg)
          // 关闭对话框
          this.dialogVisible = false
          // 每次新添加的放到最后一页 总的条数/页数 向上取整
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          // 重新渲染
          this.getUserlist()
          // 重置下内容
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
      // 发送AJAX
    },
    // 弹框关闭后重置
    closeDialog () {
      this.$refs.form.resetFields()
    },
    // 修改（操作）
    showEditDialog (row) {
      // 修改弹框展示
      this.editVisible = true
      this.editForm.id = row.id
      this.editForm.email = row.email
      this.editForm.username = row.username
      this.editForm.mobile = row.mobile
    },
    async editUser () {
      try {
        // 点击确认时校验
        await this.$refs.editForm.validate()
        const { id, mobile, email } = this.editForm
        // 请求数据
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        // 更新成功
        // console.log(res)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.editVisible = false
          this.getUserlist()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  data () {
    return {
      userList: [],
      query: '',
      // pagenum 当前页
      pagenum: 1,
      // 每页条数
      pagesize: 2,
      total: 0,
      dialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          // 手机号正则
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
        ]
      },
      editVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      }

    }
  }
}
</script>

<style lang="less">
.users {
  .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #c5c5c5;
    margin-bottom: 10px;
  }
  .el-pagination {
    margin-top: 10px;
  }
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
    margin-right: 10px;
  }
}
</style>
