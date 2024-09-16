<template>
  <div class="flex items-center w-[100vw] h-[65px] mt-[2px] mb-[2px] bg-slate-200 bg-opacity-60 cursor-pointer">
    <div class="w-[80px] h-[100%] pt-[5px]">
      <!-- Отображение фото профиля -->
      <img v-if="profilePicture" 
           :src="`http://localhost:5137/${profilePicture}`" 
           class="h-[55px] w-[55px] mx-auto rounded-full" alt="Profile Picture">    
      <img v-else src="../../assets/images.jpg" alt="Default Image"
           class="h-[55px] w-[55px] mx-auto rounded-full">        
    </div>

    <div class="w-[250px] h-[100%]"> 
      <h1>{{ name }}</h1>
      <p>{{ lastMessage }}</p> 
    </div>

    <div class="flex-1 h-[60px] relative">
      <p class="pr-[7px] text-sm text-end">{{ formattedDate }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({ 
  chatId: String,  
  name: String,
  formattedDate: String,
  lastMessage: String,
  unreadCount: Number,
  profilePicture: String
});
</script>
