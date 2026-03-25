<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('游戏陪玩管理端启动成功')
})
</script>

<style>
#app {
  width: 100%;
  height: 100vh;
}
</style>
