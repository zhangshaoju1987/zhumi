import React from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Dimensions,
  Text,
  Keyboard,
} from 'react-native';
import * as settingsAction from "../redux/actions/settingsAction";
import Geolocation, { GeoCoordinates } from 'react-native-geolocation-service';
import MapView, {Camera, LatLng, Polyline, UserLocationChangeEvent} from 'react-native-maps';
import { Avatar, Button, Chip, FAB, Portal } from 'react-native-paper';
import Geo from '../lib/Geo';
import Slider from '@react-native-community/slider';
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { Api_AddPosition, Api_QueryEvent, Api_QueryTrace } from '../lib/Api';
import { connect } from 'react-redux';
import { RootState, store } from '../redux/store';
import { Notifications } from 'react-native-notifications';
import { TouchableOpacity } from 'react-native-gesture-handler';


const zoomMap = {
  "16":11790/64,
  "15":11790/32,
  "14":11790/16,
  "13":11790/8,
  "12":11790/4,
  "11":11790/2,
  "10":11790,
  "9":11790*2,
  "8":11790*4,
  "7":11790*8,
  "6":11790*16,
  "5":11790*32,
  "4":11790*64,
  "3":11790*128,
  "2":11790*256,
  "1":11790*512,
  "0":11790*1024,
}
class Home extends React.Component<any, any> {
  private bottomSheet_record:any;
  private map:any;
  private watchId:any;
  constructor(props: any) {
    super(props);
    this.bottomSheet_record = React.createRef<BottomSheet>();
    this.map = React.createRef<MapView>();
    this.watchId = React.createRef<number>();
    this.state = {
      followUserLocation:false,
      open:false,
      scale:14,                   // 控制缩放
      latitudeDelta:0.0375,    // 控制缩放
      longitudeDelta:0.0812,   // 控制缩放
      observingPanelShow:false,   // bottomsheet 监控面板
      eventName:"",
      record:{
        observing:false,
        observingBtnTxt:"开始记录",
        observingBtnDisabled:false,
        observingBtnLoading:false,
        obseringBtnColor:"#F8BC31"
      },
      watch:{
        observing:false,
        observingBtnTxt:"仅监控",
        observingBtnDisabled:false,
        observingBtnLoading:false,
        obseringBtnColor:"#5AA4AE"
      },
      eventHistory:[],
      polyline:[]
    };
  }
  componentDidMount(): void {

    // 开始加载是，速度更重要，不需要精度太高
    Geolocation.getCurrentPosition(
      (position) => {
        this.changeCenter({longitude:position.coords.longitude,latitude:position.coords.latitude},64);
      },
      (error) => {
        Alert.alert(error.code+error.message)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000, accuracy:{ios:"nearestTenMeters"},distanceFilter:this.props.distanceFilter}
    );
  }

  /**
   * 调整中心坐标
   * @param position wgs84标准的坐标
   */
  changeCenter(position:LatLng,scale:number) {
    const {latitude,longitude} = Geo.wgs84togcj02(position.longitude,position.latitude)
        this.setState({region:{
          latitude,
          longitude,
          latitudeDelta: this.state.latitudeDelta/scale,
          longitudeDelta: this.state.longitudeDelta/scale,

        }})
        this.setState({followUserLocation:false})
  }

  /**
   * 缩放控制
   */
  handleZoom = () => {
    this.map?.current.getCamera().then((cam: Camera) => {
      (cam as any).altitude = zoomMap[`${this.state.scale}`];
      this.map?.current.animateCamera(cam);
      this.setState({followUserLocation:false});
    });
  };

  onUserLocationChange(event: UserLocationChangeEvent) {
    
    const coordinate = event.nativeEvent.coordinate;
    //console.log("用户位置："+JSON.stringify(coordinate))
  }


