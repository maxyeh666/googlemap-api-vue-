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
* Google map api
  - Maps JavaScript API
  - Places API

## 實作筆記

* 關於定位
  - 定位的方法有使用google map api的Geolocation與HTML5本身提供的Geolocation API  
  詳細差異可以參考stack overflow:https://stackoverflow.com/questions/35799506/html5-geolocation-vs-google-maps-geolocation-api   
  簡單的總結:google map api的Geolocation可以在各種平台與裝置有一致的結果,但相對精準度可能較低。HTML5的Geolocation API 則是會經過瀏覽器自動收集各   種資料，甚至使用第三方API(包含googlemap api)來取得定位資料，可能相對較為精準，但結果有可能因為瀏覽器而產生差異。
* 
