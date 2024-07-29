<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import NewsSample from './NewsSample.vue';

const news = ref([]);
const isLoading = ref(false);

const loadNews = async () => {
    isLoading.value = true;
    try {
        const { data } = await axios.get('http://localhost:5137/api/news');
        news.value = data;
        console.log(news.value);
    } catch (err) {
        console.log(err);
    } finally {
        isLoading.value = false;
    }
};

loadNews();
</script>

<template> 
  <div class="h-[82vh] w-[100vw] pt-4 pl-2">
    <div class="h-[97%] w-[95%] overflow-y-auto m-auto border rounded-2xl">

      <template v-if="isLoading">
        <div class="flex justify-center items-center h-full">
          <div class="loader"></div>
        </div>
      </template>

      <template v-else>
        <router-link v-for="item in news" :key="item._id" :to="'/FullNews/' + item._id">
                    <NewsSample 
                        :_id="item._id"
                        :title="item.title"
                        :text="item.text"
                        :date="item.date"
                        :imgUrl="item.imgUrl"
                    />
        </router-link>
      </template>

    </div>
  </div>
</template>

<style scoped>
.loader {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #75006f;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
