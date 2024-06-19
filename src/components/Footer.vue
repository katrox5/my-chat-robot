<script setup lang="ts">
  import { ref } from 'vue'
  import { NFlex, NInput, NButton } from 'naive-ui'

  const emit = defineEmits(['response'])

  const inputDom = ref()
  const prompt = ref('')

  const input = (value: string) => prompt.value = value

  const enter = (event: KeyboardEvent) => {
    if (!event.shiftKey) {
      event.preventDefault()
      response()
    }
  }

  async function response() {
    if (prompt.value.trim() !== '') {
      emit('response', prompt.value.trim())
      inputDom.value?.clear()
    }
  }
</script>

<template>
  <NFlex justify="space-between" :wrap=false>
    <NInput ref="inputDom" @input="input" @keydown.enter="enter" type="textarea" clearable :autosize="{ maxRows: 5 }"
      placeholder="请输入问题" style="width: 85%; min-height: 40px; font-size: large;" />
    <NButton @click="response" style="height: 40px; font-size: large;">发送</NButton>
  </NFlex>
</template>
