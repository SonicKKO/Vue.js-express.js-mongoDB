<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const user = ref({});
const router = useRouter();

const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await axios.get('http://localhost:5137/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    user.value = response.data;
    // console.log(user.value);
    // console.log(response.data);
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};

fetchUserProfile();

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

</script>

<template>
  <div>
    <h2>Профиль пользователя</h2>
    <p>Почта: {{ user.email }}</p>
    <button @click="logout" class="bg-purple-700 rounded-lg w-[80px] mt-4 ml-4 mb-4 ">Выйти</button>
  </div>
</template>