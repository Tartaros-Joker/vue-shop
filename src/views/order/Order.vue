<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="10">
          <el-input class="search"><el-button type="primary" icon="el-icon-search" slot="append"></el-button></el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column type="index" prop="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="450"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="100">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template>
            <el-tooltip effect="dark" content="修改订单地址" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" @click="showChangeaddress"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="显示物流进度" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-location-outline" @click="showProgress"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryinfo.pagenum" :page-sizes="[10, 20, 50, 100]" :page-size="queryinfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>
    <!-- 修改地址弹窗 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible">
      <el-form :model="addressForm">
        <el-form-item label="省/市/区" label-width="68px">
          <el-cascader v-model="addressForm.address1" :options="cityData" :props="{ expandTrigger: 'hover' }" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="68px">
          <el-input v-model="addressForm.address2" class="input"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看快递信息弹窗 -->
    <el-dialog title="快递信息" :visible.sync="progressVisible">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(item, index) in progressInfo" :key="index" :timestamp="item.time">
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  data() {
    return {
      queryinfo: {
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      orderList: [],
      total: 1,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      cityData,
      progressVisible: false,
      progressInfo: []
    }
  },
  methods: {
    // 获取订单
    async getOrderlist() {
      const res = await this.$http.get('orders', { params: this.queryinfo })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(this.orderList)
    },
    // 更新每页条数
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize
      this.getOrderlist()
    },
    // 更新页数
    handleCurrentChange(newSize) {
      this.queryinfo.pagenum = newSize
      this.getOrderlist()
    },
    // 修改地址弹窗
    showChangeaddress() {
      this.addressVisible = true
    },
    async showProgress() {
      this.progressVisible = true
      const res = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.progressInfo = res.data
      console.log(this.progressInfo)
    }
  },
  created() {
    this.getOrderlist()
  }
}
</script>

<style lang="less" scoped>
.search {
  margin: 10px 0 10px 0;
}
.input {
  width: 80%;
}
</style>
