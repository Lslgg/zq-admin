import { ref } from 'vue'

interface IAdavatageMenu {
  title: string
  value: string
}

/**
 * UseAdvantage
 * @return {any}
 */
export function UseAdvantage() {
  const tabList: IAdavatageMenu[] = [
    { title: '公司优势', value: 'advantage' },
    { title: '资质荣誉', value: 'honor' },
    { title: '公司FAQ', value: 'faq' },
  ]
  const activeTab = ref('advantage')
  return {
    tabList,
    activeTab
  }
}
