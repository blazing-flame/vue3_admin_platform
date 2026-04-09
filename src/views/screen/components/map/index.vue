<template>
  <div class="earth" ref="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//引入中国地图的JSON数据
import chinaJson from './china.json'
//获取div的DOM元素
let map = ref()
//注册中国地图
echarts.registerMap('china', chinaJson as any)
//组件挂载完毕
onMounted(() => {
  //获取组件实例
  let mycharts = echarts.init(map.value)
  //设置配置项
  mycharts.setOption({
    //地图组件
    geo: {
      map: 'china', //中国地图
      roam: true, //鼠标扩大缩放效果
      // 地图放大：调整中心点和缩放
      layoutCenter: ['50%', '53%'],
      layoutSize: '95%', // 数值越大地图越大
      //地图文字设置
      label: {
        show: true,
        color: '#a8d8f0',
        fontSize: 14,
      },
      //每一个多边形样式
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#0d2a6e' }, // 顶部：深海蓝
            { offset: 1, color: '#091a4a' }, // 底部：更深的蓝
          ],
          global: false, // 缺省为 false
        },
        borderColor: '#4af3ff', // 亮青色描边，制造发光感
        borderWidth: 1,
        opacity: 0.8,
        // 阴影模拟发光效果
        shadowColor: '#4af3ff',
        shadowBlur: 8,
      },
      //地图高亮效果
      emphasis: {
        itemStyle: {
          color: '#1a5fad', // 高亮时亮蓝色
          borderColor: '#ffffff',
          borderWidth: 1.5,
          shadowColor: '#7fdbff',
          shadowBlur: 20,
        },
        label: {
          fontSize: 40,
          color: 'white',
        },
      },
    },
    //
    series: [
      {
        type: 'lines', //航线
        data: [
          {
            coords: [
              [116.405285, 39.904989], //北京
              [115.892151, 28.676493], //江西
            ],
            //统一样式设置
            lineStyle: {
              color: '#4af3ff',
              width: 2,
              opacity: 0.8,
              curveness: 0.3,
            },
          },
          {
            coords: [
              [115.892151, 28.676493], //江西
              [116.405285, 39.904989], //北京
            ],
            //统一样式设置
            lineStyle: {
              color: '#4af3ff',
              width: 2,
              opacity: 0.8,
              curveness: 0.3,
            },
          },
          {
            coords: [
              [113.665412, 34.757975], //河南
              [111.670801, 40.818311], //内蒙古
            ],
            //统一样式设置
            lineStyle: {
              color: '#4af3ff',
              width: 2,
              opacity: 0.8,
              curveness: 0.3,
            },
          },
          {
            coords: [
              [111.670801, 40.818311], //河南
              [113.665412, 34.757975], //内蒙古
            ],
            //统一样式设置
            lineStyle: {
              color: '#4af3ff',
              width: 2,
              opacity: 0.8,
              curveness: 0.3,
            },
          },
          {
            coords: [
              [104.065735, 30.659462], //四川
              [87.617733, 43.792818], //新疆
            ],
            //统一样式设置
            lineStyle: {
              color: '#4af3ff',
              width: 2,
              opacity: 0.8,
              curveness: 0.3,
            },
          },
          {
            coords: [
              [87.617733, 43.792818], //新疆
              [104.065735, 30.659462], //四川
            ],
            //统一样式设置
            lineStyle: {
              color: '#4af3ff',
              width: 2,
              opacity: 0.8,
              curveness: 0.3,
            },
          },
          {
            coords: [
              [112.982279, 28.19409], //湖南
              [113.280637, 23.125178], //广东
            ],
            //统一样式设置
            lineStyle: {
              color: '#4af3ff',
              width: 2,
              opacity: 0.8,
              curveness: 0.3,
            },
          },
          {
            coords: [
              [113.280637, 23.125178], //广东
              [112.982279, 28.19409], //湖南
            ],
            //统一样式设置
            lineStyle: {
              color: '#4af3ff',
              width: 2,
              opacity: 0.8,
              curveness: 0.3,
            },
          },
          {
            coords: [
              [116.405285, 39.904989], //北京
              [126.642464, 45.756967], //黑龙江
            ],
            //统一样式设置
            lineStyle: {
              color: '#4af3ff',
              width: 2,
              opacity: 0.8,
              curveness: 0.3,
            },
          },
          {
            coords: [
              [126.642464, 45.756967], //黑龙江
              [116.405285, 39.904989], //湖北京
            ],
            //统一样式设置
            lineStyle: {
              color: '#4af3ff',
              width: 2,
              opacity: 0.8,
              curveness: 0.3,
            },
          },
        ],
        //是否显示特效
        effect: {
          show: true,
          color: '#4af3ff',
          symbol:
            'path://M77.34 659.8a18.8 18.8 0 0 1-18.78-18.78v-75.06c0-7.07 3.99-13.54 10.28-16.74L425.4 368.37c9.24-4.69 20.53-1 25.22 8.24 4.69 9.24 0.99 20.53-8.24 25.22l-7.82 145.75c10.14-2.1 20.08 4.41 22.2 14.56 2.1 10.14-4.41 20.08-14.56 22.2L81.15 659.4c-1.26 0.26-2.55 0.4-3.81 0.4zM940.56 659.8c-1.26 0-2.54-0.14-3.82-0.4L575.7 584.34c-10.14-2.12-16.66-12.05-14.56-22.2 2.12-10.14 12.05-16.66 22.2-14.56l-7.82-145.75c-9.24-4.69-12.93-15.98-8.24-25.22 4.69-9.25 15.98-12.93 25.24-8.24l356.55 180.85c6.31 3.2 10.28 9.67 10.28 16.74v75.06c0 5.65-2.54 10.99-6.93 14.56a18.844 18.844 0 0 1-11.86 4.22z',
          symbolSize: 10,
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss"></style>
