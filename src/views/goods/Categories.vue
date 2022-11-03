<!-- eslint-disable vue/no-unused-vars -->
<template lang="">
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-button type="primary" @click="showaddCatedialog">添加分类</el-button>
      <!-- 表格 -->
      <tree-table :data="catelist" :columns="columns" border :show-index="true" :expand-type="false" :selection-type="false" class="treeTable">
        <template v-slot:isok="scope">
          <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template v-slot:btn="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <div>
        <!-- 页脚 -->
        <el-pagination :page-sizes="[5, 10, 20, 50, 100]" :page-size="queryInfo.pagesize" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" layout="sizes, prev, pager, next, jumper,total" :total="total" @size-change="handleSizeChange"> </el-pagination>
      </div>
    </el-card>
    <!-- 添加分类弹窗 -->
    <el-dialog title="添加分类" :visible.sync="addCatedialogVisible" @close="addCatedialogClosed" close-on-press-escape>
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="100px">
          <el-cascader v-model="selectedKeys" :options="parentList" :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children', checkStrictly: 'true' }" @change="getSelectedKeys" clearable ref="ascaderRef"> </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCatefrom">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      catelist: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'btn'
        }
      ],
      addCatedialogVisible: false,
      // 将要添加分类的数据
      addFrom: { cat_name: '', cat_pid: 0, cat_level: 0 },
      // 添加分类表单的验证
      addFromRules: { cat_name: [{ required: true, message: '请输入分类名', trigger: 'blur' }] },
      parentList: [],
      selectedKeys: []
    }
  },
  methods: {
    // 获取数据列表
    async getCatelist() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize的改变
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCatelist()
    },
    // 监听pagenum的改变
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCatelist()
    },
    showaddCatedialog() {
      this.getParentlist()
      this.addCatedialogVisible = true
    },
    async getParentlist() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.parentList = res.data
    },
    getSelectedKeys(val) {
      this.selectedKeys = val
      if (this.selectedKeys.length > 0) {
        this.addFrom.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addFrom.cat_level = this.selectedKeys.length
        return
      } else {
        this.addFrom.cat_pid = 0
        this.addFrom.cat_level = 0
      }
      console.log(this.addFrom)
    },
    addCatefrom() {
      this.$refs.addFromRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post('categories', this.addFrom)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        console.log(res.data)
        this.getCatelist()
        this.addCatedialogVisible = false
      })
    },
    addCatedialogClosed() {
      this.$refs.addFromRef.resetFields()
      this.selectedKeys = []
      this.addFrom.cat_pid = 0
      this.addFrom.cat_level = 0
    }
  },
  created() {
    // 获取数据列表
    this.getCatelist()
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
