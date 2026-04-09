<template>
  <div class="rank">
    <div class="title">
      <p>热门景区排行</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="kuang">
      <div class="header">
        <span>排名</span>
        <span>景区</span>
        <span>预约数量</span>
      </div>
    </div>
    <div class="bottom" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

let charts = ref()

const rankData = [
  { name: '峨州山', value: 80, count: '8.00w', color: 'red' },
  { name: '稀城业丁', value: 60, count: '6.00w', color: 'orange' },
  { name: '九亚沟', value: 50, count: '5.00w', color: 'blue' },
  { name: '万里长城', value: 40, count: '4.00w', color: 'green' },
  { name: '北京故宫', value: 30, count: '3.00w', color: 'pink' },
]

onMounted(() => {
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    backgroundColor: 'transparent',
    grid: {
      left: 80, // 留给 NO.x + 景区名
      right: 70, // 留给右侧数量
      top: 0,
      bottom: 10,
      containLabel: true,
    },
    xAxis: { show: false, max: 100 },
    yAxis: [
      // 左侧第一列：NO.x 排名
      {
        type: 'category',
        inverse: true,
        position: 'left',
        offset: 100, // 往左偏移，对齐表头"排名"
        data: rankData.map((_, i) => `NO.${i + 1}`),
        axisLabel: {
          color: '#ff9a3c',
          fontSize: 14,
          fontWeight: 'bold',
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      // 左侧第二列：景区名
      {
        type: 'category',
        inverse: true,
        position: 'left',
        offset: 5, // 紧贴 bar 左侧，对齐表头"景区"
        data: rankData.map((item) => item.name),
        axisLabel: {
          color: 'white',
          fontSize: 14,
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
    ],
    series: [
      // 背景轨道（深色底槽）
      {
        type: 'bar',
        barWidth: 14,
        barGap: '-100%',
        z: 1,
        data: rankData.map(() => ({
          value: 100,
          itemStyle: {
            color: 'rgba(255,255,255,0.1)',
            borderRadius: 7,
            // 加发光边框
            borderColor: 'rgba(74, 243, 255, 0.6)',
            borderWidth: 1,
            shadowColor: 'rgba(74, 243, 255, 0.8)', // 👈 发光颜色
            shadowBlur: 8, // 👈 发光范围
          },
        })),
        silent: true,
        label: { show: false },
      },
      // 彩色进度条
      {
        type: 'bar',
        barWidth: 14,
        barGap: '-100%',
        z: 2,
        data: rankData.map((item) => ({
          value: item.value,
          itemStyle: {
            color: item.color,
            borderRadius: 7,
            shadowColor: item.color, // 👈 用自身颜色发光
            shadowBlur: 6,
          },
        })),
        label: {
          show: true,
          position: 'insideLeft',
          formatter: (p: any) => p.value + '%',
          color: 'white',
          fontSize: 12,
        },
      },
      // 右侧数量文字
      {
        type: 'bar',
        barWidth: 14,
        barGap: '-100%',
        z: 1,
        data: rankData.map(() => ({
          value: 100,
          itemStyle: { color: 'transparent' },
        })),
        label: {
          show: true,
          position: 'right',
          formatter: (p: any) => rankData[p.dataIndex].count,
          color: 'white',
          fontSize: 13,
        },
        silent: true,
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.rank {
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
  .kuang {
    height: 40px;
    margin: 30px 5px 10px 5px;
    background: url(../../images//rankingChart-bg.png);
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 20px;
      color: #4af3ff;
      font-size: 16px;
      span {
        flex: 1;
        margin-left: 10px;
      }

      span:nth-child(1) {
        flex: 0.5;
      }

      span:nth-child(3) {
        flex: 0.5;
        padding-right: 50px;
      }
    }
  }
  .bottom {
    height: 240px;
  }
}
</style>
