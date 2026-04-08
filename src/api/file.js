import request from '@/utils/request'

// 文件上传
export function uploadFile(file, module = 'common') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('module', module)
  return request({
    url: '/file/upload',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
