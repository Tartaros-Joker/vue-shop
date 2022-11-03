<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加商品输入框 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getGoodslist">
            <el-button slot="append" icon="el-icon-search" @click="getGoodslist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <template>
        <el-table :data="goodslist" border style="width: 100%">
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
          <el-table-column prop="goods_price" label="商品价格" width="80"> </el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="80"> </el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="160">
            <template v-slot="scope">
              {{ scope.row.add_time | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template v-slot="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeByid(scope.row.goods_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryinfo.pagenum" :page-sizes="[5, 10, 20, 50, 100]" :page-size="queryinfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodslist: [],
      total: 0
    }
  },
  methods: {
    // 获取商品列表信息
    async getGoodslist() {
      const { data: res } = await this.$http.get('goods', { params: this.queryinfo })
      if (res.meta.status !== 200) {
        return this.this.$message.error(res.meta.msg)
      }
      this.goodslist = res.data.goods
      this.total = res.data.total
      // console.log(this.goodslist)
    },
    // 当前商品列表每页条数
    handleSizeChange(newpagesize) {
      this.queryinfo.pagesize = newpagesize
      this.getGoodslist()
    },
    // 当前商品列表页数
    handleCurrentChange(newpagenum) {
      this.queryinfo.pagenum = newpagenum
      this.getGoodslist()
    },
    // 删除商品
    removeByid(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getGoodslist()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    goAddpage() {
      this.$router.push('/home/goods/add')
    }
  },
  created() {
    this.getGoodslist()
  }
}
</script>

<style></style>
