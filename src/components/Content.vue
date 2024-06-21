<script setup lang="ts">
  interface Card {
    id?: number
    prompt: string
  }

  const cards = ref<Card[]>([])

  defineExpose({
    cleanMessages() {
      localStorage.removeItem('messages')
      cards.value = []
    },
  })

  const addPrompt = (prompt: string) => cards.value.push({ prompt })

  function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages') ?? '[]')
    for (let i = 0; i < messages.length; i += 2) {
      const prompt = messages[i]
      const answer = messages[i + 1]
      if (
        prompt['role'] != 'user' ||
        !prompt['content'] ||
        answer?.['role'] != 'assistant' ||
        !answer?.['content']
      )
        continue
      cards.value.push({
        id: i + 1,
        prompt: prompt['content'],
      })
    }
  }

  onMounted(() => loadMessages())
</script>

<template>
  <div class="last:mb-4" v-for="item in cards">
    <Card :id="item.id" :prompt="item.prompt" @response="addPrompt" />
  </div>
  <Footer @response="addPrompt" />
</template>
