import React, { ReactNode, useRef } from 'react';
import { StyleSheet, Text, View, I18nManager, Alert } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Clipboard from '@react-native-clipboard/clipboard';
import { DataRow } from '.';
import { useNavigation } from '@react-navigation/native';

interface AppleStyleSwipeableRowProps {
  item:DataRow
  children?: ReactNode;
  navigation:any;
}

interface LeftActionsProps {
  dragX: SharedValue<number>;
  swipeableRef: React.RefObject<SwipeableMethods>;
}

const LeftAction = ({ dragX, swipeableRef }: LeftActionsProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          dragX.value,
          [0, 50, 100, 101],
          [-20, 0, 0, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));
  return (
    <RectButton
      style={styles.leftAction}
      onPress={() => swipeableRef.current!.close()}>
      <Animated.Text style={[styles.archiveText, animatedStyle]}>
        删除
      </Animated.Text>
    </RectButton>
  );
};

const renderLeftActions = (
  _: any,
  progress: SharedValue<number>,
  swipeableRef: React.RefObject<SwipeableMethods>,
  
  navigation:any
) => <LeftAction dragX={progress} swipeableRef={swipeableRef} />;

interface RightActionProps {
  text: string;
  color: string;
  x: number;
  progress: SharedValue<number>;
  totalWidth: number;
  swipeableRef: React.RefObject<SwipeableMethods>;
  item:DataRow,
  navigation:any
}

const RightAction = ({
  text,
  color,
  x,
  progress,
  totalWidth,
  swipeableRef,
  item,
  navigation
}: RightActionProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, -totalWidth], [x, 0]),
      },
    ],
  }));
  const pressHandler = () => {
    swipeableRef.current?.close();
    // eslint-disable-next-line no-alert
   
    if(text === "任务设置"){
      navigation.navigate("TaskAddView",{uuid: item.uuid,title:item.from});
    }

  };

  return (
    <Animated.View style={[styles.rightActionView, animatedStyle]}>
      <RectButton
        style={[styles.rightAction, { backgroundColor: color }]}
        onPress={pressHandler}>
        <Text style={styles.actionText}>{text}</Text>
      </RectButton>
    </Animated.View>
  );
};

const renderRightActions = (
  _: any,
  progress: SharedValue<number>,
  swipeableRef: React.RefObject<SwipeableMethods>,
  item:DataRow,
  navigation:any,
) => (
  <View style={styles.rightActionsView}>
    
    <RightAction
      text="任务设置"
      color="#ffab00"
      x={128}
      progress={progress}
      totalWidth={192}
      swipeableRef={swipeableRef}
      item = {item}
      navigation = {navigation}
    />
    <RightAction
      text="事件日志"
      color="#dd2c00"
      x={64}
      progress={progress}
      totalWidth={192}
      swipeableRef={swipeableRef}
      item = {item}
      navigation = {navigation}
    />
  </View>
);

export default function AppleStyleSwipeableRow({
  item,
  children,
  navigation,
}: AppleStyleSwipeableRowProps) {
  const swipeableRow = useRef<SwipeableMethods>(null);

  return (
    <Swipeable
      ref={swipeableRow}
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      renderLeftActions={(_, progress) =>
        renderLeftActions(_, progress, swipeableRow,item,navigation)
      }
      renderRightActions={(_, progress) =>
        renderRightActions(_, progress, swipeableRow,item,navigation)
      }
      onSwipeableWillOpen={(direction) => {
        console.log(`Opening swipeable from the ${direction}`);
      }}
      onSwipeableWillClose={(direction) => {
        console.log(`Closing swipeable to the ${direction}`);
      }}>
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  archiveText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 20,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
    margin: 'auto',
  },
  rightActionView: {
    flex: 1,
  },
  rightActionsView: {
    width: 192,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
