import { GeoCoordinates } from "react-native-geolocation-service";
import { postJson } from "./Http";


const baseURL = "https://service.joemeet.com"

/**
 * 记录轨迹信息
 * @param owner     归属用户
 * @param event     本次追踪的事件 
 * @param coordinates 当前的坐标
 * @returns 
 */
export function Api_AddPosition(owner:string,event:string,coordinates:GeoCoordinates){

    if(!event){
        return Promise.reject("缺失事件，忽略本次记录");
    }
    const uri ="/life-travel-trace/add";
    const data = {
        event,
        owner,
        ...coordinates
    }
    return postJson(baseURL+uri,data)
}

/**
 * 查询事件归属方的事件列表
 * @param owner     事件归属方
 * @returns 
 */
export function Api_QueryEvent(owner:string){

    if(!owner){
        return Promise.reject("缺失主体");
    }
    const uri ="/life-travel-trace/query-event";
    const data = {
        owner
    }
    return postJson(baseURL+uri,data)
}

/**
 * 查询事件归属方的事件列表
 * @param owner     事件归属方
 * @param event     事件名称
 * @returns 
 */
export function Api_QueryTrace(owner:string,event:string){

    if(!owner || !event){
        return Promise.reject("缺失主体或者事件名称");
    }
    const uri ="/life-travel-trace/query-trace";
    const data = {
        owner,
        event
    }
    return postJson(baseURL+uri,data)
}

