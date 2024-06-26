<script setup lang="ts">
  import { marked } from 'marked'
  import { Reload } from '@vicons/ionicons5'
  import { useMessage } from 'naive-ui'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/github-dark-dimmed.css'

  const vHighlight = {
    mounted: (el: Element) => {
      el.querySelectorAll('pre code').forEach((block) =>
        hljs.highlightElement(block as HTMLElement),
      )
    },
    updated: (el: Element) => {
      el.querySelectorAll('pre code').forEach((block) =>
        hljs.highlightElement(block as HTMLElement),
      )
    },
  }

  const props = defineProps<{
    prompt: string
    answer?: string
    id?: number
  }>()
  const message = useMessage()

  const id = ref(-1)
  const output = ref('')
  const loading = ref(true)

  const getJsonValue = (key: string, def: string) => JSON.parse(localStorage.getItem(key) ?? def)

  function regen() {
    loading.value = true
    message.loading('重新生成回答...', { closable: true })
    output.value = ''
    request()
  }

  function request() {
    const options = getJsonValue('options', '{}')
    const temperature: number = (options['temperature'] ?? 70) / 100
    const penalty_score: number = ((options['penaltyScore'] ?? 0) + 100) / 100
    const messages = getJsonValue('messages', '[]')

    const prompt = id.value == -1 ? messages : messages.slice(0, id.value - 1)
    prompt.push({
      role: 'user',
      content: props.prompt,
    })

    fetch('http://localhost:5000/prompt', {
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
        if (!resp.body || resp.status != 200) {
          message.error('请求异常')
          output.value = '请重试'
          return
        }
        const reader = resp.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            save2Storage()
            break
          }
          const chunkText = decoder.decode(value)
          output.value += chunkText
        }
      })
      .finally(() => (loading.value = false))
  }

  function save2Storage() {
    const messages = getJsonValue('messages', '[]')
    if (id.value >= 0) {
      messages[id.value].content = output.value
    } else {
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
    }
    localStorage.setItem('messages', JSON.stringify(messages))
  }

  onMounted(() => {
    if (props.id && props.answer) {
      id.value = props.id
      output.value = props.answer
      loading.value = false
      return
    }
    request()
  })
</script>

<template>
  <n-card :segmented="{ content: 'soft' }" hoverable>
    <template #header>
      <div class="text-15px c-gray-4 pr-2" v-html="marked(props.prompt ?? '')" />
      <n-float-button
        v-if="!loading"
        @click="regen"
        top="5"
        right="5"
        width="30"
        height="30"
        position="absolute"
      >
        <n-icon><reload /></n-icon>
      </n-float-button>
    </template>
    <n-skeleton v-if="output == ''" :repeat="2" text />
    <div v-else v-highlight v-html="marked(output)" />
  </n-card>
</template>

<style>
  .hljs {
    border-radius: 5px;
  }
</style>
