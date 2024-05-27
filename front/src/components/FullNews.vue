<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const newsId = ref(route.params._id);
const fullNewsData = ref({});
console.log(newsId)

onMounted(async () => {
    try {
        const { data } = await axios.get(`http://localhost:5137/api/news/${newsId.value}`);
        fullNewsData.value = data;
        console.log(fullNewsData.value)
    } catch (err) {
        console.log(err);
    }
});
</script>

<template>
    <div>
    <p>{{ fullNewsData.title }}</p>
    <p>{{ fullNewsData.text }}</p>
    <p>{{ fullNewsData.date }}</p>
    <p>{{ fullNewsData.imgUrl }}</p>
    </div>
</template>