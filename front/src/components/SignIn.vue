<script setup>
import { ref } from 'vue';
import axios from 'axios';

const name = ref('');
const email = ref('');
const password = ref('');
const passwordVisible = ref(false);
const errors = ref({});

const validateForm = () => {
  errors.value = {};

  if (!name.value.trim()) {
    errors.value.name = 'Необходимо заполнить это поле';
  }

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

const registerUser = async () => {
  if (validateForm()) {
    try {
      const response = await axios.post("http://localhost:5137/api/register", {
        name: name.value,
        email: email.value,
        password: password.value
      });
      console.log(response.data);
      // Handle success
    } catch (error) {
      console.error(error.response.data);
      if (error.response.status === 400) {
        if (error.response.data.message.includes('почта')) {
          errors.value.email = 'Пользователь с такой почтой уже существует';
        }
        if (error.response.data.message.includes('имя')) {
          errors.value.name = 'Пользователь с таким именем уже существует';
        }
      }
    }
    name.value = '';
    email.value = '';
    password.value = '';
  }
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};
</script>

<template>
  <div class="pb-3">
    <h1 class="bg-purple-500 w-[50vw] m-auto text-center mt-10">Добро пожаловать!</h1>
    <form @submit.prevent="registerUser" class="max-w-sm mx-auto mt-8">
      <div class="mb-4">
        <label for="name" class="block mb-2">Имя:</label>
        <input type="text" v-model="name" id="name" class="w-full p-2 border rounded-md" />
        <span v-if="errors.name" class="text-red-500">{{ errors.name }}</span>
      </div>

      <div class="mb-4">
        <label for="email" class="block mb-2">Почта:</label>
        <input type="email" v-model="email" id="email" class="w-full p-2 border rounded-md" />
        <span v-if="errors.email" class="text-red-500">{{ errors.email }}</span>
      </div>

      <div class="mb-4 ">
        <label for="password" class="block mb-2">Пароль:</label>
        <input :type="passwordVisible ? 'text' : 'password'" v-model="password" id="password" class="w-full p-2 border rounded-md" />
        <button type="button" @click="togglePasswordVisibility" class=" pl-[90%] -translate-y-8  px-3 text-gray-500 ">
          <img v-if="passwordVisible" src="../assets/show-password.png" alt="Показать пароль" class="h-5 w-5 -z-10" />
          <img v-else src="../assets/hide-password.png" alt="Скрыть пароль" class="h-5 w-5 -z-10" />
        </button> 
        <span v-if="errors.password" class="text-red-500">{{ errors.password }}</span>
      </div>

      <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Регистрация</button>
      <span v-if="errors.form" class="text-red-500">{{ errors.form }}</span>
    </form>
  </div>
</template>

<style scoped>
.error {
  color: red;
}
</style>