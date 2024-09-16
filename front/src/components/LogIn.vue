<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const passwordVisible = ref(false);
const errors = ref({});
const generalErrorMessage = ref('');
const router = useRouter();

const validateForm = () => {
  errors.value = {};

  if (!email.value.trim()) {
    errors.value.email = 'Необходимо заполнить это поле';
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'Некорректный формат';
  }

  if (!password.value.trim()) {
    errors.value.password = 'Необходимо заполнить это поле';
  } else if (password.value.length < 6) {
    errors.value.password = 'Пароль должен содержать не менее 6 символов';
  }
  return Object.keys(errors.value).length === 0;
};

const loginUser = async () => {
  if (validateForm()) {
    try {
      const response = await axios.post('http://localhost:5137/api/login', {
        email: email.value,
        password: password.value,
      });
      localStorage.setItem('token', response.data.token);
      router.push('/profile').then(() => { 
    window.location.reload();
  }).catch((error) => {
    console.error('хуй те', error);
  });
    } catch (error) {
      console.error(error.response.data);
      generalErrorMessage.value = '';

      if (error.response.status === 401) {
        const errorMessage = error.response.data.error;

        if (errorMessage?.includes('почта')) {
          errors.value.email = 'Пользователь не найден';
        }

        if (errorMessage?.includes('факе')) {
          errors.value.password = 'Неверный пароль';
        }
      } else if (error.response.status === 400) {
        generalErrorMessage.value = "Запрос некорректный: " + error.response.data.message;
      } else {
        generalErrorMessage.value = "Что-то пошло не так: " + error.message;
      }
    }
  }
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};
</script>

<template>
  <div class="pb-3">
    <h1 class="bg-purple-500 w-[50vw] m-auto text-center mt-10">Добро пожаловать!</h1>
    <form @submit.prevent="loginUser" class="max-w-sm mx-auto mt-8">
      <div class="mb-4">
        <label for="email" class="block mb-2">Почта:</label>
        <input type="email" v-model="email" id="email" class="w-full p-2 border rounded-md" />
        <span v-if="errors.email" class="text-red-500">{{ errors.email }}</span>
      </div>

      <div class="mb-4">
        <label for="password" class="block mb-2">Пароль:</label>
        <input :type="passwordVisible ? 'text' : 'password'" v-model="password" id="password" class="w-full p-2 border rounded-md" />
        <button type="button" @click="togglePasswordVisibility" class="ml-[88%] -translate-y-8 px-3 text-gray-500">
          <img v-if="passwordVisible" src="../assets/show-password.png" alt="Показать пароль" class="h-5 w-5 -z-10" />
          <img v-else src="../assets/hide-password.png" alt="Скрыть пароль" class="h-5 w-5 -z-10" />
        </button>
        <span v-if="errors.password" class="text-red-500">{{ errors.password }}</span>
      </div>

      <router-link to="SignIn">
        <p class="mb-5 mt-5 w-[260px] text-sky-800 hover:text-purple-900">Нет аккаунта? Зарегистрироваться</p>
      </router-link>

      <div class="w-[100%] flex">
        <button type="submit" class="h-[45px] w-[100px] m-auto bg-blue-500 text-white rounded-md hover:bg-blue-600">Готово</button>
      </div>
    </form>
    <div v-if="generalErrorMessage" class="text-red-500 text-center mt-4">{{ generalErrorMessage }}</div>
  </div>
</template>

<style scoped>
.error {
  color: red;
}
</style>
