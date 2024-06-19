<script setup lang="ts">
  import { ref } from 'vue'
  import Card from './Card.vue'
  import Footer from './Footer.vue'

  const prompts = ref<string[]>([])
  const addPrompt = (prompt: string) => prompts.value.push(prompt)
</script>

<template>
  <div style="margin-bottom: 2rem;">
    <template v-for="prompt in prompts">
      <Card :content="prompt" @response="addPrompt" />
    </template>
  </div>
  <Footer @response="addPrompt" />
</template>
