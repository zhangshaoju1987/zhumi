import { LatLng } from "react-native-maps"

const x_PI = 3.14159265358979324 * 3000.0 / 180.0
const PI = 3.1415926535897932384626
const a = 6378245.0
const ee = 0.00669342162296594323

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param {*} lng 
 * @param {*} lat 
 */
function outOfChina(lng:number, lat:number){
  return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false)
}

/**
 * 经度转换
 * @param { Number } lng 
 * @param { Number } lat 
 */
function transformlat (lng:number, lat:number) {
  var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
  return ret
}
 
/**
 * 纬度转换
 * @param { Number } lng 
 * @param { Number } lat 
 */
function transformlng (lng:number, lat:number) {
  var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0
  return ret
}
/**
 * WGS84坐标系转火星坐标系GCj02 / 即WGS84 转谷歌、高德
 * 不转换会有627.8米的偏差，转换后，大概0.4米的偏差（可接受）
 * @param { Number } lng:需要转换的经纬
 * @param { Number } lat:需要转换的纬度
 * @return { Array } result: 转换后的经纬度数组
 */
function wgs84togcj02(lng:number, lat:number){
    if (outOfChina(lng, lat)) {
      return {
          longitude:lng,
          latitude:lat
      }
    }else {
      var dlat = transformlat(lng - 105.0, lat - 35.0)
      var dlng = transformlng(lng - 105.0, lat - 35.0)
      var radlat = lat / 180.0 * PI
      var magic = Math.sin(radlat)
      magic = 1 - ee * magic * magic
      var sqrtmagic = Math.sqrt(magic)
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
      const mglat = lat + dlat
      const mglng = lng + dlng
      //console.log(`from [${lng},${lat}] to [${mglng},${mglat}]`)
      return {
        longitude:mglng,
        latitude:mglat
      }
    }
  }

  /**
   * 计算两个经纬度坐标之间的距离和坐标
   * @param start 
   * @param end 
   * @returns 
   */
  function calc_azimuth(start:LatLng, end:LatLng){
    const lat1_rad = start.latitude * Math.PI / 180
    const lon1_rad = start.longitude * Math.PI/ 180
    const lat2_rad = end.latitude * Math.PI / 180
    const lon2_rad = end.longitude * Math.PI / 180

    const y = Math.sin(lon2_rad - lon1_rad) * Math.cos(lat2_rad)
    const x = Math.cos(lat1_rad) * Math.sin(lat2_rad) - Math.sin(lat1_rad) * Math.cos(lat2_rad) * Math.cos(lon2_rad - lon1_rad)

    const brng = Math.atan2(y, x) * 180 / Math.PI
    const deg = (brng + 360.0) % 360.0;
    const R = 6378137
    const d = Math.acos(Math.sin(lat1_rad)*Math.sin(lat2_rad)+ Math.cos(lat1_rad)*Math.cos(lat2_rad)*Math.cos(lon2_rad-lon1_rad))*R
    return [deg,parseFloat(d.toFixed(2))];
  }
  export default {
    wgs84togcj02,
    calc_azimuth
  }