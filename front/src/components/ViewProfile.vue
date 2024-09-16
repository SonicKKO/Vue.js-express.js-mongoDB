<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();  
const router = useRouter();

const user = ref({});
const mainUser = ref({});

const fetchUserDetails = async () => {
  try {
    const userId = route.params.userId;  
    // console.log('User ID:', userId);
    
    const response = await axios.get(`http://localhost:5137/api/users/${userId}`);
    user.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки данных пользователя:', error);
  }
};

onMounted(() => {
  fetchUserDetails();  
});

const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    // console.log('токен', token);

    if (!token) {
      throw new Error('токена нет в локалстор');
    }

    const response = await axios.get('http://localhost:5137/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    mainUser.value = response.data;
    // console.log('main User ID', mainUser.value._id);  
  } catch (error) {
    console.error('мист:', error);
  }
};

fetchUserProfile();

const goToChat = async (userId) => {
  try {
 
    const currentUserId = mainUser.value._id; 
    const currentUserName = mainUser.value.name;
    const userName = user.value.name;
    console.log(userName)
    const response = await axios.post('http://localhost:5137/api/chats', {
      userId1: currentUserId,
      userName1: currentUserName,
      userId2: userId,
      userName2: userName
    });


    const chatId = response.data.chatId;
    router.push({ name: 'chat', params: { chatId } });
  } catch (error) {
    console.error('Ошибка при создании или переходе в чат:', error);
  }
};

</script>

<template>
  <div class="h-[80vh] w-[100vw]">


      <h2 class="text-center mb-5">Профиль пользователя</h2>

        <div v-if="user.profilePicture">
          <img :src="`http://localhost:5137/${user.profilePicture}`" alt="Profile Picture" class="w-[200px] h-[200px] object-cover rounded-full mx-auto mt-4"/>
        </div>
   
        <div v-if="!user.profilePicture">
          <img src="../assets/images.jpg" alt="" class="mx-auto rounded-full mb-3 w-[200px] h-[200px]">
        </div>

        <button @click="goToChat(user._id)">Начать чат</button>


        <p>{{ user.name }}</p>
        <p>Почта: {{ user.email }}</p>
        <p>Роль: {{ user.role }}</p>


  </div>
</template>