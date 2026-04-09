<template>
  <div class="counter">
    <div class="title">
      <p>预约渠道数据统计</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

let charts = ref()

onMounted(() => {
  let mycharts = echarts.init(charts.value)

  const data = [
    { value: 40, name: '智慧文旅平台' },
    { value: 10, name: '携程' },
    { value: 20, name: '飞猪' },
    { value: 30, name: '其他渠道' },
  ]

  const colors = ['#0092ff', '#ff9f3d', '#f479d4', '#ff5b5b']

  mycharts.setOption({
    color: colors,
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: '5%',
      top: 'center',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      textStyle: {
        color: '#fff',
        fontSize: 14,
        // 使用富文本定制图例样式
        rich: {
          name: { width: 80 },
          value: { color: '#fff', fontWeight: 'bold' },
          line: { color: '#455a74', padding: [0, 5] },
        },
      },
      // 格式化图例： 名字 --- 百分比
      formatter: (name: string) => {
        const target = data.find((item) => item.name === name)
        return `{name|${name}}{line|---}{value|${target?.value}%}`
      },
    },
    series: [
      // 1. 最外层的环形图
      {
        type: 'pie',
        radius: ['55%', '75%'],
        center: ['70%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 0,
          borderColor: '#061740', // 增加一点间隙感
          borderWidth: 2,
        },
        label: { show: false },
        data: data,
      },
      // 2. 中间点状装饰环
      {
        type: 'gauge',
        radius: '45%',
        center: ['70%', '50%'],
        startAngle: 0,
        endAngle: 360,
        splitLine: { show: false },
        axisTick: {
          show: true,
          splitNumber: 2,
          lineStyle: {
            color: '#4176a3',
            width: 2,
          },
          length: 3,
        },
        axisLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        detail: { show: false },
      },
      // 3. 最内层的动态图标环（模拟中间的饼图Logo）
      {
        type: 'pie',
        radius: ['0%', '35%'],
        center: ['70%', '50%'],
        silent: true, // 不响应鼠标事件
        itemStyle: {
          color: 'transparent',
          borderColor: '#fff',
          borderWidth: 3,
        },
        label: { show: false },
        data: [
          { value: 75, itemStyle: { borderColor: '#fff' } },
          { value: 25, itemStyle: { borderColor: 'transparent' } },
        ],
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.counter {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;
  .title {
    margin-left: 5px;
    margin-top: 10px;
    p {
      color: white;
      font-size: 20px; // 适当缩小
    }
  }
  .charts {
    /* 核心：确保高度足够容器显示 */
    height: calc(100% - 60px);
    width: 100%;
  }
}
</style>
