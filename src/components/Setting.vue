<script setup lang="ts">
  import { InformationCircleOutline } from '@vicons/ionicons5'

  defineExpose({
    show() {
      modalVisible.value = true
    },
  })

  const modalVisible = ref(false)

  const model = ref({
    temperature: 70,
    penaltyScore: 0,
  })

  const tooltip = (value: number) => (value / 100).toFixed(2)

  function saveOptions() {
    localStorage.setItem('options', JSON.stringify(model.value))
  }

  function loadOptions() {
    const options = localStorage.getItem('options')
    if (!options) {
      saveOptions()
      return
    }
    model.value = JSON.parse(options)
  }

  onMounted(() => loadOptions())
</script>

<template>
  <n-modal
    title="设置"
    preset="card"
    class="w-450px pr-10px"
    @after-leave="saveOptions"
    v-model:show="modalVisible"
    :auto-focus="false"
  >
    <n-space vertical>
      <n-form :model="model" label-placement="left" label-width="100px">
        <n-form-item path="temperature">
          <template #label>
            <n-flex align="center" justify="end">
              <n-popover placement="right">
                <template #trigger>
                  <n-icon><information-circle-outline /></n-icon>
                </template>
                <div>
                  <div>说明：</div>
                  <div>（1）较高的数值会使输出更加随机，而较低的数值会使其更加集中和确定 </div>
                  <div>（2）默认0.70，范围 (0, 1.0]</div>
                </div>
              </n-popover>
              <span>生成温度</span>
            </n-flex>
          </template>
          <n-slider
            v-model:value="model.temperature"
            :min="10"
            :max="100"
            :step="5"
            :format-tooltip="(val) => tooltip(val)"
          />
        </n-form-item>
        <n-form-item path="penaltyScore">
          <template #label>
            <n-flex align="center" justify="end">
              <n-popover placement="right">
                <template #trigger>
                  <n-icon><information-circle-outline /></n-icon>
                </template>
                <div>
                  <div>对已生成的token增加惩罚，减少重复生成的现象。</div>
                  <div>说明：</div>
                  <div>（1）值越大表示惩罚越大</div>
                  <div>（2）默认1.0，取值范围：[1.0, 2.0]</div>
                </div>
              </n-popover>
              <span>重复惩罚</span>
            </n-flex>
          </template>
          <n-slider
            v-model:value="model.penaltyScore"
            :step="5"
            :format-tooltip="(val) => tooltip(val + 100)"
          />
        </n-form-item>
      </n-form>
    </n-space>
  </n-modal>
</template>
