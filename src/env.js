import Constants from 'expo-constants';

export const ENABLE_DEV_FEATURE = false;

const testID = 'ca-app-pub-3940256099942544/6300978111';
const productionID = 'ca-app-pub-6703738510499216~3416570758';
// eslint-disable-next-line no-undef
export const AD_UNIT_ID = Constants.isDevice && !__DEV__ ? productionID : testID;
