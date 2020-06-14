# googlemap api串接實做 with Vue
https://maxyeh666.github.io/googlemap-api-vue-/  

有對應RWD(breakpoint<768),下方QRcode可以觀看效果  
<img src="https://github.com/maxyeh666/googlemap-api-vue-/blob/master/qrcode.png">

## 製作目標
個人休假喜歡出去旅遊,將一些常用的功能根據自喜的喜好做些快速使用的調整

## 功能
功能陸續根據使用情況更新

<ul>目前功能:
  <li>指定目標快速搜尋
</ul>
<ul>預定製作:
  <li>路徑計算
  <li>營業狀態切換與過濾
</ul>

## 使用技術
HTML  
CSS  
Javascript  
Jquery  
Vue框架  
bootstrap 4  
* Google maps api
  - Maps JavaScript API
  - Places API

## 實作筆記

紀錄一些製作中遇到的問題或疑問

* 關於定位
  - 定位的方法有使用Google maps api的Geolocation與HTML5本身提供的Geolocation API  
  詳細差異可以參考stack overflow:https://stackoverflow.com/questions/35799506/html5-geolocation-vs-google-maps-geolocation-api   
  簡單的總結:google map api的Geolocation可以在各種平台與裝置有一致的結果。HTML5的Geolocation API 則是會經過瀏覽器自動收集各種資料，甚至使用第     三方API(包含Google maps api)來取得定位資料，但結果有可能因為瀏覽器而產生差異。
* 關於Google maps API
  - 用量控制，務必設定API金鑰限制控管流量。
  - Google maps api的請求為20個/秒，超過會出現OVER_QUERY_LIMIT，目前看來只能用用延遲來處理請求數量。
* 關於Vue
  - 注意Vue的整體觀念，由資料的變動來改變rnder，不再是直接操縱DOM。
  - Vue裡面大多使用this來調用各種函式與變數，使用時務必注意this的指向。
* 關於bootstrap4
  - 互動視窗(modal)似乎是調用bootstrap4的函式呼叫，無法由Vue來進行控制(待確認)。
* 關於Javascript
  - 注意clocure，確保各個變數的作用域，取得正確的結果。  
