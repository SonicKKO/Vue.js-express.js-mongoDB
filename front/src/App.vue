<script setup>
import Header from './components/Header.vue';
import SM from './components/SM.vue';
</script>

<template>
    <div >
        <Header />

        <router-view></router-view>

        <SM /> 
    </div>
</template>
