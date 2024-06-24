<script setup lang="ts">
  import { ArrowDown } from '@vicons/ionicons5'
  import type Content from './components/Content.vue'
  import { useOsTheme, darkTheme } from 'naive-ui'

  const osThemeRef = useOsTheme()
  const theme = computed(() => (osThemeRef.value == 'dark' ? darkTheme : null))
  const contentRef = ref<InstanceType<typeof Content>>()

  function clearMessages() {
    contentRef.value?.clearMessages()
  }

  function scroll2Bottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    })
  }
</script>

<template>
  <n-config-provider :theme="theme">
    <n-global-style />
    <div class="max-w-70ch mx-a pt-24 pb-16 px-8">
      <n-message-provider>
        <Header @response="clearMessages" class="mb-4" />
        <Content ref="contentRef" />
        <n-float-button @click="scroll2Bottom" top="20" right="20" shape="square">
          <n-icon><arrow-down /></n-icon>
        </n-float-button>
      </n-message-provider>
    </div>
  </n-config-provider>
</template>
