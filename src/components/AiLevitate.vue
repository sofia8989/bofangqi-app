<template>
    <div v-if="routes.includes($route.name)" @click="$router.push({name:'ai'})" class="fixed right-[10px] bottom-[120px]  h-[102px] w-[100px]">
        <img class="w-full" src="@/assets/images/base64ai.text?raw" alt="" srcset="">
    </div>
</template>

<script setup>
import { ref } from "vue";
const routes =ref(['nav','home','welfare','actual'])
</script>