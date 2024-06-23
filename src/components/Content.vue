<script setup lang="ts">
  interface Card {
    prompt: string
    answer?: string
    id?: number
  }

  defineExpose({
    clearMessages() {
      localStorage.removeItem('messages')
      cards.value = []
    },
  })

  const cards = ref<Card[]>([])

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
        answer: answer['content'],
      })
    }
  }

  onMounted(() => loadMessages())
</script>

<template>
  <div class="last:mb-4" v-for="{ prompt, answer, id } in cards">
    <Card :prompt="prompt" :answer="answer" :id="id" />
  </div>
  <Footer @request="addPrompt" class="mt-4" />
</template>
