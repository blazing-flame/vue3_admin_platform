<template>
  <div class="line">
    <div class="title">
      <p>未来30天游客量趋势图</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="charts" ref="lines"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取div的DOM元素
let lines = ref()
onMounted(() => {
  let mycharts = echarts.init(lines.value)
  //设置配置项
  mycharts.setOption({
    //x|y轴
    xAxis: {
      type: 'category',
      data: [
        '05/05',
        '05/07',
        '05/09',
        '05/11',
        '05/13',
        '05/15',
        '05/17',
        '05/19',
        '05/21',
        '05/23',
        '05/25',
        '05/27',
        '05/29',
        '05/31',
        '06/02',
      ],
      axisLine: {
        lineStyle: {
          color: '#4af3ff',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#a8d8f0',
        fontSize: 14,
      },
    },
    yAxis: {
      type: 'value',
      name: '(访问量)',
      nameTextStyle: {
        color: '#a8d8f0',
        fontSize: 14,
        padding: [0, 40, 0, 0],
      },
      axisTick: {
        show: true,
      },
      axisLabel: {
        color: '#a8d8f0',
        fontSize: 14,
        formatter: (val: number) => {
          if (val >= 10000) return val / 10000 + 'w'
          return val
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(74,243,255,0.1)',
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#4af3ff',
        },
      },
    },
    grid: {
      left: 60,
      top: 50,
      right: 10,
      bottom: 30,
    },
    series: [
      {
        type: 'line',
        smooth: true, // 平滑曲线
        symbol: 'none', // 不显示数据点
        data: [
          3000, 8000, 15000, 12000, 9000, 7000, 10000, 8000, 9000, 11000, 18000,
          10000, 6000, 15000, 18000,
        ],
        lineStyle: {
          color: '#d4a020',
          width: 2,
        },
        // 渐变填充
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(212,160,32,0.8)',
              }, // 顶部金黄色
              {
                offset: 1,
                color: 'rgba(212,160,32,0.05)',
              }, // 底部透明
            ],
          },
        },
      },
    ],
  })
})
</script>
<style scoped lang="scss">
.line {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin-bottom: 20px;
  .title {
    p {
      color: white;
      font-size: 25px;
    }
    img {
      margin-top: 10px;
    }
  }
  .charts {
    height: calc(100% - 45px);
  }
}
</style>
