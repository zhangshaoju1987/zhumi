import { Alert, StyleSheet } from "react-native";
import WebView from "react-native-webview"

export function Browser(props:any){

    const {uri} = props.route.params;
    return (
        <WebView source={{ uri}} style={styles.container} />
    )
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject
    },
  });