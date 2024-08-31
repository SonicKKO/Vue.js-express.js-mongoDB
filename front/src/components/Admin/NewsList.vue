<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AdminNewsSample from './AdminNewsSample.vue';

const news = ref([]);
const isLoading = ref(false);
const confirmDelete = ref(false);
const selectedNewsId = ref(null);

const deleteNews = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!selectedNewsId.value) return;

    await axios.delete('http://localhost:5137/api/delete-news', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { _id: selectedNewsId.value } 
    });

    loadNews(); 
    selectedNewsId.value = null; 
    confirmDelete.value = false; 
    console.log('Новость удалена');
  } catch (error) {
    console.error(error);
  }
};

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

const closeDeleteModal = () => {
  confirmDelete.value = false;
}

const openDeleteModal = (id) => {
  selectedNewsId.value = id;
  confirmDelete.value = true;
};

onMounted(() => {
    loadNews();
});
</script>

<template>
  <div class="h-[82vh] w-[100vw]">
    <div class="h-[100%] overflow-y-auto m-auto">
      <h1 class="mt-3 mb-3 text-center font-bold uppercase">Все новости/Редактирование</h1>
      <router-link to="/AddNews">
        <button class="ml-3 border rounded mb-3 w-[150px] h-[30px] bg-purple-200">Добавить новость</button>  
      </router-link>

      <template v-if="isLoading">
        <div class="flex justify-center items-center h-full">
          <div class="loader"></div>
        </div>
      </template>

      <template v-else>
        <div v-for="item in news" :key="item._id" class="flex items-center mb-2">
          <AdminNewsSample 
            :_id="item._id"
            :title="item.title"
            :text="item.text"
            :date="item.formattedDate"
            :imgUrl="item.imgUrl"
          />
          <router-link :to="'/FullNews/' + item._id">
            <button class="h-[50px] w-[50px] mr-2 ml-4 border text-xl bg-blue-300 hover:bg-blue-400">🔍</button>
          </router-link>

          <button class="h-[50px] w-[50px] mr-2 border text-xl bg-purple-300 hover:bg-purple-400">✏️</button>

          <button @click="openDeleteModal(item._id)" 
                  class="h-[50px] w-[50px] mr-2 border text-xl bg-red-300 hover:bg-red-400">
                  🗑️
          </button>
        </div>

        <div v-if="confirmDelete" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div class="bg-white p-4 rounded shadow-lg w-[240px] h-[130px]">
            <h2 class="text-lg font-semibold mb-4 text-center">Удалить новость?</h2>
            <div class="flex w-[210px] justify-center">
              <button @click="deleteNews" class="bg-red-500 text-white px-4 py-2 rounded mr-4">Да</button>
              <button @click="closeDeleteModal" class="bg-gray-300 px-4 py-2 rounded">Нет</button>
            </div>
          </div>
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
