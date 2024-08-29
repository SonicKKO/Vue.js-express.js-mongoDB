<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const newsId = ref(route.params._id);
const fullNewsData = ref(null);
const isLoading = ref(true);  
const formattedDate = ref('');

onMounted(async () => {
    try {
        const { data } = await axios.get(`http://localhost:5137/api/news/${newsId.value}`);
        fullNewsData.value = data;

        const date = new Date(fullNewsData.value.date);
        formattedDate.value = date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
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
     <div class="">
      <p class="text-center mx-auto uppercase font-bold mb-3 mt-3 w-[50vw]">"{{ fullNewsData.title }}"</p>
      <img :src="fullNewsData.imgUrl" alt="" class="ml-3 float-left w-[50vw] mr-3 " >
      <p class="ml-3">{{ fullNewsData.text }}</p>
      <p class="mt-2 ml-2 mb-2 font-bold text-sm">{{ formattedDate }}</p>
     </div>

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
