<template>
  <div class="picture">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="total">
        可预约总量
        <span>99999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- 盒子： echarts 展示图形图表的节点-->
    <div class="ball" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//水球图拓展插件
import 'echarts-liquidfill'
const people = ref('216908人')
//获取DOM节点元素
const charts = ref()
onMounted(() => {
  //获取echarts类的实例
  const mycharts = echarts.init(charts.value)
  //设置实例的配置项
  mycharts.setOption({
    title: {
      text: '水球图',
      top: 1,
      textStyle: {
        color: 'Orange',
      },
    },
    //x|y轴组件
    xAxis: {},
    yAxis: {},
    series: {
      type: 'liquidFill',
      data: [0.6, 0.5, 0.4, 0.3],
      radius: '70%',
      color: ['#29fcff', '#1de8e8', '#0cc'],
      backgroundStyle: {
        color: '#0a1a3a',
      },
      outline: {
        borderDistance: 4,
        itemStyle: {
          borderColor: '#29fcff',
          borderWidth: 2,
        },
      },
    },
    //布局组件
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
})
</script>

<style scoped lang="scss">
.picture {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .top {
    .title {
      color: white;
      font-size: 25px;
      margin-top: 20px;
    }
    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
    .total {
      float: right;
      color: white;
      font-size: 20px;
      span {
        color: pink;
        font-style: italic;
      }
    }
  }
  .number {
    background-size: 100% 100%;
    margin-top: 30px;
    padding: 10px;
    gap: 6px;
    display: flex;
    span {
      flex: 1;
      height: 60px;
      background: url(../../images/total.png) no-repeat;
      border: 1px solid #29fcff;
      box-shadow: 0 0 8px #29fcff;
      text-align: center;
      line-height: 60px;
      color: #29fcff;
      font-size: 35px;
      font-weight: bold;
      border-radius: 4px;
    }
  }
  .ball {
    width: 100%;
    height: 250px;
  }
}
</style>
