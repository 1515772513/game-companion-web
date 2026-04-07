<template>
  <div class="app-container">
    <div class="query-container">
      <el-input v-model="queryParams.name" placeholder="配置名称" style="width: 240px" class="m-1" />
      <el-input v-model="queryParams.configKey" placeholder="配置键" style="width: 240px" class="m-1" />
      <el-button type="primary" @click="getList">查询</el-button>
      <el-button @click="resetQuery">重置</el-button>
      <el-button type="success" @click="handleAdd">新增配置</el-button>
    </div>

    <el-table v-loading="loading" :data="list" border style="width: 100%;margin-top:10px">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="configKey" label="配置键" min-width="180" />
      <el-table-column prop="name" label="配置名称" min-width="150" />
      <el-table-column prop="configType" label="类型" width="100" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.configType === 'json' ? 'warning' : 'primary'">
            {{ scope.row.configType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="200" />
      <el-table-column prop="createdAt" label="创建时间" width="180" align="center" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/修改弹窗 -->
    <el-dialog v-model="dialogVisible" title="配置信息" width="600px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="配置键" prop="configKey">
          <el-input v-model="form.configKey" placeholder="例如：home_banners" />
        </el-form-item>
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="form.name" placeholder="例如：首页轮播图" />
        </el-form-item>
        <el-form-item label="类型" prop="configType">
          <el-select v-model="form.configType">
            <el-option label="字符串" value="string" />
            <el-option label="JSON" value="json" />
            <el-option label="数字" value="number" />
          </el-select>
        </el-form-item>
        <el-form-item label="配置值" prop="configValue">
          <el-input v-model="form.configValue" type="textarea" :rows="6" placeholder="JSON格式请粘贴JSON字符串" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getConfigPage,
  addConfig,
  updateConfig,
  deleteConfig
} from '@/api/system'

const list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const formRef = ref(null)
const isEdit = ref(false)

// 查询条件
const queryParams = reactive({
  name: '',
  configKey: ''
})

// 表单
const form = reactive({
  id: '',
  configKey: '',
  name: '',
  configValue: '',
  configType: 'string',
  remark: ''
})

// 获取列表
const getList = async () => {
  loading.value = true
  const res = await getConfigPage(queryParams)
  list.value = res.data || []
  loading.value = false
}

// 重置
const resetQuery = () => {
  queryParams.name = ''
  queryParams.configKey = ''
  getList()
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  form.id = ''
  form.configKey = ''
  form.name = ''
  form.configValue = ''
  form.configType = 'string'
  form.remark = ''
}

// 提交
const submitForm = async () => {
  if (isEdit.value) {
    await updateConfig(form)
    ElMessage.success('修改成功')
  } else {
    await addConfig(form)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  getList()
}

// 删除
const handleDelete = async (id) => {
  await ElMessageBox.confirm('确认删除？', '提示', { type: 'warning' })
  await deleteConfig(id)
  ElMessage.success('删除成功')
  getList()
}

// 初始化
getList()
</script>

<style scoped>
.query-container {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>