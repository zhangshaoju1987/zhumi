import React from "react";// 即便没有显示用到，也要引用
import { TouchableNativeFeedback, TouchableOpacity } from "react-native-gesture-handler";
import { Platform } from "react-native";

export const Touchable = (props:any) => {
    return Platform.OS === 'android'
      ? <TouchableNativeFeedback onPress={props.onPress}>{props.children}</TouchableNativeFeedback>
      : <TouchableOpacity onPress={props.onPress}>{props.children}</TouchableOpacity>
  }