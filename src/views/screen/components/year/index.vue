<template>
  <div class="year">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount } from 'vue'

let charts = ref()
let mycharts: echarts.ECharts | null = null

onMounted(() => {
  mycharts = echarts.init(charts.value)

  mycharts.setOption({
    color: ['#e69a38', '#186ade', '#d65d7a'],
    // 提示框组件
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
    },
    // 图例组件
    legend: {
      data: ['2021年', '2022年', '2023年'],
      top: 10,
      right: 20,
      icon: 'rect', // 图例为矩形
      itemWidth: 16,
      itemHeight: 4,
      textStyle: {
        color: '#ffffff', // 图例文字颜色
        fontSize: 12,
      },
    },
    // 直角坐标系内绘图网格
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20%', // 为顶部图例和Y轴名称留出空间
      containLabel: true,
    },
    // X轴
    xAxis: {
      type: 'category',
      boundaryGap: false, // 坐标轴两边留白策略，设为 false 使图形从Y轴开始
      data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      axisLine: {
        show: true, // 隐藏X轴线，贴合原图暗色风格
      },
      axisTick: {
        show: false, // 隐藏刻度
      },
      axisLabel: {
        color: '#c2c2c2', // 坐标轴刻度标签文字颜色
        margin: 15,
      },
    },
    // Y轴
    yAxis: {
      type: 'value',
      name: '(人数)', // Y轴顶部名称
      nameTextStyle: {
        color: '#c2c2c2',
        align: 'right', // 文字右对齐
        padding: [0, 10, 0, 0],
      },
      axisLine: {
        show: true, // 隐藏X轴线，贴合原图暗色风格
      },
      splitLine: {
        show: false, // 隐藏Y轴的网格分割线
      },
      axisLabel: {
        color: '#c2c2c2',
      },
    },
    // 系列列表
    series: [
      {
        name: '2021年',
        type: 'line',
        smooth: true, // 平滑曲线
        symbol: 'none', // 不显示折线上的数据圆点
        lineStyle: {
          width: 1.5,
          color: '#e69a38', // 橙色折线
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(230, 154, 56, 0.8)' }, // 渐变起始色
            { offset: 1, color: 'rgba(230, 154, 56, 0.0)' }, // 渐变结束色 (透明)
          ]),
        },
        // 近似原图的数据
        data: [150, 90, 110, 0, 40, 100, 80, 50, 30, 500, 350, 180],
      },
      {
        name: '2022年',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 1.5,
          color: '#186ade', // 蓝色折线
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 106, 222, 0.8)' },
            { offset: 1, color: 'rgba(24, 106, 222, 0.0)' },
          ]),
        },
        // 近似原图的数据
        data: [120, 500, 300, 150, 360, 120, 310, 160, 280, 460, 150, 10],
      },
      {
        name: '2023年',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 1.5,
          color: '#d65d7a', // 粉色折线
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(214, 93, 122, 0.8)' },
            { offset: 1, color: 'rgba(214, 93, 122, 0.0)' },
          ]),
        },
        // 近似原图的数据
        data: [540, 260, 110, 90, 80, 500, 20, 40, 20, 400, 320, 170],
      },
    ],
  })

  // 监听窗口大小变化，实现图表自适应响应
  window.addEventListener('resize', resizeChart)
})

// 抽离 resize 函数以便销毁时移除监听
const resizeChart = () => {
  mycharts?.resize()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  mycharts?.dispose()
})
</script>

<style scoped lang="scss">
.year {
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
      font-size: 25px;
    }
    img {
      margin-top: 10px;
    }
  }
  .charts {
    /* 调整高度，防止图表溢出或被遮挡 */
    height: calc(100% - 50px);
    width: 100%;
  }
}
</style>
