import { useState } from "react";
import { Alert, Linking, StyleSheet, View } from "react-native";
import { Button, Chip, List, TextInput } from "react-native-paper";
import * as settingsAction from "../redux/actions/settingsAction";
import { connect } from "react-redux";
import { RootState } from "../redux/store";

function UserProfile(props:any){

    return (
      <View style={styles.container}>

        <View style={{position:"relative",height:60}}>
          <TextInput label="距离阈值（位：米。可以控制报送的频率）" value={`${props.distanceFilter}`} onChangeText={text => props.setDistanceFilter(text)}/>
        </View>
        <View style={{position:"relative",height:60}}>
          <TextInput label="用户名称（自定义，可随意更改）" value={`${props.username}`} onChangeText={text => props.setUsername(text)}/>
        </View>
        <View style={{position:"relative",height:60}}>
          <TextInput label="用户凭证（一旦确定请勿随意乱改，会丢失之前的数据）" value={`${props.owner}`} onChangeText={text => props.setOwner(text)}/>
        </View>
        <List.Section title="精度设置">
          <View style={styles.chooseGroup}>
            <Chip showSelectedCheck onPress={()=>{props.setAccuracy("bestForNavigation")}} style={{margin:5}} key={"bestForNavigation"} selected={props.accuracy == "bestForNavigation"}>导航最佳</Chip>
            <Chip showSelectedCheck onPress={()=>{props.setAccuracy("best")}} style={{margin:5}} key={"best"} selected={props.accuracy == "best"}>最佳精度</Chip>
            <Chip showSelectedCheck onPress={()=>{props.setAccuracy("nearestTenMeters")}} style={{margin:5}} key={"nearestTenMeters"} selected={props.accuracy == "nearestTenMeters"}>十米精度</Chip>
            <Chip showSelectedCheck onPress={()=>{props.setAccuracy("hundredMeters")}} style={{margin:5}} key={"hundredMeters"} selected={props.accuracy == "hundredMeters"}>百米精度</Chip>
            <Chip showSelectedCheck onPress={()=>{props.setAccuracy("kilometer")}} style={{margin:5}} key={"kilometer"} selected={props.accuracy == "kilometer"}>千米精度</Chip>
            <Chip showSelectedCheck onPress={()=>{props.setAccuracy("reduce")}} style={{margin:5}} key={"reduce"} selected={props.accuracy == "reduce"}>不关心精度</Chip>
          </View>
        </List.Section>

        <List.Section title="地图供应商">
          <View style={styles.chooseGroup}>
            <Chip showSelectedCheck onPress={()=>{props.setMapProvider(undefined)}} style={{margin:5}} key={"MapKit"} selected={typeof props.mapProvider == 'undefined' }>跟随系统</Chip>
            <Chip showSelectedCheck onPress={()=>{props.setMapProvider("google")}} style={{margin:5}} key={"google"} selected={props.mapProvider == "google"}>谷歌地图</Chip>
          </View>
        </List.Section>

        <View style={{position:"relative",height:60}}>
        <Button icon="cogs" mode="contained" onPress={() => Linking.openURL("app-settings:")}>
          权限设置
        </Button>
        </View>
      </View>
    )
}

const mapStateToProps = (state:RootState) =>{

  return {
		accuracy : state.settings.accuracy,
    distanceFilter : state.settings.distanceFilter,
    username : state.settings.username,
    owner : state.settings.owner,
    mapProvider : state.settings.mapProvider
	}
}

const mapDispatchToProps = (dispatch:any) =>
	({
		setAccuracy : (accuracy:string) => dispatch(settingsAction.setAccuracy(accuracy)),
    setDistanceFilter : (distanceFilter:string) => dispatch(settingsAction.setDistanceFilter(distanceFilter)),
    setUsername : (username:string) => dispatch(settingsAction.setUsername(username)),
    setMapProvider : (mapProvider:string) => dispatch(settingsAction.setMapProvider(mapProvider)),
    setOwner : (owner:string) => dispatch(settingsAction.setOwner(owner))
	});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserProfile);

const styles = StyleSheet.create({
    container: {
      
    },
    chooseGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 12,
  
    },
  });
  