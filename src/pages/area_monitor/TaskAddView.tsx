import React, { useState } from "react";
import { Alert, Dimensions, Keyboard, Linking, StyleSheet, View } from "react-native";
import { Button, Chip, Divider, List, Switch, Text, TextInput } from "react-native-paper";
import BottomSheet, { BottomSheetView, WINDOW_HEIGHT } from '@gorhom/bottom-sheet';
import { store } from "../../redux/store";
import { addTask, deleteTask } from "../../redux/actions/taskAction";
import Clipboard from "@react-native-clipboard/clipboard";
import { notify } from "../../redux/actions/requestAction";
import MapView, { Callout, Circle, Marker } from "react-native-maps";

export function TaskAddView(props:any){

    function addOrUpdateTask(){
      const {uuid} = props.route.params;
      const taskInfo = {
        uuid,
        type:"circle",
        center:{
          latitude,longitude
        },
        radius,
        leaveNotify,enterNotify
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
    const [enterNotify,setEnterNotify] = useState(t?t.enterNotify:true);
    const [leaveNotify,setLeaveNotify] = useState(t?t.leaveNotify:true);

    const [showLocation,setShowLocation] = useState(false);
    const [showCircle,setShowCircle] = useState(true);
    
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

    function locate(){
      setShowLocation(true);
      Keyboard.dismiss();
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
        <View style={{position:"relative",height:60,paddingLeft:15}}>
          <Text variant="labelMedium" style={{color:"gray"}}>进入通知</Text>
          <Switch style={{width:100}} value={enterNotify} onValueChange={(val)=>{setEnterNotify(val)}} />
        </View>
        <View style={{position:"relative",height:60,paddingLeft:15}}>
          <Text variant="labelMedium" style={{color:"gray"}}>离开通知</Text>
          <Switch style={{width:100}} value={leaveNotify} onValueChange={(val)=>{setLeaveNotify(val)}} />
        </View>
        <View style={{position:"relative",height:60}}>
          <Button icon="cogs" mode="contained" onPress={() => addOrUpdateTask()} style={{margin:5}}>保存任务</Button>
          <Button icon="content-paste" buttonColor="red" mode="contained" style={{margin:5}} onPress={() => doPaste()}>粘贴</Button>
          <Button icon="map-marker-distance" buttonColor="green" mode="contained" style={{margin:5}} onPress={() => locate()}>查看位置</Button>
        </View>
        {showLocation && 
        <BottomSheet
          index={1}
          snapPoints={[WINDOW_HEIGHT/5,WINDOW_HEIGHT-240,Dimensions.get("window").height]}
          enablePanDownToClose={true}
          keyboardBehavior="interactive"
          onClose={()=>{
            setShowLocation(false);
          }}
        >
          <BottomSheetView style={styles.contentContainer}>
            <MapView
              showsUserLocation={true}
              followsUserLocation={false}
              showsMyLocationButton={true}
              showsScale={true}
              style={styles.map}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta:0.0375/56,    // 控制缩放
                longitudeDelta:0.0812/56,   // 控制缩放
              }}
            >
              <Marker draggable onDragEnd={(event)=>{
                            setShowCircle(true);
                            setLongitude(event.nativeEvent.coordinate.longitude);
                            setLatitude(event.nativeEvent.coordinate.latitude);
                            store.dispatch(notify({text:"位置更改后，记得保存"}))
                          }
                        
                          } 
                          onDrag={(event)=>{setShowCircle(false);setLongitude(event.nativeEvent.coordinate.longitude);setLatitude(event.nativeEvent.coordinate.latitude);}}
                          coordinate={{latitude:latitude,longitude:longitude}}>
                <Callout style={{width:240,padding:5}}>
                  <Text>监控中心点（可拖拽选择）</Text>
                  <Text>坐标经度：{longitude}</Text>
                  <Text>坐标纬度：{latitude}</Text>
                </Callout>
              </Marker>
              {showCircle && <Circle center={{latitude,longitude}} radius={radius} strokeColor="red" zIndex={3} strokeWidth={3}/>}
           </MapView>
          </BottomSheetView>
        </BottomSheet>}
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor:"#FFFFFF"
    },
    chooseGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 12,
  
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });
  