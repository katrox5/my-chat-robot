<script setup lang="ts">
  import { ArrowDown } from '@vicons/ionicons5'
  import type Content from './components/Content.vue'

  const contentRef = ref<InstanceType<typeof Content>>()

  function clearMessages() {
    contentRef.value?.clearMessages()
  }

  function scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    })
  }
</script>

<template>
  <div class="max-w-70ch mx-a pt-24 pb-16 px-8">
    <NMessageProvider>
      <Header @response="clearMessages" class="mb-4" />
      <Content ref="contentRef" />
      <NFloatButton @click="scrollToBottom" top="20" right="20" shape="square">
        <NIcon><ArrowDown /></NIcon>
      </NFloatButton>
    </NMessageProvider>
  </div>
</template>
