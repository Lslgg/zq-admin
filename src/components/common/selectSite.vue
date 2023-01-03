<template>
  <a-select
    v-model:value="value"
    mode="multiple"
    style="width: 100%"
    placeholder="请选择站点"
    :options="options"
    @change="handleChange"
  >
    <template #option="{ label, icon }">
      <span class="block w-full" @mouseenter="onMouseenter(icon)">{{
        label
      }}</span>
    </template>
    <template #tagRender="{ label, closable, onClose }">
      <a-tag :closable="closable" @close="onClose">{{ label }}</a-tag>
    </template>
    <template #dropdownRender="{ menuNode: menu }">
      <div class="flex justify-between">
        <div class="flex-1 basis-1/3">
          <v-nodes :vnodes="menu" />
        </div>
        <div class="flex-1 p-4 overflow-hidden">
          <img class="w-72 h-36 m-auto" :src="iconImg" />
        </div>
      </div>
    </template>
  </a-select>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  components: {
    VNodes: (_, { attrs }) => {
      return attrs.vnodes
    },
  },
  setup() {
    const iconImg = ref<string>('/images/newImg/u1221.png')
    const options = ref([
      {
        value: 'china',
        label: 'http：// SinSir-B2B.com',
        icon: '/images/newImg/user_header_bg.png',
      },
      {
        value: 'usa',
        label: 'http：// SinSir-B2B.com',
        icon: '/images/illustrations/error-500.png',
      },
      {
        value: 'japan',
        label: 'Japan (日本站点)',
        icon: '/images/illustrations/chat.png',
      },
      {
        value: 'korea',
        label: 'Korea (韩国站点)',
        icon: '/images/illustrations/error-404.png',
      },
    ])
    const handleChange = (value: any) => {
      console.log(`selected ${value}`)
    }
    const onMouseenter = (value: any) => {
      iconImg.value = value
    }
    return {
      handleChange,
      onMouseenter,
      iconImg,
      options,
      value: ref([]),
    }
  },
})
</script>
