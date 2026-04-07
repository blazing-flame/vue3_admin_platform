<template>
  <div>
    <el-card>
      <el-table border style="margin: 10px 0" :data="skuArr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="名称"
          width="170px"
          prop="skuName"
        ></el-table-column>
        <el-table-column
          label="描述"
          width="170px"
          prop="skuDesc"
        ></el-table-column>
        <el-table-column label="图片" width="170px">
          <template #="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column
          label="重量(g)"
          width="170px"
          prop="weight"
        ></el-table-column>
        <el-table-column
          label="价格(元)"
          width="170px"
          prop="price"
        ></el-table-column>
        <el-table-column label="操作" width="300px" fixed="right">
          <template #="{ row, $index }">
            <el-button
              :type="row.isSale == 1 ? 'info' : 'success'"
              size="small"
              :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
              style="width: 40px"
              @click="updateSale(row)"
            ></el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateSku"
              style="width: 40px"
            ></el-button>
            <el-button
              type="info"
              size="small"
              icon="infoFilled"
              style="width: 40px"
              @click="findSku(row)"
            ></el-button>
            <el-popconfirm
              :title="`你确定要删除${row.skuName}吗?`"
              width="250px"
              @confirm="removeSku(row.id)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  icon="Delete"
                  style="width: 40px"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[2, 4, 6, 8]"
        :background="true"
        layout="prev, pager, next, jumper, ->,sizes,total"
        :total="total"
        @current-change="getHasSku"
        @size-change="handler"
      />
      <!-- 抽屉组件，展示商品详情 -->
      <el-drawer v-model="drawer" size="460px" :with-header="false">
        <div class="sku-drawer">
          <!-- 深色 Hero Header -->
          <div class="drawer-header">
            <div class="header-bg-pattern"></div>
            <div class="header-content">
              <div class="header-text">
                <div class="header-eyebrow">SKU DETAIL</div>
                <div class="header-title">查看商品详情</div>
              </div>
              <el-button
                :icon="Close"
                circle
                @click="drawer = false"
                class="close-btn"
              />
            </div>
            <div class="product-name-bar">
              <div class="product-name-pill">
                <div class="product-icon">📱</div>
                <div class="product-name-text">{{ skuInfo.skuName }}</div>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="drawer-body">
            <div class="info-section">
              <div class="info-row">
                <div class="info-label">描述</div>
                <div class="info-value">{{ skuInfo.skuDesc }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">价格</div>
                <div class="info-value price-value">{{ skuInfo.price }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">平台属性</div>
                <div class="info-value">
                  <div class="tags-wrap">
                    <span
                      v-for="(item, index) in skuInfo.skuAttrValueList"
                      :key="item.id"
                      :class="['tag', tagColors[index % 4]]"
                    >
                      {{ item.valueName }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="info-row">
                <div class="info-label">销售属性</div>
                <div class="info-value">
                  <div class="tags-wrap">
                    <span
                      v-for="(item, index) in skuInfo.skuSaleAttrValueList"
                      :key="item.id"
                      :class="['tag', tagColors[index % 4]]"
                    >
                      {{ item.saleAttrValueName }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="section-title">商品图片</div>
            <el-carousel
              :interval="3000"
              type="card"
              height="180px"
              indicator-position="none"
              class="sku-carousel"
            >
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img :src="item.imgUrl" class="carousel-img" />
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </el-drawer>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  reqRemoveSku,
  reqSkuList,
  reqOnSaleSku,
  reqCancelSaleSku,
  reqSkuInfo,
} from '@/api/product/sku'
import { ref, onMounted } from 'vue'
import type {
  SkuResponseData,
  SkuData,
  SkuInfoData,
} from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
const tagColors = ['tag-blue', 'tag-green', 'tag-orange', 'tag-red']
//分页器当前页码
const pageNo = ref<number>(1)
//每一页展示几条数据
const limit = ref<number>(4)
//总的SKU数据个数
const total = ref<number>(0)
//存储SKU数据
const skuArr = ref<SkuData[]>([])
//控制抽屉显示与隐藏
const drawer = ref<boolean>(false)
//存储详情数据
const skuInfo = ref<SkuData>({})
//当组件挂载完毕
onMounted(() => {
  getHasSku()
})
//获取已有SKU数据
const getHasSku = async (pager = 1) => {
  //当前分页器页码
  pageNo.value = pager
  const result: SkuResponseData = await reqSkuList(pageNo.value, limit.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
//分页器下拉菜单发生变化时触发
const handler = (pageSize: number) => {
  getHasSku()
}

//商品上架与下架的操作
const updateSale = async (row: SkuData) => {
  /*为什么上下架不判断是否成功
        因为如果请求失败，axios 拦截器会直接抛出错误，await 后面的代码根本不会执行，所以不需要判断。失败的情况交给拦截器统一处理了。
        getHasSku 那里判断 result.code == 200 是因为需要拿返回的数据，所以要确认成功才赋值。上下架只需要操作成功后刷新列表，不需要拿数据，所以不用判断。
    */
  //如果当前商品isSale==1,说明当前商品是上架状态，更新为下架，否则相反
  if (row.isSale == 1) {
    //下架操作
    await reqCancelSaleSku(row.id as number)
    //提示信息
    ElMessage({ type: 'success', message: '下架成功' })
    //发请求获取当前更新完毕的全部已有SKU
    getHasSku(pageNo.value)
  } else {
    //上架操作
    await reqOnSaleSku(row.id as number)
    //提示信息
    ElMessage({ type: 'success', message: '上架成功' })
    //发请求获取当前更新完毕的全部已有SKU
    getHasSku(pageNo.value)
  }
}

//更新已有SKU的方法
const updateSku = () => {
  ElMessage({ type: 'success', message: '程序员在努力研发中...' })
}
//查看商品详情按钮的回调
const findSku = async (row: SkuData) => {
  drawer.value = true
  //获取已有商品详情数据
  const result: SkuInfoData = await reqSkuInfo(row.id as number)
  //存储已有SKU
  skuInfo.value = result.data
}
//删除已有SKU商品
const removeSku = async (id: number) => {
  const result: any = await reqRemoveSku(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除SKU成功',
    })
    //再次获取所有SKU商品
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除SKU失败',
    })
  }
}
</script>

<style scoped>
.sku-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer-header {
  position: relative;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
  overflow: hidden;
  flex-shrink: 0;
}

.header-bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(
      circle at 20% 50%,
      rgba(99, 102, 241, 0.25) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(59, 130, 246, 0.2) 0%,
      transparent 40%
    );
}

