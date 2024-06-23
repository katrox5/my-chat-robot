<script setup lang="ts">
  import { SettingsOutline, TrashBinOutline } from '@vicons/ionicons5'
  import type Setting from './Setting.vue'

  const emit = defineEmits<{
    (e: 'response'): void
  }>()

  const settingRef = ref<InstanceType<typeof Setting>>()

  function showSettingModal() {
    settingRef.value?.show()
  }
</script>

<template>
  <n-grid y-gap="3" cols="1" v-bind="$attrs">
    <n-grid-item>
      <n-flex justify="space-between" align="center" :wrap="false">
        <n-image
          class="b-rd-4px"
          width="64px"
          height="64px"
          src="static/avatar.jpg"
          preview-disabled
        />
        <n-button @click="showSettingModal">
          <template #icon>
            <n-icon><settings-outline /></n-icon>
          </template>
        </n-button>
      </n-flex>
    </n-grid-item>
    <n-grid-item>
      <n-gradient-text
        class="text-2xl font-bold"
        :gradient="{
          from: 'rgb(130, 112, 255)',
          to: 'rgb(189, 255, 254)',
          deg: 90,
        }"
      >
        Katrox'&nbsp;
      </n-gradient-text>
      <n-gradient-text
        class="text-2xl font-bold"
        :gradient="{
          from: 'rgb(89, 184, 237)',
          to: 'rgb(50, 146, 109)',
          deg: 90,
        }"
      >
        Chat Robot
      </n-gradient-text>
    </n-grid-item>
    <n-grid-item>
      <n-flex justify="space-between" align="center" :wrap="false">
        <div class="text-base c-gray">基于模型 (ERNIE-Speed-128K).</div>
        <n-popconfirm
          placement="left"
          positive-text="确认"
          negative-text="取消"
          @positive-click="emit('response')"
        >
          <template #trigger>
            <n-button quaternary>
              <template #icon>
                <n-icon><trash-bin-outline /></n-icon>
              </template>
            </n-button>
          </template>
          <span>该操作将清除所有记录</span>
        </n-popconfirm>
      </n-flex>
    </n-grid-item>
  </n-grid>
  <Setting ref="settingRef" />
</template>
