<template>
  <div class="settings-container">
    <el-card>
      <el-form :model="settingsForm" label-width="150px" style="max-width: 800px">
        <el-form-item label="平台名称">
          <el-input v-model="settingsForm.platformName" placeholder="请输入平台名称" />
        </el-form-item>

        <el-form-item label="平台Logo">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
          >
            <img v-if="settingsForm.platformLogo" :src="settingsForm.platformLogo" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="客服电话">
          <el-input v-model="settingsForm.servicePhone" placeholder="请输入客服电话" />
        </el-form-item>

        <el-form-item label="客服邮箱">
          <el-input v-model="settingsForm.serviceEmail" placeholder="请输入客服邮箱" />
        </el-form-item>

        <el-form-item label="平台抽成比例(%)">
          <el-input-number
            v-model="settingsForm.commissionRate"
            :min="0"
            :max="100"
            :precision="2"
          />
        </el-form-item>

        <el-form-item label="最低提现金额(元)">
          <el-input-number v-model="settingsForm.minWithdrawAmount" :min="0" :precision="2" />
        </el-form-item>

        <el-form-item label="提现手续费率(%)">
          <el-input-number
            v-model="settingsForm.withdrawFeeRate"
            :min="0"
            :max="100"
            :precision="2"
          />
        </el-form-item>

        <el-form-item label="用户协议">
          <el-input
            v-model="settingsForm.userAgreement"
            type="textarea"
            :rows="4"
            placeholder="请输入用户协议内容"
          />
        </el-form-item>

        <el-form-item label="隐私政策">
          <el-input
            v-model="settingsForm.privacyPolicy"
            type="textarea"
            :rows="4"
            placeholder="请输入隐私政策内容"
          />
        </el-form-item>

        <el-form-item label="关于我们">
          <el-input
            v-model="settingsForm.aboutUs"
            type="textarea"
            :rows="4"
            placeholder="请输入关于我们内容"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave" :loading="loading">保存配置</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getSettings, updateSettings } from '@/api/settings'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const loading = ref(false)

const settingsForm = reactive({
  platformName: '',
  platformLogo: '',
  servicePhone: '',
  serviceEmail: '',
  commissionRate: 0,
  minWithdrawAmount: 0,
  withdrawFeeRate: 0,
  userAgreement: '',
  privacyPolicy: '',
  aboutUs: ''
})

const loadData = async () => {
  try {
    const res = await getSettings()
    if (res.code === 200) {
      Object.assign(settingsForm, res.data)
    }
  } catch (error) {
    console.error('加载配置失败:', error)
  }
}

const handleSave = async () => {
  try {
    loading.value = true
    const res = await updateSettings(settingsForm)

    if (res.code === 200) {
      ElMessage.success('保存成功')
    }
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  loadData()
}

const handleLogoSuccess = (response) => {
  if (response.code === 200) {
    settingsForm.platformLogo = response.data.url
    ElMessage.success('上传成功')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.settings-container {
  .avatar-uploader {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
      line-height: 178px;
    }
  }
}
</style>
