<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 步骤条区域 -->
      <el-alert title="添加商品信息" type="info" show-icon center> </el-alert>
      <el-steps :active="activeStep - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab区域 -->
      <el-form :model="addForm" :rules="addFromrules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="activeStep" :before-leave="beforeTabsleave" @tab-click="tabClicked">
          <!-- 基本信息分页 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="catelist" :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }" clearable @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数分页 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTables" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="items" v-for="(items, index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性分页 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTables" :label="item.attr_name" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3"
            ><el-upload :action="uploadURL" :on-preview="uploadPreview" :on-remove="uploadRemove" list-type="picture" :headers="headerconfig" :on-success="uploadSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce" class="editor"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览弹窗 -->
      <el-dialog title="图片预览" :visible.sync="previewdialogVisible" width="50%">
        <img :src="previewImg" alt="" width="100%" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="previewdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="previewdialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    const checkInput = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      if (value < 0) {
        callback(new Error('值不能小于0'))
      } else {
        callback()
      }
    }
    return {
      activeStep: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFromrules: {
        goods_name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        goods_price: [{ validator: checkInput, trigger: 'blur' }],
        goods_weight: [{ validator: checkInput, trigger: 'blur' }],
        goods_number: [{ validator: checkInput, trigger: 'blur' }],
        goods_cat: [{ required: true, message: '商品分类不能为空', trigger: 'blur' }]
      },
      catelist: [],
      manyTables: [],
      onlyTables: [],
      uploadURL: 'https://lianghj.top:8888/api/private/v1/upload',
      headerconfig: { Authorization: window.sessionStorage.getItem('token') },
      previewImg: '',
      previewdialogVisible: false
    }
  },
  methods: {
    // 获取级联选择器的列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return res.meta.msg
      }
      this.catelist = res.data
      console.log(this.catelist)
    },
    // 获取选中的节点
    handleChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 跳转验证
    beforeTabsleave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 获取商品参数或属性
    async tabClicked() {
      if (this.activeStep === '1') {
        const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.manyTables = res.data
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        console.log(this.manyTables)
      } else if (this.activeStep === '2') {
        const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.onlyTables = res.data
        console.log(this.onlyTables)
      }
    },
    // 图片预览效果
    uploadPreview(file) {
      console.log(file)
      this.previewImg = file.response.data.url
      this.previewdialogVisible = true
    },
    // 上传图片删除
    uploadRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pics === filePath)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 图片上传成功
    uploadSuccess(response) {
      const picobj = { pics: response.data.tmp_path }
      this.addForm.pics.push(picobj)
      console.log(this.addForm.pics)
    },
    // 添加商品校验
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          this.$message.error('请填写必要的基本信息')
        }
        this.manyTables.forEach(item => {
          const tableinfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(tableinfo)
        })
        this.onlyTables.forEach(item => {
          const tableinfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals
          }
          this.addForm.attrs.push(tableinfo)
        })
        const From = _.cloneDeep(this.addForm)
        From.goods_cat = this.addForm.goods_cat.join(',')
        const { data: res } = await this.$http.post('/goods', From)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/home/goods')
      })
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.cate {
  margin: 40px 0;
}
.el-checkbox {
  margin: 0 20px 0 0 !important;
}
.addBtn {
  margin-top: 20px;
}
</style>
