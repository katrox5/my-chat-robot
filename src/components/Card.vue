<script setup lang="ts">
  import { marked } from 'marked'
  import { Reload } from '@vicons/ionicons5'
  import { useMessage } from 'naive-ui'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/a11y-light.css'

  const emit = defineEmits(['response'])
  const props = defineProps({
    id: Number,
    prompt: String,
  })
  const message = useMessage()

  const id = ref(-1)
  const output = ref('')
  const loading = ref(true)

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

    fetch('/prompt', {
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
            const blocks = document.querySelectorAll('pre code')
            blocks.forEach((block) => hljs.highlightElement(block as HTMLElement))
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

  const getJsonValue = (key: string, def: string) => JSON.parse(localStorage.getItem(key) ?? def)

  onMounted(() => {
    if (props.id) {
      id.value = props.id
      output.value = getJsonValue('messages', '[]')[props.id]['content']
      loading.value = false
      return
    }
    request()
  })
</script>

<template>
  <NCard class="of-hidden" :segmented="{ content: 'soft' }" hoverable>
    <template #header>
      <div class="text-15px c-gray-5 pr-2" v-html="marked(props.prompt ?? '')" />
      <NFloatButton
        v-if="!loading"
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
