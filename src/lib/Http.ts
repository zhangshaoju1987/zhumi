import axios from "axios";
/**
 * 
 * @param uri 请求的地址
 * @param data 请求的参数
 */
export function postJson(url:string,data:any):Promise<any>{

    return new Promise((resovle,reject)=>{
        const headers = {"Content-Type":"application/json"};
        //console.info("请求地址：%s",url)
        axios.post(url,data,{headers}).then((resp)=>{
            resovle(resp.data)
        }).catch((err)=>{
            reject(err);
        })
    })
}