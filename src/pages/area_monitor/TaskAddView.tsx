import { useState } from "react";
import { Alert, Keyboard, Linking, StyleSheet, View } from "react-native";
import { Button, Chip, Divider, List, Switch, Text, TextInput } from "react-native-paper";
import { connect } from "react-redux";
import { TaskInfo } from "../../redux/reducers/tasks";
import { store } from "../../redux/store";
import { addTask, deleteTask } from "../../redux/actions/taskAction";
import Clipboard from "@react-native-clipboard/clipboard";
import { notify } from "../../redux/actions/requestAction";

export function TaskAddView(props:any){

    function addOrUpdateTask(){
      const {uuid} = props.route.params;
      const taskInfo = {
        uuid,
        type:"cycle",
        center:{
          latitude,longitude
        },
        radius
      }
      store.dispatch(deleteTask(uuid))
      store.dispatch(addTask(taskInfo));
      Keyboard.dismiss();
      store.dispatch(notify({text:"任务设置成功"}))
    }
    const {uuid} = props.route.params;
    let t = store.getState().tasks.find(((val)=>val.uuid  === uuid));
    const [latitude,setLatitude] = useState(t?t.center.latitude:0);
    const [longitude,setLongitude] = useState(t?t.center.longitude:0);
    const [radius,setRadius] = useState(t?t.radius:20);
  
    
    function doPaste(){
      Clipboard.getString().then((str)=>{
        if(str.indexOf(",") > 0){
          const p:string[] = str.split(",");
          setLatitude(parseFloat(p[1]));
          setLongitude(parseFloat(p[0]));
          store.dispatch(notify({text:"粘贴成功"}))
          Clipboard.setString("");
        }else{
          store.dispatch(notify({text:"没有检测到位置记录"}))
        }
        Keyboard.dismiss();
      })
    }

    return (
      <View style={styles.container}>

        <View style={{position:"relative",height:60}}>
          <TextInput label="圆心-经度" value={`${longitude}`} onChangeText={text => {
            setLongitude(parseFloat(text));
          }}/>
        </View>
        <View style={{position:"relative",height:60}}>
          <TextInput label="圆心-纬度" value={`${latitude}`} onChangeText={text => {
            setLatitude(parseFloat(text));
          }}/>
        </View>
        <View style={{position:"relative",height:60}}>
          <TextInput label="区域半径(米)" value={`${radius}`} onChangeText={text => {
            if(text){
              setRadius(parseInt(text));
            }else{
              setRadius(0);
            }
          }}/>
        </View>
        <View style={{position:"relative",height:60}}>
          <Button icon="cogs" mode="contained" onPress={() => addOrUpdateTask()} style={{margin:10}}>保存任务</Button>
          <Button icon="content-paste" buttonColor="red" mode="contained" style={{margin:10}} onPress={() => doPaste()}>粘贴位置</Button>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      
    },
    chooseGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 12,
  
    },
  });
  