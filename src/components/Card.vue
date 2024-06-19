<script setup lang="ts">
  import hljs from 'highlight.js'
  import axios from 'axios'
  import { marked } from 'marked'
  import { ref, onMounted, h } from 'vue'
  import { useMessage, useNotification, NCard, NTabs, NTabPane, NInput, NSkeleton, NConfigProvider, NFloatButton, NIcon, NCode, NButton } from 'naive-ui'
  import { Reload, CopyOutline } from '@vicons/ionicons5'

  type Segement = {
    type: 'text' | 'code'
    content: string
    language?: string
  }

  const emit = defineEmits(['response'])
  const props = defineProps({ content: String })
  const message = useMessage()
  const notification = useNotification()

  const loading = ref(true)

  const segments = ref<Segement[]>([])
  const curTab = ref('提问')

  const swtchTab = (value: string) => curTab.value = value

  const copy = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
      message.success(
        '复制成功',
        { duration: 1500 }
      )
    } else {
      const inputDom = document.createElement('textarea')
      inputDom.value = text
      document.body.appendChild(inputDom)
      inputDom.select()
      if (document.execCommand('copy')) {
        message.success(
          '复制成功',
          { duration: 1500 }
        )
      }
      document.body.removeChild(inputDom)
    }
  }

  const regenerate = () => {
    loading.value = true
    message.loading(
      '重新生成回答...', 
      { closable: true }
    )
    segments.value = []
    request()
  }

  function extractCode(str: string) {
    const codeRegex = /```[\s\S]*?```/g

    let match: RegExpExecArray | null
    let lastIndex = 0
    while (match = codeRegex.exec(str)) {
      const textSegment = str.substring(lastIndex, match.index)
      if (textSegment.trim() !== '') {
        segments.value.push({ type: 'text', content: textSegment })
      }

      const codeSegment = match[0]
      const index = codeSegment.indexOf('\n')
      segments.value.push({
        type: 'code',
        language: codeSegment.substring(3, index),
        content: codeSegment.substring(index + 1, codeSegment.length - 3)
      })

      lastIndex = match.index + codeSegment.length
    }

    if (lastIndex < str.length) {
      const finalTextSegment = str.substring(lastIndex)
      if (finalTextSegment.trim() !== '') {
        segments.value.push({ type: 'text', content: finalTextSegment })
      }
    }
  }

  function request() {
    axios.post('/prompt', { prompt: props.content }, { timeout: 60000 }).then(response => {
      if (response.status == 200) {
        extractCode(response.data)
        loading.value = false
        curTab.value = '回答'
      }
    }).catch((err) => {
      const title = err.code !== 'ECONNABORTED' ? '请求异常' : '请求超时'
      const notify = notification.error({
        title: title,
        description: limitText(props.content as string, 64),
        meta: new Date().toLocaleTimeString(),
        action: () => h(
          NButton,
          {
            text: true,
            type: 'primary',
            onClick: () => {
              emit('response', props.content)
              notify.destroy()
            }
          },
          { default: () => '重试' }
        )
      })
    })
  }

  const limitText = (text: string, maxLength: number) =>
    text.length <= maxLength ? text : text.substring(0, maxLength) + '...'

  onMounted(() => request())
</script>

<template>
  <NCard content-style="padding-top: 0;" hoverable>
    <NTabs type="line" size="large" @update:value="swtchTab" :value="curTab" :tabs-padding=20>
      <NTabPane name="提问">
        <NInput type="textarea" readonly show-count :value="props.content" :autosize=true :resizable=false />
        <NFloatButton v-if="!loading" @click="regenerate" top=10 right=10 width=30 height=30 position="absolute">
          <NIcon><Reload /></NIcon>
        </NFloatButton>
      </NTabPane>
      <NTabPane name="回答">
        <NSkeleton v-if="loading" text :repeat=5 />
        <template v-else v-for="segment in segments">
          <NConfigProvider :hljs="hljs">
            <div v-if="segment.type === 'text'" v-html="marked(segment.content)" />
            <NCard v-else-if="segment.type === 'code'" embedded>
              <NFloatButton @click="copy(segment.content)" top=5 right=5 width=30 height=30 position="absolute" shape="square">
                <NIcon><CopyOutline /></NIcon>
              </NFloatButton>
              <NCode style="overflow: auto;" show-line-numbers :code="segment.content" :language="segment.language" />
            </NCard>
          </NConfigProvider>
        </template>
      </NTabPane>
    </NTabs>
  </NCard>
</template>
