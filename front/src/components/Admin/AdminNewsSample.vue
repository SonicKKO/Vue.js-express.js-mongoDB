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
  <div class="w-[90%] ml-3 border ">
    <div class="flex h-[70px] justify-around">   

      <h1 class="mt-[18px] ml-1 mr-1 w-[160px] overflow-hidden uppercase font-bold ">{{ title }}</h1>
      <p class="border-r-[1px] h-[70px]"></p>

      <p  class="pl-3 pr-2 leading-5 h-[68px] w-[170px]  overflow-hidden">{{ text }}</p>
      <p class="border-r-[1px] h-[70px]"></p>

      <p  class="pl-3 mt-[20px] w-[140px]">{{ date }}</p>   

    </div>
  </div>
</template>