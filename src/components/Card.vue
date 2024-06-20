<script setup lang="ts">
  import { marked } from 'marked'
  import { ref, onMounted } from 'vue'
  import { useMessage, NCard, NSkeleton, NFloatButton, NIcon } from 'naive-ui'
  import { Reload } from '@vicons/ionicons5'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/a11y-light.css'

  const message = useMessage()
  const promptUrl = 'http://localhost:5000/prompt'

  const emit = defineEmits(['response'])
  const props = defineProps({
    prompt: String,
    answer: String,
  })

  const id = ref(-1)
  const output = ref('')

  function regen() {
    if (id.value == -1) {
      return
    }
    message.loading('重新生成回答...', { closable: true })
    output.value = ''
    request()
  }

  function request() {
    const options = localStorage.getItem('options')
    const json = JSON.parse(options ?? '{}')
    const temperature: number = (json['temperature'] ?? 70) / 100
    const penalty_score: number = ((json['penaltyScore'] ?? 0) + 100) / 100
    const messages = JSON.parse(localStorage.getItem('messages') ?? '[]')

    const prompt = id.value == -1 ? messages : messages.slice(0, id.value - 1)
    prompt.push({
      role: 'user',
      content: props.prompt,
    })

    fetch(promptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        temperature,
        penalty_score,
      }),
    })
      .then(async (resp) => {
        if (resp.body == null) return
        const reader = resp.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            const blocks = document.querySelectorAll('pre code')
            blocks.forEach((block) => hljs.highlightElement(block as HTMLElement))
            save2Storage()
            break
          }
          const chunkText = decoder.decode(value)
          output.value += chunkText
        }
      })
      .catch((err) => {
        console.error('请求异常', err)
        if (output.value == '') {
          output.value = '请求异常，请重试'
        } else {
          message.error('请求异常')
        }
      })
  }

  function save2Storage() {
    const messages = JSON.parse(localStorage.getItem('messages') ?? '[]')
    if (id.value == -1) {
      messages.push(
        {
          role: 'user',
          content: props.prompt,
        },
        {
          role: 'assistant',
          content: output.value,
        },
      )
      id.value = messages.length - 1
    } else {
      messages[id.value].content = output.value
    }
    localStorage.setItem('messages', JSON.stringify(messages))
  }

  onMounted(() => {
    if (props.answer) {
      output.value = props.answer
      return
    }
    request()
  })
</script>

<template>
  <NCard style="overflow: hidden" :segmented="{ content: 'soft' }" hoverable>
    <template #header>
      <div class="question" v-html="marked(props.prompt ?? '')" />
      <NFloatButton
        v-if="id != -1"
        @click="regen"
        top="5"
        right="5"
        width="30"
        height="30"
        position="absolute"
      >
        <NIcon><Reload /></NIcon>
      </NFloatButton>
    </template>
    <NSkeleton v-if="output == ''" text :repeat="2" />
    <div v-else v-html="marked(output)" />
  </NCard>
</template>

<style scoped>
  .question {
    font-size: 15px;
    color: gray;
    padding-right: 8px;
  }
</style>
