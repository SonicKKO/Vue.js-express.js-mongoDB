<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ChatCard from './ChatCard.vue';

const chats = ref([]);
const mainUser = ref({});

const fetchOtherUserProfile = async (chat) => {
  const mainUserId = mainUser.value._id;
  const otherUserId = chat.participants.find(participant => String(participant) !== String(mainUserId));

  try {
    const response = await axios.get(`http://localhost:5137/api/users/${otherUserId}`);
    return {
      name: response.data.name,
      profilePicture: response.data.profilePicture,
    }; 
  } catch (error) {
    console.error(error);
    return {
      name: 'Немa',
      profilePicture: '',
    };
  }
};


const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get('http://localhost:5137/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    mainUser.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const fetchChats = async () => {
  try {
    const response = await axios.get('http://localhost:5137/api/chats');
    const fetchedChats = response.data;

    const filteredChats = fetchedChats.filter(chat => 
      Array.isArray(chat.participants) && 
      chat.participants.some(participant => String(participant) === String(mainUser.value._id))
    );

    for (let chat of filteredChats) {
      const otherUserProfile = await fetchOtherUserProfile(chat);
      chat.otherUserName = otherUserProfile.name;
      chat.profilePicture = otherUserProfile.profilePicture;

      if (chat.messages && chat.messages.length > 0) {
        const lastMessageObj = chat.messages[chat.messages.length - 1];

        chat.lastMessage = lastMessageObj.content;
        
        chat.lastMessageTime = new Date(lastMessageObj.timestamp.$date || lastMessageObj.timestamp).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        chat.lastMessage = 'Нет сообщений';
        chat.lastMessageTime = '';
      }
    }

    chats.value = filteredChats;
  } catch (error) {
    console.error(error);
  }
};

const truncateMessage = (message, length = 20) => {
  return message.length > length ? message.slice(0, length) + '...' : message;
};


onMounted(async () => {
  await fetchUserProfile();
  await fetchChats();
});
</script>

<template>
  <div>
    <div v-for="chat in chats" :key="chat._id">
      <router-link :to="`/chat/${chat._id}`">
        <ChatCard
          :profilePicture="chat.profilePicture"
          :name="chat.otherUserName" 
          :formattedDate="chat.lastMessageTime"
          :lastMessage="truncateMessage(chat.lastMessage)"
        />
      </router-link>
    </div>
  </div>
</template>
