class WebSocketClient {
  constructor(url) {
    this.url = url
    this.ws = null
    this.reconnectTimer = null
    this.reconnectDelay = 3000
    this.maxReconnectAttempts = 5
    this.reconnectAttempts = 0
    this.onMessageCallback = null
    this.onOpenCallback = null
    this.onCloseCallback = null
    this.onErrorCallback = null
  }

  // 连接WebSocket
  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket已连接')
      return
    }

    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = (event) => {
        console.log('WebSocket连接成功')
        this.reconnectAttempts = 0
        if (this.onOpenCallback) {
          this.onOpenCallback(event)
        }
      }

      this.ws.onmessage = (event) => {
        console.log('收到WebSocket消息:', event.data)
        if (this.onMessageCallback) {
          this.onMessageCallback(event.data)
        }
      }

      this.ws.onclose = (event) => {
        console.log('WebSocket连接关闭')
        if (this.onCloseCallback) {
          this.onCloseCallback(event)
        }

        // 自动重连
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnect()
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error)
        if (this.onErrorCallback) {
          this.onErrorCallback(error)
        }
      }
    } catch (error) {
      console.error('WebSocket连接失败:', error)
    }
  }

  // 发送消息
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      console.error('WebSocket未连接')
    }
  }

  // 重连
  reconnect() {
    this.reconnectAttempts++
    console.log(`WebSocket重连中... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, this.reconnectDelay)
  }

  // 关闭连接
  close() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  // 消息回调
  onMessage(callback) {
    this.onMessageCallback = callback
  }

  // 连接成功回调
  onOpen(callback) {
    this.onOpenCallback = callback
  }

  // 连接关闭回调
  onClose(callback) {
    this.onCloseCallback = callback
  }

  // 错误回调
  onError(callback) {
    this.onErrorCallback = callback
  }
}

export default WebSocketClient
