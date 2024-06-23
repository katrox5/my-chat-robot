<script setup lang="ts">
  import { useMessage } from 'naive-ui'

  const emit = defineEmits<{
    request: [prompt: string]
  }>()
  const message = useMessage()

  const prompt = ref('')

  const enter = (event: KeyboardEvent) => {
    if (!event.shiftKey) {
      event.preventDefault()
      request()
    }
  }

  async function request() {
    if (prompt.value.trim() == '') {
      message.warning('问题不能为空')
      return
    }
    emit('request', prompt.value.trim())
    prompt.value = ''
  }
</script>

<template>
  <n-flex justify="space-between" :wrap="false">
    <n-input
      @keydown.enter="enter"
      v-model:value="prompt"
      :autosize="{ maxRows: 5 }"
      class="w-85% min-h-40px text-lg"
      type="textarea"
      placeholder="请输入问题"
    />
    <n-button @click="request" class="h-40px text-lg">发送</n-button>
  </n-flex>
</template>
