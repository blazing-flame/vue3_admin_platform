<template>
  <div class="gender">
    <div class="title">
      <p>男女比例</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="sex">
      <div class="man">
        <span>男士</span>
        <img src="../../images/man.png" alt="" />
      </div>
      <div class="woman">
        <span>女士</span>
        <img src="../../images/woman.png" alt="" />
      </div>
    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女士42%</p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取div的DOM元素节点
const charts = ref()
//组件挂载完毕
onMounted(() => {
  //获取echarts类的实例
  const mycharts = echarts.init(charts.value)
  //设置配置项
  mycharts.setOption({
    //组件标题
    title: {
      textStyle: {
        color: 'orange',
      },
    },
    xAxis: {
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: {
      show: false,
      type: 'category',
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: 100,
        itemStyle: {
          borderRadius: 20,
        },
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        barGap: '-100%',
        itemStyle: {
          color: 'pink',
          borderRadius: 20,
        },
      },
    ],
    grid: {
      left: 20, // 改这里，左右留出间距
      right: 20, // 改这里
      top: 40, // 给title留空间
      bottom: 10,
    },
  })
})
</script>

<style scoped lang="scss">
.gender {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;
  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 25px;
    }
    img {
      margin-top: 10px;
    }
  }
  .sex {
    display: flex;
    justify-content: center;
    .man {
      margin: 20px;
      width: 111px;
      height: 115px;
      flex-direction: column;
      background: url(../../images/man-bg.png);
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        color: white;
        font-size: 16px;
        margin-bottom: 25px; // 文字和图片间距
      }
    }
    .woman {
      margin: 20px;
      width: 111px;
      height: 115px;
      flex-direction: column;
      background: url(../../images/woman-bg.png);
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        color: white;
        font-size: 16px;
        margin-bottom: 25px; // 文字和图片间距
      }
    }
  }
  .rate {
    display: flex;
    color: white;
    justify-content: space-between;
    padding: 0 20px;
  }
  .charts {
    height: 100px;
    margin-top: -30px;
  }
}
</style>
