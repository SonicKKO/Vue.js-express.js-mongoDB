<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const newsId = ref(route.params._id);
const fullNewsData = ref(null);
const isLoading = ref(true);

onMounted(async () => {
    try {
        const { data } = await axios.get(`http://localhost:5137/api/news/${newsId.value}`);
        fullNewsData.value = data;
    } catch (err) {
        console.log(err);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
  <div>
    <template v-if="isLoading">
      <div class="flex justify-center items-center h-[82vh]">
        <div class="loader"></div>
      </div>
    </template>

    <template v-else>
      <p class="text-center">{{ fullNewsData.title }}</p>
      <p>{{ fullNewsData.imgUrl }}</p>
      <p>{{ fullNewsData.text }}</p>
      <p>{{ fullNewsData.date }}</p>
    </template>
  </div>
</template>

<style scoped>
.loader {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #75006f;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>

