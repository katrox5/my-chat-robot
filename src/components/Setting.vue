<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { NModal, NSpace, NForm, NFormItem, NFlex, NPopover, NIcon, NSlider } from 'naive-ui'
  import { InformationCircleOutline } from '@vicons/ionicons5'

  const modalVisible = ref(false)

  defineExpose({
    show() {
      modalVisible.value = true
    },
  })

  const model = ref({
    temperature: 70,
    penaltyScore: 0,
  })

  const tooltip = (value: number) => (value / 100).toFixed(2)

  function saveOptions() {
    localStorage.setItem('options', JSON.stringify(model.value))
  }

  onMounted(() => {
    const options = localStorage.getItem('options')
    if (!options) {
      saveOptions()
      return
    }
    model.value = JSON.parse(options)
  })
</script>

<template>
  <NModal
    title="设置"
    preset="card"
    @after-leave="saveOptions"
    v-model:show="modalVisible"
    :auto-focus="false"
    class="w-450px px-10px"
  >
    <NSpace vertical>
      <NForm :model="model" label-placement="left" label-width="100px">
        <NFormItem path="temperature">
          <template #label>
            <NFlex align="center" justify="end">
              <NPopover placement="right">
                <template #trigger>
                  <NIcon><InformationCircleOutline /></NIcon>
                </template>
                <div>
                  <div>说明：</div>
                  <div>（1）较高的数值会使输出更加随机，而较低的数值会使其更加集中和确定 </div>
                  <div>（2）默认0.70，范围 (0, 1.0]</div>
                </div>
              </NPopover>
              <span>生成温度</span>
            </NFlex>
          </template>
          <NSlider
            v-model:value="model.temperature"
            :min="10"
            :max="100"
            :step="5"
            :format-tooltip="(val) => tooltip(val)"
          />
        </NFormItem>
        <NFormItem path="penaltyScore">
          <template #label>
            <NFlex align="center" justify="end">
              <NPopover placement="right">
                <template #trigger>
                  <NIcon><InformationCircleOutline /></NIcon>
                </template>
                <div>
                  <div>对已生成的token增加惩罚，减少重复生成的现象。</div>
                  <div>说明：</div>
                  <div>（1）值越大表示惩罚越大</div>
                  <div>（2）默认1.0，取值范围：[1.0, 2.0]</div>
                </div>
              </NPopover>
              <span>重复惩罚</span>
            </NFlex>
          </template>
          <NSlider
            v-model:value="model.penaltyScore"
            :step="5"
            :format-tooltip="(val) => tooltip(val + 100)"
          />
        </NFormItem>
      </NForm>
    </NSpace>
  </NModal>
</template>
