<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import socket from '../../socket.js';

const route = useRoute();
const newsId = ref(route.params._id);
const fullNewsData = ref(null);
const isLoading = ref(true);  
const formattedDate = ref('');

const user = ref({});
const comments = ref([]);
const newComment = ref('');

const autoResize = (event) => {
  const textarea = event.target;
  textarea.style.height = 'auto'; 
  textarea.style.height = `${textarea.scrollHeight}px`; 
};

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:5137/comments/${newsId.value}`);
    comments.value = response.data;
  } catch (error) {
    console.error('Ошибка при получении комментариев:', error);
  }
  
  socket.on('new_comment', (comment) => {
    comments.value.push(comment);
  });
});

const sendComment = () => {
  const comment = { 
    text: newComment.value,
    userId: user.value._id,
    userName: user.value.name, 
    newsId: newsId.value 
  };
  newComment.value = '';
  socket.emit('new_comment', comment, (response) => {
    console.log('Комментарий отправлен:', response);
  });

  console.log('Отправляем комментарий:', comment);
};

const fetchUserProfile = async  () => {
  try {
    const token = localStorage.getItem('token');
    console.log('токен', token);

    if (!token) {
      throw new Error('токена нет в локалстор');
    }

    const response = await axios.get('http://localhost:5137/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    user.value = response.data;
    console.log('профиль', user.value);  
  } catch (error) {
    console.error('мист:', error);
  }
};

fetchUserProfile();

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

     <div class="mt-5 border-t-[4px] border-double">
    <h2 class="h-[45px] pt-2 pb-2 text-center border-b-[2px] border-dashed">Комментарии</h2>
    <ul>
      <li class="flex ml-[20px] max-w-[400px]  mt-3 " v-for="comment in comments" :key="comment._id">
        <strong class="">{{ comment.userName }}:</strong> <p class="line-clamp-5 ml-2 bg-slate-300 rounded py-1 px-1 leading-4">{{ comment.text }}</p>
      </li>
    </ul>
    <div class=" mt-5  sticky bottom-0 bg-stone-400 bg-opacity-50">
      <textarea
        class="w-[50vw] mt-2 ml-[20%] from-transparent border-t border-b py-2 placeholder:italic placeholder:text-white	bg-transparent text-sm leading-4 resize-none outline-none"
        maxlength="1000"
        v-model="newComment"
        placeholder="Добавьте комментарий."
        @input="autoResize"
      ></textarea>
          <button class="ml-[50px] rounded bg-purple-600 py-1 px-1" @click="sendComment">Отправить✈</button>
    </div>
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
