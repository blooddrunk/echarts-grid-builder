# 开发计划

POC 原型 [http://jelinenaro.gitee.io/echarts-grid-builder](http://jelinenaro.gitee.io/echarts-grid-builder)

图表配置可参考

- [图说](https://tushuo.baidu.com/)
- [ChartCube](https://chartcube.alipay.com/)

## 主要功能

- 背景/画布设置 ⭐⭐⭐
- 全局图表主题配置 ⭐
- 图表基本类型

  - 折线图 ⭐⭐⭐
  - 柱状图/条形图 ⭐⭐⭐
  - 饼图 ⭐⭐⭐
  - 地图 ⭐⭐⭐
  - 散点图 ⭐
  - 仪表盘 ⭐
  - 复合，如双 Y 轴，折线图+柱状图，地图+散点图 ⭐⭐

- 图表配置

  - 数据配置 ⭐⭐⭐
  - 基本配置（通用配置）⭐⭐⭐
  - 进阶配置（根据图表类型而异）⭐⭐

- 配置/数据持久化 ⭐

> ⭐:优先级

## 功能说明

主要库包括`Vue@2`, `Nuxt`, `element-ui`, `echarts`(`vue-echarts`) 等

### 背景/画布设置（已有基本实现）

基于[`vue-grid-layout`](https://github.com/jbaysolutions/vue-grid-layout)，可以设置画布高度、列数、行高、间距等，可以拖拽其中的图表

### 全局图表主题配置（未实现）

根据实际需求可以参考[`echarts`官方主题工具](https://echarts.apache.org/zh/theme-builder.html)，或者只提供几种预设

### 图表数据配置

每一个位于画布中的图表都有一组属于自己的数据

- 为不同类型的图表提供一组初始的样例数据（用于创建图表时展示）
- 图表数据集应使用`echarts`的[`dataset`](https://echarts.apache.org/zh/tutorial.html#%E4%BD%BF%E7%94%A8%20dataset%20%E7%AE%A1%E7%90%86%E6%95%B0%E6%8D%AE)格式
- 支持 excel 导入（[`sheetjs`](https://github.com/SheetJS/sheetjs)）和在线编辑([`handsontable`](https://handsontable.com/docs/8.2.0/tutorial-introduction.html))，excel 的数据格式应遵循`dataset`的要求

> 根据实际需要，可以后续支持从服务端请求数据、更复杂的在线编辑(如[`x-spreadsheet`](https://myliang.github.io/x-spreadsheet/)、[`Luckysheet`](https://mengshukeji.github.io/LuckysheetDocs/))、数据格式校验等。

### 图表基本配置

一些所有图表通用的常见配置，如`title`, `legend`, `label`, `x(y)Axis`等。

> 很多属性可以通过全局主题来配置的属性，如颜色，字体大小，边框等，可以不再单独配置，或者后续再开发
> 可以考虑支持一些字符串类型的`formatter`属性(e.g .`formatter: '{value} kg'`)

### 具体图表

按复杂分为以下两种情况

- 只有一种`series`的平面二维图表，如折线图/柱状图/饼图/散点图，各提供几种常见配置

  > 可以考虑支持一些字符串类型的`formatter`属性(e.g .`formatter: '{d} %'`)

- 地图，除了常见地图配置外，提供全国和各省地图的选择

> **复杂图表的处理**，默认情况下每个图表只有一种`series`，但是对于如折线+柱状的情况，需考虑在特定类型的图表配置中加入另外一种类型图表的配置。如折线图/柱状图可以引入柱状图/折线图，地图可以引入散点图（此时情况更为复杂，可能需要配置`coordinateSystem`）。根据实际需要，固定集中常见组合即可。

### 数据持久化

- 所有可配置的数据都应通过`vuex`持久化为`JSON`，可以简单保存于`localStorage`，或者使用`localForage `，`pouchdb`等其他客户端存储。

  > ??? 将数据保存在服务端

- 整个画布可保存为 pdf/图片

## 开发分工

按功能耦合和工作量，简单分为以下几组

- 画布/主题
- 数据处理，导入/导出
- 图表基本配置，实际上通用的基本配置不多，但应为高级配置提供可复用的逻辑基础
- 有坐标轴的图表（折线/条形/散点）
- 无坐标轴的图表（饼图/仪表盘)
- 地图
- 复合，如双 Y 轴，折线图+柱状图，地图+散点图，**单一种类 series 的图表开发时须为这些情况考虑**

## WIP 其他可以增加/改进的功能

- 升级到`echarts@5`
- 支持保存默认配置（分为基本配置、每种图表专有配置）
- 支持预览图表配置`JSON`
