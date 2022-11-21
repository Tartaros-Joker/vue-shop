<!-- eslint-disable vue/multi-word-component-names -->
<template lang="">
  <el-container>
    <!-- 头部 -->
    <el-header>
      <span class="text">后台管理系统</span>
      <el-button type="danger" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '65px' : '200px'">
        <!-- 侧边栏区域 -->
        <div class="tooglebutton" @click="toggle">|||</div>
        <el-menu class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#409eff" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconlist[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/home/' + subitem.path" :key="subitem.id" v-for="subitem in item.children" @click="saveActive('/home/' + subitem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主要内容 -->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconlist: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getData()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    async getData() {
      const res = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res)
      this.menulist = res.data
      // console.log(this.menulist)
    },
    saveActive(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    toggle() {
      this.isCollapse = !this.isCollapse
      this.$store.commit('setCollapse', this.isCollapse)
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.text {
  margin-left: 20px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
  height: calc(100vh - 70px);
}
.el-container {
  height: 100%;
}
.iconfont {
  padding-right: 10px;
}
.el-menu {
  border: none;
}
.tooglebutton {
  background-color: #4a5064;
  font-size: 10px;
  text-align: center;
  cursor: pointer;
  padding: 3px;
  letter-spacing: 0.2em;
}
</style>
