import { StyleSheet, View } from "react-native"
import { Camera, useCameraDevice } from "react-native-vision-camera"

export function Scanner() {
    const device = useCameraDevice('back')
  
    if (device == null) return <View></View>
    return (
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
    )
  }


const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject
    },
  });