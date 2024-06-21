<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import Card from './Card.vue'
  import Footer from './Footer.vue'

  defineExpose({
    cleanMessages() {
      localStorage.removeItem('messages')
      cards.value = []
    },
  })

  interface Card {
    prompt: string
    answer?: string
  }
  const cards = ref<Card[]>([])

  const addPrompt = (prompt: string) => cards.value.push({ prompt })

  function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages') ?? '[]')
    let prompt
    for (const msg of messages) {
      if (msg['role'] == 'user') {
        prompt = msg['content']
      } else if (msg['role'] == 'assistant' && prompt) {
        cards.value.push({
          prompt,
          answer: msg['content'],
        })
        prompt = undefined
      }
    }
  }

  onMounted(() => loadMessages())
</script>

<template>
  <div class="mb-4" v-for="item in cards">
    <Card :prompt="item.prompt" :answer="item.answer" @response="addPrompt" />
  </div>
  <Footer @response="addPrompt" />
</template>
