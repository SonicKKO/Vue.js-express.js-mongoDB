<script setup>
import { defineProps } from 'vue';

defineProps({
   id: String,
  name: String,
  email: String,
  role: String,
});

</script>

<template>
  <div class="w-[100vw] h-[100px]">
  <h1>{{ name }}</h1>
  <h2>{{ email }}</h2>
  <h3>{{ role }}</h3>
  </div>
</template>