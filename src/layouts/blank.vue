<template>
  <a-layout id="layout-blank" class="layout-blank" :class="[layoutClass]">
    <a-layout-content>
      <router-view />
      <Suspense>
        <template #default>
          <router-view />
        </template>
        <template #fallback>
          <h1>Loading...</h1>
        </template>
      </Suspense>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const layoutClass = route.meta.layoutClass
</script>
