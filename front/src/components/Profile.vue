<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';  
import axios from 'axios';
import vueFilePond from 'vue-filepond';


import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// регистрация плагина
const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);

const user = ref({});
const router = useRouter();
const myFiles = ref([]);
const showFilePond = ref(false);
const isLoading = ref(false);

//проверка
function handleFilePondInit() {
  console.log('плагин воркае');
};

function handleProcessFileStart(file) {
  console.log('началася', file);
};

function handleFilesProcess(files) {
  console.log('нармал все', files);
};

const fetchUserProfile = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    console.log('Retrieved Token:', token); // Verify token retrieval

    if (!token) {
      throw new Error('Token not found in localStorage');
    }

    const response = await axios.get('http://localhost:5137/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    user.value = response.data;
    console.log('User profile:', user.value); // Log user profile data
  } catch (error) {
    console.error('Error fetching user profile:', error); // Log fetching error
  } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
  fetchUserProfile();
});

// обработчик для успешного процесса загрузки файла
async function handleProcessFile(event, file) {
  console.log('Файл загружен:', file);

  if (user.value.profilePicture) {
    await deleteOldProfilePicture();
  }

  fetchUserProfile();  // обновить профиль пользователя после загрузки файла
  showFilePond.value = false;  // скрыть FilePond после загрузки
};

// удалить старое фото профиля
const deleteOldProfilePicture = async () => {
  try {
    const userId = user.value._id;
    await axios.delete(`http://localhost:5137/deleteProfilePicture/${userId}`);
    fetchUserProfile();
    console.log('Старое фото профиля удалено');
  } catch (error) {
    console.error('Ошибка при удалении старого фото профиля:', error);
  }
};

// якась конфигурация с документации
const serverConfig = {
  url: 'http://localhost:5137',
  process: {
    url: '/upload',
    method: 'POST',
    withCredentials: false,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    ondata: (formData) => {
      formData.append('userId', user.value._id || '');
      return formData;
    },
    name: 'file', 
  },
  revert: null,
  restore: null,
  load: null,
  fetch: null,
};

const changeProfilePicture = () => {
  showFilePond.value = true;
};
</script>


<template>
  <div class="h-[82vh]">

   <template v-if="isLoading">
      <div class="flex justify-center items-center h-[70vh]">
        <div class="loader"></div>
      </div>
   </template>
  
   <template v-else>
      <h2 class="text-center mb-5">Профиль пользователя</h2>

        <div v-if="user.profilePicture">
      <img :src="`http://localhost:5137/${user.profilePicture}`" alt="Profile Picture" class="w-[200px] h-[200px] object-cover rounded-full mx-auto mt-4"/>
      <div class="flex justify-center mt-4">
        <button @click="changeProfilePicture" class="bg-blue-500 text-white px-4 py-2 rounded">Изменить фото профиля</button>
      </div>
        </div>
   
        <div v-if="!user.profilePicture">
      <img src="../assets/images.jpg" alt="" class="mx-auto rounded-full mb-3 w-[200px] h-[200px]">
        </div>

        <div v-if="!user.profilePicture || showFilePond">
      <file-pond
        class="w-[300px] mx-auto"
        name="file"
        ref="pond"
        label-idle="Перетащите или выберите файл"
        :files="myFiles"
        :allow-multiple="false"
        :chunk-uploads="true"
        accepted-file-types="image/jpeg, image/png"
        :allow-browse="true"
        :allow-remove="false"
        @init="handleFilePondInit"
        @addfile="handleProcessFileStart"
        @processfilestart="handleProcessFileStart"
        @processfiles="handleFilesProcess"
        @processfile="handleProcessFile"  
        :server="serverConfig"
        credits="false"
      />
        </div>

      <p>Имя: {{ user.name }}</p>
      <p>Почта: {{ user.email }}</p>
   </template>

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