<script setup>
import { defineProps } from 'vue';

defineProps({
   id: String,
  _id: String,
  title: String,
  text: String,
  date: String,
  imgUrl: String
})
</script>

<template>
  <div class="w-[93%] h-[160px] mt-3 m-auto border rounded-2xl transition hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50">
      <h1 class="text-center uppercase font-bold text-lg ">{{ title }}</h1>
      <p class="pl-3 pr-2 leading-5 h-[103px]   overflow-hidden">{{ text }}</p>
      
    <div class="flex">
      <p class="pl-3 w-[50%]">{{ date }}</p>       
      <p class=" ml-auto pr-3  text-slate-500">&#10149;</p>
    </div>
  </div>
</template>