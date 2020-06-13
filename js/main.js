(function($,Vue){
    /*-------------------------
    ------  簡易環境設定  -----
    -------------------------*/

    //設定環境變數
    let process = {
        env:{
            server: 'dev'
        }
    }

    //設定環境變數中sever為dev時顯示console.log()
    function log(args){
        if(process.env.server === 'dev')
        console.log(args)
    }
    
    /*---------------------------------
    ------------設定共用變數------------
    ---------------------------------*/

    //搜尋範圍設定
    const searchRadius = [200,400,800,1000]
    // 目前位置
    let currentLocation
    //使用的google地圖
    let map
    //啟用的google api service
    let service
    //取得下一頁
    let getNextPage = null
    //原有的資料
    let getData
    //新取得的資料
    let newData
    //圖標
    let marker

    //開始使用vue.js
    let vue = new Vue({
        el: '#app',
        data:{
            //目前搜尋半徑
            CurrentRadius: 200,
            //互動視窗內容
            Content: '',
            //互動視窗控制
            Show: false
        },
        methods:{
            //初始化執行
            initMap(){
                if(navigator.geolocation){
                    this.ResetLocal()
                    this.GetCurrentPos()
                }else(
                    this.modal('裝置不支援!')
                )
            },

            /*-------------------------------
            ---- 設定點擊按鈕需使用的函式  ---
            --------------------------------*/
    
            MenuSwitch(){
                $('nav').toggleClass('menu-off')
            },

            //根據按鈕觸發相對應事件
            Search(target){
                this.CurrentPos(currentLocation,map)
                this.GetPosTarget(target,currentLocation,map)
            },

            /*-------------------------------
            -----------   函式區   -----------
            --------------------------------*/

            //取得定位資料
            Position(){
                // navigator.geolocation.getCurrentPosition為HTML5中的Geolocation API使用瀏覽器取得定位
                // getCurrentPosition(執行成功函式,執行失敗函式)
                navigator.geolocation.getCurrentPosition(this.GetPosSuccess,this.GetPosError)
            },

            //執行navigator.geolocation.getCurrentPosition成功的函式
            //會執行callback function取得position物件
            GetPosSuccess(position){
                //latitude=緯度,longitude=經度
                let currentLat = position.coords.latitude
                let currentLng = position.coords.longitude
                let location = {lat: currentLat,lng: currentLng}

                currentLocation = location
                //將取得的目前座標存入localstorage
                newData = JSON.stringify(location)
                localStorage.setItem('location',newData)
            },

            //無法取得定位時的函式
            GetPosError(){
                this.modal('無法取得位置')
            },

            //呼叫google map api將目前位置放置於地圖上
            CurrentPos(){
                currentLocation = JSON.parse(localStorage.getItem('location'))
                map = new google.maps.Map(document.querySelector('#map'),{zoom: 16,center:currentLocation})
                //設定目前位置座標
                let marker = new google.maps.Marker({
                    position:currentLocation,
                })
                //設定infowindow
                let infowindow = new google.maps.InfoWindow({
                    content : '<div class="currentPos">目前位置</div>'
                })
                //開啟infowindow
                infowindow.open(map,marker)  
                marker.addListener('click', function() {
                        infowindow.open(map,marker)
                })
                //指定圖標要出現的地圖
                marker.setMap(map)
            },

            //將上述函式包裝一次執行
            GetCurrentPos(){
                this.Position()
                setTimeout(this.CurrentPos(),100)
            },

            //設定搜尋半徑
            SearchRadiusChange(value){
                let changeIndex = (searchRadius.indexOf(this.CurrentRadius) + value + searchRadius.length) % searchRadius.length
                this.CurrentRadius = searchRadius[changeIndex] 
            },

            //取得目標位置
            GetPosTarget(target){
                this.CurrentPos()

                //發送要給nearbysearch請求的內容
                let NearbyRequest = {
                    location: currentLocation,
                    radius: this.CurrentRadius,
                    type: [target],
                    openNow: true
                }

                this.RadiusCircle()

                //建立新服務並呼叫api處理
                service = new google.maps.places.PlacesService(map)
                service.nearbySearch(NearbyRequest, this.NearBySearch)
            },

            //呼叫google map 的nearbysearch要callback的函式
            NearBySearch(results, status ,pagination){
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    
                    for (let i = 0;i < results.length;i++){
                        this.CreateData(results[i])
                    }
                    // log(pagination.hasNextPage)
                    if (pagination.hasNextPage) {
                        log('讀取中')
                        $('#loading').css('opacity','1')
                        //google map最多呼叫1頁=20筆資料,接收額外回傳的資料判斷是否有下一頁
                        pagination.nextPage()
                        
                    }else{
                        log('讀取完畢')
                        $('#loading').css('opacity','0')
                        getData = JSON.parse(localStorage.getItem('search'))

                        for(let j = 0;j < getData.length;j++){
                            //注意使用arrow function確保this的指向Vue,否則會指向setTimeout(=window)
                            setTimeout(()=>{
                                // log(j)
                                marker = new google.maps.Marker({
                                    position: getData[j].location,
                                    animation: google.maps.Animation.DROP,
                                    map: map
                                })

                                let request = {
                                    placeId:getData[j].placeId
                                }

                                log(getData[j].location)

                                service = new google.maps.places.PlacesService(map);
                                service.getDetails(request,this.Details)
                            }, j * 400)
                        }
                    }
                }else{
                    this.modal('沒有目標地點')
                }
            },

            //將nearbysearch取得的所有地點存入localstorage
            CreateData(place) {
                // log(place)
                let position = JSON.parse(localStorage.getItem('search'))
                let data = {
                    location:place.geometry.location,
                    placeId:place.place_id
                } 
                position.push(data)
                newData = JSON.stringify(position)
                localStorage.setItem('search',newData)
            },

            //搜尋半徑顯示
            RadiusCircle(){
                this.CurrentPos()
                let cicrle = new google.maps.Circle({
                    strokeColor: '#00bfff',
                    strokeOpacity: 0.5,
                    strokeWeight: 2,
                    fillColor: '#87cefa',
                    fillOpacity: 0.35,
                    map: map,
                    center: currentLocation,
                    radius: this.CurrentRadius
                });
            },

            //呼叫google map的place deatil要callback的函式
            Details(details,status){
                log('detail')
                if(status == google.maps.places.PlacesServiceStatus.OK){
                    log(details)
                    getData = JSON.parse(localStorage.getItem('search'))

                    let rating = details.rating

                    if(rating){
                        rating = rating + '<i class="fas fa-star">'
                    }else{
                        rating = '沒有評價'
                    }

                    infowindow = new google.maps.InfoWindow();
                    infowindow.setContent(
                        details.name
                    )

                    infowindow.open(map, marker);
                    log(marker)
                    //注意使用clocure確保每個infowindwo對應各自的marker
                    //如果不使用clocure則會導致外層的marker已執行完畢再來執行infowindow，導致最後所有infowindow全部綁定在最後的marker
                    google.maps.event.addListener(marker,'click', (function(marker,infowindow) {
                        return function() {
                        infowindow.setContent(
                            '<div>名稱:' + details.name + '</div>' +
                            '<div>評價:' + rating + '</i></div>' +
                            '<div>地址:' + details.formatted_address + '</div>' + 
                            '<div><a href="' + details.url +'">googlemap中開啟</a></div>'
                            )
                        infowindow.open(map, marker);
                        }
                    })(marker,infowindow))
                }else{
                    log(status)
                }
            },

            //重置localstorage中的search陣列
            ResetLocal(){
                localStorage.setItem('search','[]')
            },

            //bootstrap4彈出式提示視窗
            modal(content){
                this.Content = content
                $('#Modal').modal('show')
            }
        },
        mounted(){
            this.initMap()
        }
    })
})($,Vue)