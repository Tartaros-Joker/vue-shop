<template lang="">
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格内填充表格 -->
    <el-card >
      <el-table border stripe :data="rightLists" style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="400"> </el-table-column>
        <el-table-column prop="path" label="路径" width="400"> </el-table-column>
        <el-table-column prop="level" label="权限等级" width="400">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="info" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightLists: []
    }
  },
  methods: {
    async getrightLists() {
      const { data: res } = await this.$http.get('rights/list')
      // console.log(res)
      if (res.meta.status === 200) {
        this.rightLists = res.data
        console.log(this.rightLists)
      } else {
        this.$message.error(res.meta.msg)
      }
    }
  },
  created() {
    this.getrightLists()
  }
}
</script>
<style lang=""></style>
