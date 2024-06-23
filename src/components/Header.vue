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
  <NGrid y-gap="3" cols="1" v-bind="$attrs">
    <NGridItem>
      <NFlex justify="space-between" align="center" :wrap="false">
        <NImage
          class="b-rd-4px"
          width="64px"
          height="64px"
          src="static/avatar.jpg"
          preview-disabled
        />
        <NButton @click="showSettingModal">
          <template #icon>
            <NIcon><SettingsOutline /></NIcon>
          </template>
        </NButton>
      </NFlex>
    </NGridItem>
    <NGridItem>
      <NGradientText
        class="text-2xl font-bold"
        :gradient="{
          from: 'rgb(130, 112, 255)',
          to: 'rgb(189, 255, 254)',
          deg: 90,
        }"
      >
        Katrox'&nbsp;
      </NGradientText>
      <NGradientText
        class="text-2xl font-bold"
        :gradient="{
          from: 'rgb(89, 184, 237)',
          to: 'rgb(50, 146, 109)',
          deg: 90,
        }"
      >
        Chat Robot
      </NGradientText>
    </NGridItem>
    <NGridItem>
      <NFlex justify="space-between" align="center" :wrap="false">
        <div class="text-base c-gray">基于模型 (ERNIE-Speed-128K).</div>
        <NPopconfirm
          placement="left"
          positive-text="确认"
          negative-text="取消"
          @positive-click="emit('response')"
        >
          <template #trigger>
            <NButton quaternary>
              <template #icon>
                <NIcon><TrashBinOutline /></NIcon>
              </template>
            </NButton>
          </template>
          <span>该操作将清除所有记录</span>
        </NPopconfirm>
      </NFlex>
    </NGridItem>
  </NGrid>
  <Setting ref="settingRef" />
</template>
