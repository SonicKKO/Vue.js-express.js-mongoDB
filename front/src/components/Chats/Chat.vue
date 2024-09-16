<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import socket from '../../socket.js';
import ChatList from './ChatList.vue';

const route = useRoute();
let   chatId = route.params.chatId; 
const messages = ref([]);
const newMessage = ref('');

const mainUser = ref({});
const user = ref({});

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
    fetchUserDetails(); 
    // console.log('профиль', mainUser.value);  
  } catch (error) {
    console.error('мист:', error);
  }
};

const fetchUserDetails = async () => {
  try {
    const { chatId } = route.params;  
    // console.log('chatId',chatId);
    const currentUserId = mainUser.value._id; 
    // console.log('id main',mainUser.value._id);

    const response = await axios.get(`http://localhost:5137/api/chats/${chatId}`);
    const participants = response.data.participants;
    // console.log('ids', participants);

    const otherUser = participants.find(participant => String(participant) !== String(currentUserId));
    // console.log('тут', otherUser);

    if (otherUser) {
      // console.log('ID второго пользователя', otherUser);
      
      const userResponse = await axios.get(`http://localhost:5137/api/users/${otherUser}`);
      user.value = userResponse.data;
      // console.log(user.value.profilePicture)
    } else {
      console.error('второго пользователя няма');
    }
  } catch (error) {
    console.error('бобо не грузе', error);
  }
};

const fetchMessages = async () => {
  try {
    const response = await axios.get(`http://localhost:5137/api/chats/${chatId}/messages`);
    messages.value = response.data.messages; 
    // console.log('сообщения', messages.value);
  } catch (error) {
    console.error('бе', error);
  }
};

// отправка сообщения
const sendMessage = async () => {
  if (newMessage.value.trim() === '') return;

  // console.log('Отправка', { chatId, message: newMessage.value, senderId: mainUser.value._id });

  socket.emit('sendMessage', { chatId, message: newMessage.value, senderId: mainUser.value._id });
  newMessage.value = '';
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

watch(() => route.params.chatId, async (newChatId) => {
  chatId = newChatId;
  await fetchUserDetails();
  await fetchMessages();

  socket.emit('joinRoom', { chatId: newChatId });
});

onMounted(() => {
  fetchUserProfile();
  fetchMessages(); 
  
  //присоединение к комнате чата по chatId
  socket.emit('joinRoom', { chatId });

  // новое сообщение через сокет
  socket.on('receiveMessage', ({ message, sender }) => {
  messages.value.push({ content: message, sender });
  // console.log('новое сообщение', message, 'от', sender); 
});


});

onBeforeUnmount(() => {
  socket.off('receiveMessage');
});

</script>

<template>
  <div class="flex flex-col md:flex-row h-[82vh]">
    <div class="md:w-1/3 border-r border-gray-200 h-full overflow-y-auto">
      <p class="text-center p-2">Чаты</p>
      <ChatList />
    </div>

    <div class="md:w-2/3 flex flex-col h-full">
      <div class="flex-none">
        <div class="w-full h-14 bg-slate-200 mb-0.5 flex items-center">
          <div class="w-16 h-full pt-0.5">
            <img v-if="user.profilePicture" 
                 :src="`http://localhost:5137/${user.profilePicture}`"
                 class="h-11 w-11 mx-auto rounded-full" alt="Profile Picture">    
            <img v-else 
                 src="../../assets/images.jpg" alt="Default Image"
                 class="h-11 w-11 mx-auto rounded-full">    
          </div>
          <div>
            <strong>{{user.name}}</strong>
            <p>active time</p>
          </div>
          <div class="ml-auto">
            <p class="w-12 h-10 text-center pr-2 text-2xl">⋮</p>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-2">
        <div v-if="mainUser && mainUser._id">
          <div v-for="(message, index) in messages" :key="index" class="mb-4">
            <div 
              :class="{
                'flex justify-end': message.sender === mainUser._id,
                'flex justify-start': message.sender !== mainUser._id
              }"
            >
              <div>
                <p 
                  :class="{
                    'bg-blue-500 text-white p-2 rounded-lg max-w-xs relative': message.sender === mainUser._id,
                    'bg-gray-200 text-black p-2 rounded-lg max-w-xs relative': message.sender !== mainUser._id
                  }"
                >
                  {{ message.content }}
                  <span 
                    class="text-xs text-gray-500 absolute bottom-0 right-1" 
                    style="transform: translateY(100%);"
                  >
                    {{ formatTimestamp(message.timestamp) }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-none w-full bg-white h-10 flex items-center">
        <textarea class="w-2/3 border-t h-full p-2 resize-none"
                  v-model="newMessage"
                  placeholder="Введите сообщение..."></textarea>
        <button class="text-black px-4" @click="sendMessage">Отправить</button>
      </div>
    </div>
  </div>
</template>
