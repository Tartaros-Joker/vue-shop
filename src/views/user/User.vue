<!-- eslint-disable vue/multi-word-component-names -->
<template lang="">
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <div>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserlist">
              <el-button slot="append" icon="el-icon-search" @click="getUserlist" class="btn"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6"><el-button type="primary" plain @click="adddialogVisible = true">添加用户</el-button></el-col>
        </el-row>
        <!-- 列表区域 -->
        <el-table :data="userlist" style="width: 100%" border>
          <el-table-column label="#" type="index"> </el-table-column>
          <el-table-column prop="username" label="姓名"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>
          <el-table-column label="状态" v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStatechange(scope.row)"> </el-switch>
          </el-table-column>
          <el-table-column label="操作" width="230px" v-slot="scope">
            <el-tooltip effect="dark" content="修改角色" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" @click="showEditdialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="配置角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" @click="showsetRoledialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除角色" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
            </el-tooltip>
          </el-table-column>
        </el-table>
        <div class="block">
          <span class="demonstration"></span>
          <!-- 页码等底部 -->
          <el-pagination layout="prev, pager, next,sizes" :total="total" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" :current-page="queryInfo.pagenum" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
        </div>
        <!-- 添加用户弹窗 -->
        <el-dialog title="提示" :visible.sync="adddialogVisible" width="50%" @close="adddialogClose">
          <el-form :model="addForm" status-icon :rules="rules" ref="RefaddForm" label-width="100px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="addForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model.number="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="adddialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改用户弹窗 -->
        <el-dialog title="修改用户信息" :visible.sync="EditdialogVisible" @close="editdialogCloese">
          <el-form :model="editForm" :rules="rules" ref="RefeditForm" label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="EditdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeUser">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 配置角色弹窗 -->
        <el-dialog title="配置角色信息" :visible.sync="setRoledialogVisible" @close="setRoledialogCloese">
          <el-form :model="editForm" :rules="rules" ref="RefeditForm" label-width="100px">
            <p>当前的用户:{{ setForm.username }}</p>
            <p>当前的角色:{{ setForm.role_name }}</p>
            <p>分配角色</p>
            <el-select v-model="setrole" placeholder="请选择">
              <el-option v-for="item in rolelist" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
            </el-select>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="setRoledialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="savechangeRole">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    const checkUname = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (value.length < 2) {
        callback(new Error('用户名过短'))
      } else if (value.length > 8) {
        callback(new Error('用户名过长'))
      }
      callback()
    }
    const checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      }
      callback()
    }
    const checkEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
        return
      }
      const pass = /^[a-zA-Z0-9_.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/g.test(value)
      if (!pass) {
        callback(new Error('请输入正确的邮箱'))
      }
      callback()
    }
    const checktel = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
        return
      }
      const phone = /(^1\d{10}$)|(^[0-9]\d{7}$)/.test(value)
      if (!phone) {
        callback(new Error('请输入正确的手机号'))
      }
      callback()
    }
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 1,
      adddialogVisible: false,
      EditdialogVisible: false,
      setRoledialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      setForm: {},
      rolelist: {},
      setrole: '',
      rules: {
        username: [{ validator: checkUname, trigger: 'blur' }],
        password: [{ validator: checkPass, trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [{ validator: checktel, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取列表
    async getUserlist() {
      const { data: res } = await this.$http.get('/users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      console.log(res)
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 页面显示条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserlist()
    },
    // 获取新数据页面
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserlist()
    },
    // 用户状态更改
    async userStatechange(userState) {
      const { data: res } = await this.$http.put(`users/${userState.id}/state/${userState.mg_state}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      return this.$message.success(res.meta.msg)
    },
    // 添加用户窗口重置输入框内容
    adddialogClose() {
      this.$refs.RefaddForm.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.RefaddForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('/users', this.addForm)
          console.log(res)
          if (res.meta.status === 201) {
            this.$message.success(res.meta.msg)
            // 隐藏新增用户窗口
            this.adddialogVisible = false
            // 更新用户列表
            this.getUserlist()
          } else {
            this.$message.error('添加用户失败')
          }
        } else {
          return this.$message.error('添加用户失败,请检查输入')
        }
      })
    },
    // 修改用户窗口
    async showEditdialog(id) {
      this.EditdialogVisible = true
      const { data: res } = await this.$http.get('/users/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('请求用户信息失败')
      }
      this.editForm = res.data
    },
    // 关闭后修改用户数据窗口重置
    editdialogCloese() {
      this.$refs.RefeditForm.resetFields()
    },
    // 修改用户数据
    changeUser() {
      this.$refs.RefeditForm.validate(async valid => {
        if (valid) {
          console.log(valid)
          const { data: res } = await this.$http.put('/users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          console.log(res)
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg)
            // 隐藏新增用户窗口
            this.EditdialogVisible = false
            // 更新用户列表
            this.getUserlist()
            return
          }
          this.$message.error('res.meta.msg')
        } else {
          return this.$message.error('修改用户失败,请检查输入')
        }
      })
    },
    // 打开配置用户弹窗
    async showsetRoledialog(userinfo) {
      this.setForm = userinfo
      console.log(userinfo)
      // 获取所有角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.rolelist = res.data
      this.setRoledialogVisible = true
    },
    // 确认配置用户
    async savechangeRole() {
      if (!this.setrole) {
        return this.$message.error('请选择需要分配的角色！')
      }
      const { data: res } = await this.$http.put(`users/${this.setForm.id}/role`, { rid: this.setrole })
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getUserlist()
      this.setRoledialogVisible = false
    },
    // 关闭后配置用户角色窗口重置
    setRoledialogCloese() {
      // eslint-disable-next-line no-extra-semi
      ;(this.setForm = ''), (this.setrole = '')
    },
    // 删除用户数据
    deleteUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status === 200) {
            console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getUserlist()
            return
          }
          this.$message({
            type: 'info',
            message: '删除失败'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created() {
    this.getUserlist()
  }
}
</script>
<style lang="less" scoped>
.btn:hover {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
.btn:active {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  box-sizing: border-box;
}
</style>
