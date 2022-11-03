<script setup lang="ts">
  const date = ref("")
  onMounted(async()=>{
    const response = await $fetch('/api/date');
    date.value = response.date
  })

</script>

<template>
  <div>
    Hello world
  </div>
  <div>{{date}}</div>
</template>
