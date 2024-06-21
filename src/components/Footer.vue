<script setup lang="ts">
  import { ref } from 'vue'
  import { NFlex, NInput, NButton, useMessage } from 'naive-ui'

  const emit = defineEmits(['response'])
  const message = useMessage()

  const inputDom = ref()
  const prompt = ref('')

  const input = (value: string) => (prompt.value = value)

  const enter = (event: KeyboardEvent) => {
    if (!event.shiftKey) {
      event.preventDefault()
      response()
    }
  }

  async function response() {
    if (prompt.value.trim() == '') {
      message.warning('问题不能为空')
      return
    }
    emit('response', prompt.value.trim())
    inputDom.value?.clear()
  }
</script>

<template>
  <NFlex justify="space-between" :wrap="false" class="pt-4">
    <NInput
      ref="inputDom"
      @input="input"
      @keydown.enter="enter"
      class="w-85% max-h-40px text-lg"
      type="textarea"
      placeholder="请输入问题"
      :autosize="{ maxRows: 5 }"
    />
    <NButton @click="response" class="h-40px text-lg">发送</NButton>
  </NFlex>
</template>
