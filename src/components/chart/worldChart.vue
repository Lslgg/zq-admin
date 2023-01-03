
<script  lang='ts'>
import VChart, { THEME_KEY } from 'vue-echarts'
import { use, registerMap } from 'echarts/core'
import {
  TitleComponent, ToolboxComponent, TooltipComponent,
  VisualMapComponent, GeoComponent
} from 'echarts/components'
import { MapChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { ref, defineComponent, PropType, } from 'vue'
import sourceData from './world.json'
import { IGrid } from '@/api/api.model'
use([
  TitleComponent, ToolboxComponent, TooltipComponent,
  VisualMapComponent, GeoComponent, MapChart, CanvasRenderer
])
const data: any = sourceData
registerMap('world', data)
interface IData {
  name_en: string,
  name_zh: string,
  value: number
}
export default defineComponent({
  components: { VChart, },
  props: {
    listData: {
      type: Array as PropType<IData[]>,
      default: () => [{ name: 'China', value: 1233 }]
    },
    grid: {
      type: Object as PropType<IGrid>,
      default: () => ({ top: 12, left: 52, right: 12, bottom: 30 }),
    },
  },
  provide: { [THEME_KEY]: 'white', },
  setup: (props) => {
    const nameMap: { [index: string]: string } = {}
    const legendData: string[] = []
    const seriesList = props.listData.map((p, index) => {
      const name = p.name_zh || p.name_en
      nameMap[p.name_en] = name
      const searialName = `${p.name_zh}，${p.value}`
      if (index < 10 && p.value > 0) legendData.push(searialName)
      return {
        name: searialName,
        type: 'map',
        mapType: 'world',
        roam: true,
        zoom: 1,
        emphasis: { label: { show: true } },
        data: [{ name: name, value: p.value || null }],
        nameMap,
      }
    })
    const option = ref({
      tooltip: {
        trigger: 'item',
        formatter: (params: any, other: any) => {
          const value = params.value || 0
          const name_zh = params.name
          const str = `${name_zh}:${value}`
          return str
        }
      },
      legend: {
        show: true,
        orient: 'vertical',
        right: 0,
        data: legendData
      },
      visualMap: {
        min: 1,
        max: 100000,
        text: ['高', '低'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['lightskyblue', 'yellow', 'orangered']
        }
      },
      series: seriesList,
      grid: props.grid,
    })
    return { option }
  },
})
</script>

<template>
  <v-chart :option="option" :autoresize="true" />
</template>
