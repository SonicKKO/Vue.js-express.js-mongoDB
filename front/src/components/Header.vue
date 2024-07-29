<script setup>
import { useRouter } from 'vue-router';

import SideBar from './SideBar.vue'
</script>

<template>
  <div class="flex h-[9vh] border-b">
    <router-link to="/">
      <div class="w-[45vw]">
        <img src="" alt="logo" class="h-[90%] pt-2 pl-2">
      </div>
    </router-link>
     
    <SideBar/>
  </div>
</template>