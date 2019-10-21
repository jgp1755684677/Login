/* 定义地图 */
var map;

function init() {

    /* 定义地图的中心和缩放级别 */
    map = L.map('map').setView([33, 110], 7);

    /* 加载地图底图 */
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    /* 加载自定义的地图 */
    var url = "http://localhost:2333/geoserver/WebGIS/wms";
    const bounderLayer = L.tileLayer.wms(url, {
        layers: 'WebGIS:Search_Polygon',
        format: "image/png",
        crs: L.CRS.EPSG4326,
        opacity: 0.5,
        transparent: true
    });

    /* 加载地图的属性信息 */
    /* 添加GeoJSON的完成路径 */
    var url = "http://localhost:2333/geoserver/WebGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WebGIS%3ASearch_Polygon&maxFeatures=50&outputFormat=application%2Fjson";
    var Search_PolygonGeoJSON = L.geoJson(null, {
        onEachFeature: function (feature, marker) {
            marker.bindPopup('<h4 style="color:' + feature.properties.color + '">' + '行政区名称：' + feature.properties.name + '<br/>行政区编码：' + feature.properties.number);
        }
    }).addTo(map);

    /* ajax调用 */
    $.ajax({
        url: url,
        dataType: 'json',
        outputFormat: "text/javascript",
        success: function (data) {
            Search_PolygonGeoJSON.addData(data);
        }
    });
}