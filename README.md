# 20240621_MongoDB
## 本次重點
* 拆檔案
* MongoDB－購物車

## 課程內容
* 指令
    * npm init --yes
    * 安裝各種套件：npm i express mongoose dotenv validator http-status-codes bcrypt
    * 安裝eslint：npm init @eslint/config@1.0
* 建立models資料夾 (00:15:06) －專門管理mongoose的東西
    * 商品 product.js (00:15:33)
        * eum
    * 使用者 user.js (00:26:05)
        * 加密概念 - demo資料夾 (00:32:34)
            * base64 （不算加密，是把文字轉成編碼）
            * md5 (00:36:05)
            * bctypt (00:41:43)
        * 密碼加密 (00:46:37)
        * 購物車 caty (01:00:27)
            * ObjectId
        * schema的一些參數設定 (01:10:30)
            * versionKey
            * timestamps
* mongoose的middlewares (00:58:43)
* 新增檔案.env、.gitignore (01:09:28)
* 本體 - index.js (01:12:43)
    * express講解 (01:18:28)
        1. 建立express伺服器
        2. 監聽
        3. 把各種請求的body解析成JSON
* 拆檔案
    * 資料夾routes - 把請求做分類 (01:22:48) (避免index.js太多東西不方便閱讀)
    * 資料夾controllers - 用於定義各種function
    * 概念說明 (01:29:20)
* 註冊 (01:36:37)