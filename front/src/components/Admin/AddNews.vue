<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const title = ref('');
const text = ref('');
const imgUrl = ref('');
const router = useRouter();

const addNews = async () => {
  try {
    await axios.post('http://localhost:5137/api/add-news', { title: title.value, text: text.value, imgUrl: imgUrl.value });
    alert('Новость добавлена успешно');
    router.push('/');
  } catch (error) {
    console.error(error);
    alert('Ошибка при добавлении новости');
  }
};
</script>

<template>
  <div class="h-[80vh] w-[100vw]" >
   <div class="h-[97%] w-[95%] overflow-y-auto m-auto">
    <h2 class="text-center uppercase mt-2">Добавить новость</h2>
    <form @submit.prevent="addNews">
      <div class="mb-3">
        <label for="title" class="font-bold">Заголовок:</label>
        <input v-model="title" type="text" id="title" required class="ml-4 rounded"/>
      </div>
      <div class="mb-3">
        <label for="text" class="font-bold">Текст</label>
        <textarea v-model="text" id="text" required class="ml-4 w-[70vw] rounded"></textarea>
      </div>
      <div class="mb-3">
        <label for="imgUrl" class="font-bold">Изображение</label>
        <input v-model="imgUrl" type="text" id="imgUrl" class="ml-4 rounded" />
      </div>
      <button type="submit" class="border rounded bg-emerald-500 h-[30px] w-[90px]">Добавить</button>
    </form>
   </div>
  </div>
</template>