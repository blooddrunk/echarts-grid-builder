<template>
  <el-alert type="warning" show-icon :closable="false">
    该图表类型没有可供使用的进阶配置

    <template #title>提示</template>
  </el-alert>
</template>

<script>
export default {
  name: 'ChartEditFallback',
};
</script>
