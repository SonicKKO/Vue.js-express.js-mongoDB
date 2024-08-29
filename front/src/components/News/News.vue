<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import NewsSample from './NewsSample.vue';

const news = ref([]);
const isLoading = ref(false);

const loadNews = async () => {
    isLoading.value = true;
    try {
        const { data } = await axios.get('http://localhost:5137/api/news');
        news.value = data.map(item => ({
            ...item,
            formattedDate: new Date(item.date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        }))
        .reverse();
    } catch (err) {
        console.log(err);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    loadNews();
});
</script>

<template>
    <div class="h-[82vh] w-[100vw] pt-4 ">
      <h1 class="text-center font-bold uppercase mb-3 ">новости</h1>
        <div class="h-[90%] w-[100%] overflow-y-auto  border ">

            <template v-if="isLoading">
                <div class="flex justify-center items-center h-full">
                    <div class="loader"></div>
                </div>
            </template>

            <template v-else>
              <div v-for="item in news" :key="item._id" class="flex items-center mb-2">
                <router-link :to="'/FullNews/' + item._id" class="flex-grow">
                  <NewsSample 
                    :_id="item._id"
                    :title="item.title"
                    :text="item.text"
                    :date="item.formattedDate"
                    :imgUrl="item.imgUrl"
                  />
                </router-link>
              </div>
            </template>

        </div>
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
