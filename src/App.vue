<script setup lang="ts">
  import { ArrowDown } from '@vicons/ionicons5'

  const contentRef = ref()

  function cleanMessages() {
    contentRef.value?.cleanMessages()
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
      <Header @response="cleanMessages" />
      <Content ref="contentRef" />
      <NFloatButton @click="scrollToBottom" top="20" right="20" shape="square">
        <NIcon><ArrowDown /></NIcon>
      </NFloatButton>
    </NMessageProvider>
  </div>
</template>
