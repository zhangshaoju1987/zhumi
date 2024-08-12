import { DefaultTheme } from 'react-native-paper';

// 解决文本框莫名其妙白屏的问题
const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3498db',
      accent: '#f1c40f',
    },
    webThemes: [
      {
        color: '#5AA4AE',
        name: '天水碧'
      },
      {
        color: '#4F794A',
        name: '芰荷'
      },
      {
        color: '#B37745',
        name: '琵琶荷'
      },
      {
        color: '#2775B6',
        name: '景泰蓝'
      },
      {
        color: '#87C0CA',
        name: '西子'
      },
      {
        color: '#EAE5E3',
        name: '玉瓶子'
      },
      {
        color: '#F8BC31',
        name: '杏黄'
      },
      {
        color: '#E2C2CF',
        name: '藕荷'
      },
      {
        color: '#71779B',
        name: '花青'
      }
    ]
  
  };

  export default theme;