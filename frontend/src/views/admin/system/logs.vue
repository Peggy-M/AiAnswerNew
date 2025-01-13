<template>
  <div class="log-manage">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="操作人">
          <el-input v-model="searchForm.username" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="searchForm.type" placeholder="请选择操作类型" clearable>
            <el-option label="登录" value="LOGIN" />
            <el-option label="新增" value="CREATE" />
            <el-option label="修改" value="UPDATE" />
            <el-option label="删除" value="DELETE" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 日志列表 -->
    <el-table :data="logList" v-loading="loading" style="width: 100%">
      <el-table-column prop="username" label="操作人" />
      <el-table-column prop="type" label="操作类型">
        <template #default="{ row }">
          <el-tag :type="getTypeTag(row.type)">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="IP地址" width="120" />
      <el-table-column prop="description" label="操作描述" show-overflow-tooltip />
      <el-table-column prop="createTime" label="操作时间" width="180" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 日志详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="日志详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="操作人">{{ currentLog.username }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag :type="getTypeTag(currentLog.type)">{{ currentLog.type }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ currentLog.ip }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ currentLog.createTime }}</el-descriptions-item>
        <el-descriptions-item label="操作描述" :span="2">{{ currentLog.description }}</el-descriptions-item>
        <el-descriptions-item label="请求URL" :span="2">{{ currentLog.url }}</el-descriptions-item>
        <el-descriptions-item label="请求方法">{{ currentLog.method }}</el-descriptions-item>
        <el-descriptions-item label="耗时">{{ currentLog.duration }}ms</el-descriptions-item>
        <el-descriptions-item label="请求参数" :span="2">
          <div class="code-block">{{ currentLog.params }}</div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 搜索表单
const searchForm = reactive({
  username: '',
  type: '',
  timeRange: [] as string[]
})

// 日志列表数据
const loading = ref(false)
const logList = ref([
  {
    id: 1,
    username: 'admin',
    type: 'LOGIN',
    ip: '192.168.1.1',
    description: '用户登录',
    createTime: '2024-01-12 10:00:00',
    url: '/api/login',
    method: 'POST',
    duration: 123,
    params: '{"username": "admin", "password": "******"}'
  },
  {
    id: 2,
    username: 'teacher1',
    type: 'CREATE',
    ip: '192.168.1.2',
    description: '新增课程',
    createTime: '2024-01-12 11:00:00',
    url: '/api/course',
    method: 'POST',
    duration: 156,
    params: '{"name": "示例课程", "description": "课程描述"}'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 详情对话框
const dialogVisible = ref(false)
const currentLog = ref({} as any)

// 获取操作类型标签样式
const getTypeTag = (type: string) => {
  const types: Record<string, string> = {
    LOGIN: 'success',
    CREATE: 'primary',
    UPDATE: 'warning',
    DELETE: 'danger'
  }
  return types[type] || 'info'
}

// 处理搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm)
  // TODO: 实现搜索逻辑
}

// 重置搜索
const resetSearch = () => {
  searchForm.username = ''
  searchForm.type = ''
  searchForm.timeRange = []
  handleSearch()
}

// 处理分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

// 处理页码改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: 重新加载数据
}

// 查看详情
const handleDetail = (row: any) => {
  currentLog.value = row
  dialogVisible.value = true
}
</script>

<style scoped lang="scss">
.log-manage {
  .search-bar {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .code-block {
    padding: 10px;
    background: #f5f7fa;
    border-radius: 4px;
    font-family: monospace;
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style> 