<script setup lang="ts">
  import { NGrid, NGridItem, NFlex, NImage, NButton, NIcon, NGradientText } from 'naive-ui'
  import { SettingsOutline } from '@vicons/ionicons5'
</script>

<template>
  <NGrid y-gap=3 cols=1>
    <NGridItem>
      <NFlex justify="space-between" align="center" :wrap=false>
        <NImage style="border-radius: 4px;" height="64px" width="64px" src="static/avatar.jpg" preview-disabled />
        <NButton quaternary>
          <template #icon>
            <NIcon><SettingsOutline /></NIcon>
          </template>
        </NButton>
      </NFlex>
    </NGridItem>
    <NGridItem>
      <NGradientText class="title" :gradient="{ from: 'rgb(130, 112, 255)', to: 'rgb(189, 255, 254)', deg: 90 }">
        Katrox'&nbsp;
      </NGradientText>
      <NGradientText class="title" :gradient="{ from: 'rgb(89, 184, 237)', to: 'rgb(50, 146, 109)', deg: 90 }">
        Chat Robot
      </NGradientText>
    </NGridItem>
    <NGridItem>
      <div class="subtitle">基于模型 (ERNIE-Speed-128K).</div>
    </NGridItem>
  </NGrid>
</template>

<style scoped>
.title {
  font-size: 1.5rem;
  font-weight: 800;
}
.subtitle {
  font-size: 1.0rem;
  color: gray;
}
</style>
