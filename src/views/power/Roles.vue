<!-- eslint-disable vue/multi-word-component-names -->
<template lang="">
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色区域 -->
      <el-row>
        <el-button type="primary" @click="adddialogVisible = true">创建角色</el-button>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table border stripe :data="rolesList" style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand" v-slot="scope">
          <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['expandbt', 'vcenter', i1 === 0 ? 'expandtp' : '']">
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="removeRights(scope.row, item1.id)">
                {{ item1.authName }}
              </el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 渲染二级权限 -->
            <el-col :span="19">
              <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="['vcenter', i2 === 0 ? '' : 'expandtp']">
                <el-col :span="7">
                  <el-tag type="success" closable @close="removeRights(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="12">
                  <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRights(scope.row, item3.id)">
                    {{ item3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="角色名称" width="380" prop="roleDesc"> </el-table-column>
        <el-table-column label="角色描述" width="380" prop="roleName"> </el-table-column>
        <el-table-column label="操作" width="380" v-slot="scope">
          <el-tooltip effect="dark" content="修改角色" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" @click="showChangedialog(scope.row.id)">编辑</el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="配置角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" @click="showsetRightdialog(scope.row)">分配权限</el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除角色" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除角色</el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <!-- 添加角色弹窗 -->
      <el-dialog title="收货地址" :visible.sync="adddialogVisible">
        <el-form :model="addFrom" :rules="addrules" ref="addRolesRef">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addFrom.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addFrom.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="adddialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改角色弹窗 -->
      <el-dialog title="收货地址" :visible.sync="changedialogVisible">
        <el-form :model="changeFrom" :rules="addrules" ref="changeRolesRef">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="changeFrom.roleDesc"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="changeFrom.roleName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="changedialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeRoles">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 权限配置弹窗 -->
      <el-dialog title="配置权限" :visible.sync="setRightsdialogVisible" @close="closesetRightsdialog">
        <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" ref="treeRef" :default-checked-keys="checkedkey" :default-expand-all="true"></el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setRightsdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRight">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      setRightsdialogVisible: false,
      rightslist: [],
      checkedkey: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      roleid: '',
      addFrom: { roleName: '', roleDesc: '' },
      addrules: { roleName: [{ required: true, message: '请填写角色名称', trigger: 'blur' }] },
      adddialogVisible: false,
      changeFrom: { roleId: '', roleName: '', roleDesc: '' },
      changedialogVisible: false
    }
  },
  methods: {
    async getrolesList() {
      const res = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.rolesList = res.data
        // console.log(this.rolesList)
      }
    },
    // 删除角色权限
    async removeRights(role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          if (res.meta.status !== 200) {
            // console.log(res)
            this.$message({
              type: 'info',
              message: '删除失败'
            })
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 会发生刷新页面的情况不建议调用
            // this.getrolesList()
            role.children = res.data
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 分配权限弹窗
    async showsetRightdialog(role) {
      this.roleid = role.id
      const res = await this.$http.get('rights/tree')
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('获取列表失败')
        return
      }
      this.rightslist = res.data
      this.getcheckedkey(role, this.checkedkey)
      this.setRightsdialogVisible = true
    },
    getcheckedkey(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getcheckedkey(item, arr))
    },
    closesetRightsdialog() {
      this.checkedkey = []
    },
    // 分配权限
    async setRight() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const res = await this.$http.post(`roles/${this.roleid}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        this.$message.error('配置失败')
      }
      this.$message.success('配置权限成功')
      this.getrolesList()
      this.setRightsdialogVisible = false
    },
    // 删除角色
    deleteRole(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`roles/${row}`)
          console.log(row)
          console.log(res)
          if (res.meta.status !== 200) {
            this.$message({
              type: 'info',
              message: '删除失败'
            })
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getrolesList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加角色
    addRoles() {
      this.$refs.addRolesRef.validate(async vals => {
        if (!vals) {
          this.$message.error('请输入必填项')
        }
        const res = await this.$http.post('roles', this.addFrom)
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getrolesList()
        this.adddialogVisible = false
      })
    },
    async showChangedialog(id) {
      this.changedialogVisible = true
      const res = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.changeFrom = res.data
    },
    async changeRoles() {
      const res = await this.$http.put(`roles/${this.changeFrom.roleId}`, { roleName: this.changeFrom.roleName, roleDesc: this.changeFrom.roleDesc })
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.changedialogVisible = false
      this.getrolesList()
    }
  },
  created() {
    this.getrolesList()
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 10px;
  margin-left: 75px;
}
.expandbt {
  border-bottom: 1px solid #eee;
}
.expandtp {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
