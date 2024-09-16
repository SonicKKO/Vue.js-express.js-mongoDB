<script setup>
import axios from 'axios';
import { ref } from 'vue';

import UserCard from './UserCard.vue'

const users = ref({});

const FetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5137/api/users');
    users.value = response.data;
    console.log(users.value)
  } catch {
    console.error('мист:', error);
  }
};

FetchUsers()

</script>

<template>
  <div>
    <div v-for="user in users" :key="user._id">
    <router-link :to="'/User/' + user._id" >
                  <UserCard 
                    :name="user.name"
                    :email="user.email"
                    :role="user.role"
                  />
                </router-link>
            </div>
  </div>
</template>
