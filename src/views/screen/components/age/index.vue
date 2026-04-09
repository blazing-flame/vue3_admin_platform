<template>
  <div class="age">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <!-- 图形图表的容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取div的DOM元素节点
let charts = ref()
onMounted(() => {
  //获取echarts类的实例
  let mycharts = echarts.init(charts.value)
  //设置配置项
  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: 50,
      right: 30,
      orient: 'vertical',
      textStyle: {
        color: 'white',
        fontSize: 18,
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '80%'],
        center: ['40%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{d}%',
          color: 'blue', // 字体颜色
          fontSize: 12,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '10岁以下' },
          { value: 735, name: '10-18岁' },
          { value: 580, name: '18-30岁' },
          { value: 484, name: '30-40岁' },
          { value: 300, name: '40-60岁' },
          { value: 200, name: '60岁以上' },
        ],
      },
    ],
    //调整
  }
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
.age {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin-bottom: 70px;
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
    height: 100%;
  }
}
</style>