.header-content {
  position: relative;
  padding: 28px 28px 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.header-eyebrow {
  font-size: 10px;
  font-weight: 500;
  color: rgba(99, 102, 241, 0.9);
  letter-spacing: 0.15em;
  margin-bottom: 6px;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}

:deep(.close-btn) {
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  background: rgba(255, 255, 255, 0.08) !important;
  color: rgba(255, 255, 255, 0.7) !important;
  &:hover {
    background: rgba(255, 255, 255, 0.18) !important;
    color: #fff !important;
  }
}

.product-name-bar {
  position: relative;
  padding: 0 28px 24px;
}

.product-name-pill {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
}

.product-name-text {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
}

.info-section {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  padding: 14px 0;
  border-bottom: 1px solid #f1f5f9;
  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  width: 72px;
  flex-shrink: 0;
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  padding-top: 2px;
}

.info-value {
  flex: 1;
  font-size: 14px;
  color: #1e293b;
  line-height: 1.6;
}

.price-value {
  font-size: 22px;
  font-weight: 700;
  color: #ef4444;
  &::before {
    content: '¥ ';
    font-size: 14px;
    font-weight: 500;
  }
}

.tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid transparent;
}
.tag-blue {
  background: #eff6ff;
  color: #3b82f6;
  border-color: #bfdbfe;
}
.tag-green {
  background: #f0fdf4;
  color: #22c55e;
  border-color: #bbf7d0;
}
.tag-orange {
  background: #fff7ed;
  color: #f97316;
  border-color: #fed7aa;
}
.tag-red {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fecaca;
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #f1f5f9;
  }
}

.sku-carousel {
  margin-bottom: 20px;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

:deep(.el-carousel__item) {
  border-radius: 10px;
  overflow: hidden;
}
</style>
