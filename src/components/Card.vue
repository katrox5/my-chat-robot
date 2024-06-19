<script setup lang="ts">
  import { marked } from 'marked'
  import { ref, onMounted } from 'vue'
  import { useMessage, NCard, NTabs, NTabPane, NInput, NSkeleton, NFloatButton, NIcon } from 'naive-ui'
  import { Reload } from '@vicons/ionicons5'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/a11y-light.css'

  const emit = defineEmits(['response'])
  const props = defineProps({ content: String })

  const message = useMessage()
  const output = ref('')

  const loading = ref(true)
  const curTab = ref('提问')
  const swtchTab = (value: string) => curTab.value = value

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
    setTimeout(() => curTab.value = '回答', 400)
    fetch('/prompt', {
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
          blocks.forEach((block) => hljs.highlightBlock(block as HTMLElement))
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
      loading.value = true
    })
  }

  onMounted(() => request())
</script>

<template>
  <NCard content-style="padding-top: 0;" hoverable>
    <NTabs type="line" size="large" @update:value="swtchTab" :value="curTab" :tabs-padding=20>
      <NTabPane name="提问">
        <NInput type="textarea" readonly show-count :value="props.content" :autosize=true :resizable=false />
        <NFloatButton v-if="!loading" @click="regen" top=10 right=10 width=30 height=30 position="absolute">
          <NIcon><Reload /></NIcon>
        </NFloatButton>
      </NTabPane>
      <NTabPane name="回答">
        <NSkeleton v-if="output === ''" text :repeat=2 />
        <div v-else v-html="marked(output)" />
      </NTabPane>
    </NTabs>
  </NCard>
</template>
