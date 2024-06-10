<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const showElement = ref(false);
const router = useRouter();

const toggleElement = () => {
  showElement.value = !showElement.value;
}

const hideElement = () => {
  showElement.value = false;
}

const handleProfileClick = () => {
  const token = localStorage.getItem('token');
  if (token) {
    router.push({ name: 'profile' });
  } else {
    router.push({ name: 'login' });
  }
}
</script>

<template>
  <div class="flex h-[9vh] border-b">
    <router-link to="/">
      <div class="w-[45vw]">
        <img src="" alt="logo" class="h-[90%] pt-2 pl-2">
      </div>
    </router-link>

    <div class="w-[55vw] h-[9vh] relative">
      <div class="flex h-[95%]">
        <h1 class="h-[40px] text-end pr-6 text-b text-lg ml-auto mt-auto cursor-pointer"
            @click="handleProfileClick">Профиль</h1>
        <h2 class="text-[47px] self-start pr-3" @click="toggleElement">&#8801;</h2>
        <div v-if="showElement">
          <div @click="hideElement" class="h-[100vh] w-[100vw] absolute -translate-x-[100vw] backdrop-blur-[3px]"></div>
          <div class="w-[250px] h-[300px] bg-slate-200 absolute right-0 z-10 -translate-x-[10px] translate-y-[10px] rounded-xl"></div>
        </div>
      </div>
    </div>
  </div>
</template>