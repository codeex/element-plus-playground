<script setup lang="ts">
import * as fabric from 'fabric'
import {
  getCurrentInstance,
  onMounted,
  ref,
  version as vueVersion,
  type ComponentInternalInstance,
} from 'vue'

const msg = ref('Hello World!')
const fabricVersion = fabric.version
onMounted(() => {
  const canvas = new fabric.Canvas('game')
  const rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 20,
    height: 20,
  })

  // "add" rectangle onto canvas
  canvas.add(rect)
})
</script>

<template>
  <h1>{{ msg }}</h1>
  <canvas id="game" width="600" height="400" />

  <p>Fabric Js {{ fabricVersion }} + Vue {{ vueVersion }}</p>
</template>
