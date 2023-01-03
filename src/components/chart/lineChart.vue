<script lang="ts">
import { use } from 'echarts/core'
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent, } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, defineComponent, PropType } from 'vue'
import { IGrid } from '@/api/api.model'
use([GridComponent, LineChart, CanvasRenderer, UniversalTransition, TooltipComponent, TitleComponent, LegendComponent])

interface IListData {
  name: string
  type: string
  smooth: boolean
  data: number[]
}
export default defineComponent({
  components: { VChart },
  provide: { [THEME_KEY]: 'white' },
  props: {
    listData: {
      type: Array as PropType<IListData[]>,
      default: () => [],
    },
    grid: {
      type: Object as PropType<IGrid>,
      default: () => ({ top: 12, left: 52, right: 12, bottom: 30 }),
    },
    xData: { type: Array, default: () => [] },
    legend: { type: Object as PropType<any>, default: () => { } }
  },
  setup: (props) => {
    const series = props.listData.map((p) => {
      return { showSymbol: false, name: p.name, data: p.data, type: 'line', smooth: true }
    })
    const option = ref({
      tooltip: { trigger: 'axis' },
      legend: props.legend,
      xAxis: { type: 'category', data: props.xData },
      yAxis: { type: 'value' },
      series: [...series],
      grid: props.grid
    })
    return { option }
  },
})
</script>

<template>
  <v-chart ref="lineChart" :option="option" class="h-80" :autoresize="true" />
</template>

