<script setup> 
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const showElement = ref(false);
const router = useRouter();
const isAuthenticated = ref(false);

onMounted(() => {
  isAuthenticated.value = !!localStorage.getItem('token');
});

const toggleElement = () => {
  showElement.value = !showElement.value;
};

const hideElement = () => {
  showElement.value = false;
};

const handleProfileClick = () => {
  const token = localStorage.getItem('token');
  if (token) {
    router.push({ name: 'profile' });
  } else {
    router.push({ name: 'login' });
  }
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login').then(() => {
    window.location.reload();
  }).catch((error) => {
    console.error('хуй те', error);
})
};

const deleteAccount = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete('http://localhost:5137/api/deleteAccount', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    localStorage.removeItem('token');
    router.push('/login');
    console.log(response.data);
  } catch (error) {
    console.error('Ошибка при удалении аккаунта:', error);
  }
};

const navigateToLogin = () => {
  router.push('/login').then(() => {
    window.location.reload();
  }).catch((error) => {
    console.error('хуй те', error);
  });
};

const navigateToNews = () => {
  router.push('/').then(() => {
    window.location.reload();
  }).catch((error) => {
    console.error('хуй те', error);
  });
};
</script>

<template>
    <div class="w-[55vw] h-[9vh] relative">
      <div class="flex h-[95%]">
            <h1 class="h-[40px] text-end pr-2 text-b text-lg ml-auto mt-auto cursor-pointer"
             @click="handleProfileClick">Профиль</h1>
            <div class="h-[30px] mt-auto mb-2">
              <router-link to="/ChatList">
               <img src="../../assets/messege.png" alt="" class="h-[30px]">
              </router-link>
            </div>
            <h2 class="text-[40px] w-[70px] mb-2 text-center " @click="toggleElement">&#8801;</h2>
        <div v-if="showElement">
            <div @click="hideElement" class="h-[100vh] w-[100vw] absolute -translate-x-[100vw] backdrop-blur-[3px]"></div>

          <div class="w-[200px] h-[100vh] bg-slate-400 absolute right-0 z-10 ">
            <div class="relative">
              <p @click="navigateToNews"
                 class="w-[196px] cursor-pointer bg-gray-600 text-white px-4 py-2 mb-[2px] ml-[2px] mt-[2px] hover:bg-gray-500">Новости</p>
              <p class="w-[196px] cursor-pointer bg-gray-600 text-white px-4 py-2 mb-[2px] ml-[2px] hover:bg-gray-500 ">еще чет</p>
            </div>
            
            <template v-if="isAuthenticated">
              <button @click="logout" class="bg-purple-700 rounded-lg w-[80px] mt-4 ml-4 mb-4">Выйти</button>
              <p class="text-[15px] text-black underline ml-2 " @click="deleteAccount">Удалить аккаунт</p>
            </template>

            <template v-else>
              <p @click="navigateToLogin" class="cursor-pointer bg-green-500 text-white px-4 py-2 rounded">
               Войти
              </p>
            </template>

          </div>
        </div>
      </div>
    </div>
</template>