  drawTrace(item:any){

    Keyboard.dismiss();
    this.setState({eventName:item.event })
    Api_QueryTrace(item.owner,item.event).then((data)=>{
      const list:GeoCoordinates[] = (data.list as GeoCoordinates[])
      const polyline:LatLng[] = [];
      list.map((item,_)=>{
        polyline.push(Geo.wgs84togcj02(item.longitude,item.latitude));
      })
      console.log(`本次轨迹数:${polyline.length}`)
      const center = list[parseInt(`${list.length/2}`)]
      this.changeCenter({latitude:center.latitude,longitude:center.longitude},16);
      this.setState({polyline});
      this.bottomSheet_record?.snapToIndex(0);
    });
  }
  handleWatching(){

    if(!this.state.eventName){
      Alert.alert("开始记录前请先设置记录名称");
      return;
    }
    if(this.state.record.observing){
                              
      Geolocation.clearWatch(this.watchId);
      const record = {
        ...this.state.record,
        observing:false,
        observingBtnTxt:"开始记录",
        observingBtnDisabled:false,
        observingBtnLoading:false,
        obseringBtnColor:"#F8BC31",
      }
      this.setState({record,followUserLocation:false});
      
      console.log("已停止记录");
    }else{
      this.watchId = Geolocation.watchPosition((position)=>{
        
        console.log(`(${this.watchId})获取到位置：${position.coords.latitude}`);
        Api_AddPosition(store.getState().settings.owner,this.state.eventName,position.coords);
      },(error)=>{
        Alert.alert(error.code+error.message);
      },{
        enableHighAccuracy: true, 
        showsBackgroundLocationIndicator: true, 
        accuracy:{ios:this.props.accuracy},
        distanceFilter:this.props.distanceFilter
      });
      const record = {
        ...this.state.record,
        observing:true,
        observingBtnTxt:"结束记录",
        observingBtnDisabled:false,
        observingBtnLoading:false,
        obseringBtnColor:"#5AA4AE",
      }
      this.setState({record,followUserLocation:true});
    }
  }



