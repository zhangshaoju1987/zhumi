import React from 'react';
import { StyleSheet, Text, View, I18nManager } from 'react-native';

import { FlatList, RectButton } from 'react-native-gesture-handler';

import AppleStyleSwipeableRow from './AppleStyleSwipeableRow';
import GmailStyleSwipeableRow from './GmailStyleSwipeableRow';

//  To toggle LTR/RTL change to `true`
I18nManager.allowRTL(false);

export type DataRow = {
  uuid:string;
  from: string;
  when: string;
  message: string;
};

const Row = ({ item }: { item: DataRow }) => (
  // eslint-disable-next-line no-alert
  <RectButton style={styles.rectButton} onPress={() => window.alert(item.from)}>
    <Text style={styles.fromText}>{item.from}</Text>
    <Text numberOfLines={2} style={styles.messageText}>
      {item.message}
    </Text>
    <Text style={styles.dateText}>{item.when} ❭</Text>
  </RectButton>
);

const SwipeableRow = ({ item, index,navigation }: { item: DataRow; index: number,navigation: any }) => {
  return (
    <AppleStyleSwipeableRow item={item} navigation={navigation}>
      <Row item={item} />
    </AppleStyleSwipeableRow>
  );
};

const Separator = () => <View style={styles.separator} />;

export default function App(props:any) {
  return (
    <FlatList
      data={DATA}
      ItemSeparatorComponent={Separator}
      renderItem={({ item, index }) => (
        <SwipeableRow item={item} index={index} navigation={props.navigation}/>
      )}
      keyExtractor={(_item, index) => `message ${index}`}
    />
  );
}

const styles = StyleSheet.create({
  rectButton: {
    flex: 1,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  fromText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  messageText: {
    color: '#999',
    backgroundColor: 'transparent',
  },
  dateText: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 20,
    top: 10,
    color: '#999',
    fontWeight: 'bold',
  },
});

const DATA: DataRow[] = [
  {
    uuid:"123",
    from: "民生大厦上班提醒",
    when: '2024-10-21 21:08:09',
    message:'早上提醒上班打开，晚上提醒下班签退',
  },
  {
    uuid:"124",
    from: "潮汕牛肉店",
    when: '2024-10-11 21:08:09',
    message:'探店吃牛肉',
  }
];
