declare module '*.jpg';
declare module '*.png';

interface ReducerAction{
    type:string,
    payload:any
}

interface NotificationType{
    id:string,
    backgroundColor?:string,
    textColor?:string,
    timeout?:number,
    type:string,
    text:string

}