  onlyWatching(){

    if(this.state.watch.observing){
                              
      Geolocation.clearWatch(this.watchId);
      const watch = {
        ...this.state.watch,
        observing:false,
        observingBtnTxt:"仅监控",
        observingBtnDisabled:false,
        observingBtnLoading:false,
        obseringBtnColor:"#5AA4AE",
      }
      this.setState({watch});
      console.log("已停止监控");
    }else{
      this.watchId = Geolocation.watchPosition((position)=>{
        
        console.log(`(${this.watchId})获取到位置：${position.coords.latitude}`);
      },(error)=>{
        Alert.alert(error.code+error.message);
      },{
        enableHighAccuracy: false, 
        showsBackgroundLocationIndicator: true, 
        accuracy:{ios:"kilometer"},   // 只是为了app保活，精度降低，保障电池电量
        distanceFilter:500
      });
      const watch = {
        ...this.state.watch,
        observing:true,
        observingBtnTxt:"停止监控",
        observingBtnDisabled:false,
        observingBtnLoading:false,
        obseringBtnColor:"#F8BC31",
      }
      this.setState({watch});
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={this.map}
          provider={this.props.mapProvider}
          showsUserLocation={true}
          followsUserLocation={this.state.followUserLocation}
          showsMyLocationButton={true}
          showsScale={true}
          showsCompass={true}
          style={styles.map}
          region={this.state.region}
          onUserLocationChange={event => this.onUserLocationChange(event)}
        >
          {
          this.state.polyline.length > 0 &&
          <Polyline
            coordinates={this.state.polyline}
            strokeColor="rgba(0,0,200,0.5)"
            strokeWidth={1}
            lineDashPattern={[5, 2, 3, 2]}
          /> 
          }
        </MapView>
        
      <View style={{width: 10, height: 170,position:"absolute",top:200,right:-40,transform: [{rotate: '270deg'}]}}>
          <Slider
            style={{width: 170, height: 10}}
            minimumValue={0}
            maximumValue={16}
            value={this.state.scale}
            step={1}
            minimumTrackTintColor="#2775B6"
            maximumTrackTintColor="#87C0CA"
            onValueChange={(value)=>{
              this.setState({scale:value})
              this.handleZoom();
            }}
          />
        </View>
        {!this.state.observingPanelShow && !this.props.hideHomeFAB && <Portal>
          <FAB  icon="google-maps"
            size={"small"}
            style={{position:"absolute",bottom:50,left:40,borderRadius:50,backgroundColor:"rgba(255,255,255,0.5)"}}
            onPress={() => {
              // 主动获取自身位置时，按最高精度获取
              Geolocation.getCurrentPosition(
                (position) => {
                  this.changeCenter({latitude:position.coords.latitude,longitude:position.coords.longitude},64);
                },
                (error) => {
                  Alert.alert(error.code+error.message)
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000, accuracy:{ios:this.props.accuracy},distanceFilter:this.props.distanceFilter}
              );
            }}>
          </FAB>
          <FAB.Group
            open={this.state.open}
            visible
            style={{backgroundColor:"rgba(255,255,255,0.2)"}}
            fabStyle={{ backgroundColor: "#5AA4AE",borderRadius:50 }}
            icon={this.state.open ? 'axis-arrow' : 'plus'}
            backdropColor={"#EAE5E3"}
            color={'#FFF'}
            actions={[
              { 
                icon: 'google-assistant',
                label:"智能助手", 
                onPress: () => {
                  //this.props.setHideHomeFAB(true);
                  //this.props.navigation.navigate("Chat");
                  let localNotification = Notifications.postLocalNotification({
                    body: "Local notification!",
                    title: "Local Notification Title",
                    sound: "chime.aiff",
                    silent: false,
                    category: "SOME_CATEGORY",
                    userInfo: { },
                    fireDate: new Date(),
                  });
                } 
              },
              {
                icon: 'map-marker-distance',
                label: '轨迹追踪',
                onPress: async () => {
                  this.setState({observingPanelShow:true})
                  Api_QueryEvent(store.getState().settings.owner).then((data)=>{
                    this.setState({eventHistory:data.list});
                  });
                },
              },
              {
                icon: 'cog',
                label: '设置',
                onPress: () => {
                  this.props.setHideHomeFAB(true);
                  this.props.navigation.navigate("UserProfile")
                },
              },
            ]}
            onStateChange={({open})=>{
              this.setState({open})
            }}
            onPress={() => {
              if (this.state.open) {
                this.setState({open:false})
              }
            }}
          />
        </Portal>
        }

        {this.state.observingPanelShow && 
        <BottomSheet
          ref={(ref)=>{this.bottomSheet_record = ref}}
          index={1}
          snapPoints={[200,480]}
          enablePanDownToClose={true}
          keyboardBehavior="interactive"
          onClose={()=>{
            this.setState({observingPanelShow:false})
          }}
        >
          <BottomSheetView style={styles.contentContainer}>
             
            <BottomSheetTextInput value={this.state.eventName}
                onChangeText={(val) => { this.setState({eventName:val}); }}  
                placeholder='请输入`记录名称`'
                editable={!this.state.record.observing}
                clearButtonMode="always" style={styles.input} >
            </BottomSheetTextInput>

            <View style={{flexDirection:"row",height:50,marginTop:10}}>
              
              <Button style={{margin:5}} icon="record-rec" mode="contained" buttonColor={this.state.record.obseringBtnColor} 
                loading={this.state.record.observing} onPress={()=>{this.handleWatching()}}>{this.state.record.observingBtnTxt}</Button>
              
              <Button style={{margin:5}} icon="monitor-lock" mode="contained" buttonColor={this.state.watch.obseringBtnColor} 
                loading={this.state.watch.observing} onPress={()=>{this.onlyWatching()}}>{this.state.watch.observingBtnTxt}</Button>
            </View>

            <View style={styles.eventHistory}>
              {
                this.state.eventHistory.length>0 && this.state.eventHistory.map((item, idx) => {
                  return (
                    <Chip showSelectedCheck style={styles.chipStyle} key={idx} 
                      avatar={<Avatar.Text size={24} label={item.event.substring(0,1)} />} 
                      onClose={()=>{
                        this.setState({polyline:[]});
                      }} onPress={() => {
                        this.drawTrace(item);
                      }}>{item.event}</Chip>
                  )
                })
              }
            </View>
            

           
          </BottomSheetView>
        </BottomSheet>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    width:"80%",
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
  chipStyle: {
    marginTop: 5,
    marginRight: 3
},
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:"#FFFFFF"
  },
  eventHistory: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    width:"80%"

  },
  panel: {
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5
  },
  panelButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  panelButtonLast: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 30
  },
  panelCancelButtonTitle: {
    fontSize: 15,
    color: '#ffffff',
  },
  panelButtonTitle: {
    fontSize: 15,
    color: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default connect(
  (state:RootState)=>({
		accuracy :        state.settings.accuracy,
    distanceFilter :  state.settings.distanceFilter,
    username :        state.settings.username,
    owner :           state.settings.owner,
    mapProvider :     state.settings.mapProvider,
    hideHomeFAB:      state.settings.hideHomeFAB
	}),
  (dispatch:any)=>({
    setHideHomeFAB : (hideHomeFAB:boolean) => dispatch(settingsAction.setHideHomeFAB(hideHomeFAB)),
  })
)(Home);