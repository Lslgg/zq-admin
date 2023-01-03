<template>
  <v-chart :option="option" :autoresize="true" />
</template>

<script lang="ts">
import { use } from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, defineComponent, PropType } from 'vue'

use([GridComponent, PieChart, CanvasRenderer, UniversalTransition])
interface IPieData {
  name: string,
  value: number
}
export default defineComponent({
  components: { VChart },
  provide: { [THEME_KEY]: 'white' },
  props: {
    name: {
      type: String,
      default: '询盘',
    },
    listData: {
      type: Array as PropType<IPieData[]>,
      default: () => []
    },
    legend: {
      type: Object as PropType<any>,
      default: () => { }
    },
    height: { type: String, default: '75%' },
    radius: { type: String, default: '80%' }
  },
  setup: (props) => {
    const option = ref({
      tooltip: { trigger: 'item' },
      series: [
        {
          name: props.name,
          type: 'pie',
          radius: props.radius,
          width: '100%',
          height: props.height,
          data: props.listData,
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
          },
          label: {
            alignTo: 'edge',
            formatter: '{name|{b}}\n{value|{d}}%,\n{c}',
            minMargin: 1,
            edgeDistance: 12,
            lineHeight: 15,
            rich: { time: { fontSize: 8, color: '#999' } }
          },
          labelLine: { length: 15, length2: 15, maxSurfaceAngle: 180 }
        }
      ],
      legend: props.legend,
    })

    return { option }
  },
})
</script>
