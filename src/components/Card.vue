<script setup lang="ts">
  import { marked } from 'marked'
  import { ref, onMounted } from 'vue'
  import { useMessage, NCard, NSkeleton, NFloatButton, NIcon } from 'naive-ui'
  import { Reload } from '@vicons/ionicons5'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/a11y-light.css'

  const promptUrl = 'http://localhost:5000/prompt'

  const emit = defineEmits(['response'])
  const props = defineProps({ content: String })

  const message = useMessage()
  const output = ref('')

  const loading = ref(true)

  function regen() {
    loading.value = true
    message.loading(
      '重新生成回答...', 
      { closable: true }
    )
    output.value = ''
    request()
  }

  function request() {
    fetch(promptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: props.content
      }),
    }).then(async (resp) => {
      if (resp.body == null) return
      const reader = resp.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          const blocks = document.querySelectorAll('pre code')
          blocks.forEach((block) => hljs.highlightElement(block as HTMLElement))
          loading.value = false
          break
        }
        const chunkText = decoder.decode(value)
        output.value += chunkText
      }
    }).catch(err => {
      console.error(err)
      if (output.value === '') {
        output.value = '请求异常，请重试'
      } else {
        message.error('请求异常')
      }
      loading.value = false
    })
  }

  onMounted(() => request())
</script>

<template>
  <NCard style="overflow: hidden;" :segmented="{ content: 'soft' }" hoverable>
    <template #header>
      <div class="question">{{ props.content }}</div>
      <NFloatButton v-if="!loading" @click="regen" top=5 right=5 width=30 height=30 position="absolute">
        <NIcon><Reload /></NIcon>
      </NFloatButton>
    </template>
    <NSkeleton v-if="output === ''" text :repeat=2 />
    <div v-else v-html="marked(output)" />
  </NCard>
</template>

<style scoped>
.question {
  font-size: 14px;
  color: gray;
  padding-right: 8px;
}
</style>
