<script setup lang="ts">
  import Header from './components/Header.vue'
  import Content from './components/Content.vue'
  import { NMessageProvider, NNotificationProvider, NFloatButton, NIcon } from 'naive-ui'
  import { ArrowDown } from '@vicons/ionicons5'

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  }
</script>

<template>
  <div style="max-width: 70ch; margin: 0 auto; padding: 6rem 2rem 4rem;">
    <NMessageProvider><NNotificationProvider>
      <Header style="margin-bottom: 1rem;" />
      <Content />
      <NFloatButton @click="scrollToBottom" top="20" right="20" shape="square">
        <NIcon><ArrowDown /></NIcon>
      </NFloatButton>
    </NNotificationProvider></NMessageProvider>
  </div>
</template>
