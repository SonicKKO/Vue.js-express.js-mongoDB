<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';


import NewsSample from './NewsSample.vue';

const news = ref([]);

onMounted(async () => {
    try {
       const { data } = await axios.get('http://localhost:5137/api/news')  
       news.value = data
       console.log(news.value)
    } catch (err) {
        console.log(err)
    }
});
</script>

<template>
    <div class="h-[82vh] w-[100vw] pt-4 pl-2 ">
        <div class="h-[97%] w-[95%] overflow-y-auto m-auto border rounded-2xl">
            <router-link v-for="item in news" :key="item._id" :to="'/FullNews/' + item._id">
                <NewsSample 
                    :_id="item._id"
                    :title="item.title"
                    :text="item.text"
                    :date="item.date"
                    :imgUrl="item.imgUrl"
                />
            </router-link>
        </div>
    </div>
</template>

