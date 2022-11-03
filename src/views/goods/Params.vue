<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意，当前页面只允许第三级分类设置相关参数" type="warning" show-icon> </el-alert>
      <!-- 分类选择区域 -->
      <el-row class="cate">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader v-model="selectedCateKey" :options="catelist" :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }" @change="handleChange" clearable></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 动态参数添加按钮 -->
          <el-button type="primary" :disabled="selectedCateKey.length !== 3 ? true : false" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTabledata" style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(scope.row, index)">{{ item }}</el-tag>
                <!-- 添加tag -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else size="small" class="input-new-btn" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column prop="address" label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialg(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="showDeleteDialg(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 静态参数添加按钮 -->
          <el-button type="primary" :disabled="selectedCateKey.length !== 3 ? true : false" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTabledata" style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(scope.row, index)">{{ item }}</el-tag>
                <!-- 添加tag -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else size="small" class="input-new-btn" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
            <el-table-column prop="address" label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialg(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="showDeleteDialg(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加商品参数或属性弹窗 -->
      <el-dialog :title="'添加' + titletext" :visible.sync="addDialogVisible" @close="addDialogClose">
        <el-form :model="addForm" :rules="rules" ref="addFormRef">
          <el-form-item :label="titletext" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddForm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改商品参数或属性弹窗 -->
      <el-dialog :title="'修改' + titletext" :visible.sync="editDialogVisible" @close="editDialogClose">
        <el-form :model="editForm" :rules="rules" ref="editFormRef">
          <el-form-item :label="titletext" prop="attr_name">
            <el-input v-model="editForm.attr_name" @input="changeMessage"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="EditForm()">确 定</el-button>
        </span>
      </el-dialog>
      <!--删除商品参数或属性弹窗  -->
      <el-dialog title="提示" :visible.sync="deleteDialogVisible">
        <span>是否要删除该参数/属性？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteFrom">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      catelist: [],
      selectedCateKey: '',
      activeName: 'many',
      manyTabledata: [],
      onlyTabledata: [],
      titletext: '',
      addDialogVisible: false,
      editDialogVisible: false,
      deleteDialogVisible: false,
      addForm: {},
      editForm: {},
      deleteId: '',
      rules: { attr_name: [{ required: true, message: '请输入分类名', trigger: 'blur' }] }
    }
  },
  methods: {
    // 获取商品列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return res.meta.msg
      }
      this.catelist = res.data
      console.log(this.catelist)
    },
    // 获取商品参数或属性
    async getParamslist() {
      if (this.selectedCateKey.length !== 3) {
        this.selectedCateKey = []
        this.manyTabledata = []
        this.onlyTabledata = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.selectedCateKey[2]}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTabledata = res.data
        this.titletext = '动态参数'
      } else {
        this.onlyTabledata = res.data
        this.titletext = '静态属性'
      }
    },
    handleChange() {
      this.getParamslist()
    },
    handleTabClick() {
      this.getParamslist()
    },
    changeMessage() {
      this.$forceUpdate()
    },
    // 重置表单内容
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 重置表单内容
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 添加商品参数或属性
    AddForm() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.selectedCateKey[2]}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getParamslist()
        this.addDialogVisible = false
      })
    },
    // 显示修改商品参数或属性弹窗及获取信息
    async showEditDialg(row) {
      this.editDialogVisible = true
      this.editForm.attr_id = row.attr_id
      this.editForm.attr_name = row.attr_name
      // const { data: res } = await this.$http.get(`categories/${this.selectedCateKey[2]}/attributes/${id}`, {
      //   params: {
      //     attr_sel: this.activeName
      //   }
      // })
      // if (res.meta.status !== 200) {
      //   return this.$message.error(res.meta.msg)
      // }
      // this.editForm = res.data
      // console.log(this.editForm)
    },
    // 显示删除表单弹窗
    showDeleteDialg(id) {
      this.deleteDialogVisible = true
      this.deleteId = id
    },
    // 修改商品参数或属性
    EditForm() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.selectedCateKey[2]}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getParamslist()
        this.editDialogVisible = false
      })
    },
    // 删除项
    async deleteFrom() {
      const { data: res } = await this.$http.delete(`categories/${this.selectedCateKey[2]}/attributes/${this.deleteId}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getParamslist()
      this.deleteDialogVisible = false
    },
    async saveVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.selectedCateKey[2]}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: this.activeName, attr_vals: row.attr_vals.join(',') })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 提交tag上的参数
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      this.saveVals(row)
      row.inputVisible = false
    },
    // 点击添加tag并聚焦
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除标签
    handleClose(row, i) {
      row.attr_vals.splice(i, 1)
      this.saveVals(row)
    }
  },
  created() {
    this.getCateList()
  }
}
</script>
<style lang="less" scoped>
.cate {
  margin: 20px 0;
}
.el-cascader {
  margin-left: 20px;
}

.el-tag,
.input-new-btn {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
  margin: 10px;
}
</style>
