<script setup lang="ts">
  import Header from './components/Header.vue'
  import Content from './components/Content.vue'
  import { ref } from 'vue'
  import { NMessageProvider, NFloatButton, NIcon } from 'naive-ui'
  import { ArrowDown } from '@vicons/ionicons5'

  function scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    })
  }

  const contentRef = ref()

  function cleanMessages() {
    contentRef.value?.cleanMessages()
  }
</script>

<template>
  <div style="max-width: 70ch; margin: 0 auto; padding: 6rem 2rem 4rem">
    <NMessageProvider>
      <Header @response="cleanMessages" />
      <Content ref="contentRef" />
      <NFloatButton @click="scrollToBottom" top="20" right="20" shape="square">
        <NIcon><ArrowDown /></NIcon>
      </NFloatButton>
    </NMessageProvider>
  </div>
</template>
