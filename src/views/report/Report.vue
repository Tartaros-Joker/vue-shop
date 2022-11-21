<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <div id="main" style="width: 800px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data() {
    return {
      options: {
        tooltip: {}
      }
    }
  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'))
    const res = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }
    // 绘制图表
    myChart.setOption({ ...this.options, ...res.data })
  }
}
</script>

<style></style>
