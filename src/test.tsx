import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import WaitingInfoDTO from '../../dto/waitingInfoDTO';

function StoreLogo({ imageUrl }: any) {
  return <Image source={{ uri: imageUrl }} style={styles.store_logo} />;
}
function StoreName({
  storeName,
  userNationality,
  t,
}: {
  storeName: string;
  userNationality: string;
  t: any;
}) {
  return (
    <Text
      style={
        userNationality === 'FOREIGNER'
          ? styles.store_title_foreigner
          : styles.store_title
      }
    >
      {t(`store.${storeName}`)} {t('waiting.WAITING')}
    </Text>
  );
}
function StoreInformation({ children }: any) {
  return <View style={styles.store_container}>{children}</View>;
}
function WaitingTeamInfo({
  waitingInfo,
  t,
}: {
  waitingInfo: WaitingInfoDTO;
  t: any;
}) {
  return (
    <View style={styles.waiting_wrapper}>
      <Text style={styles.waiting_title}>{t('waiting.TEAM ON WAITING')}</Text>
      <Text style={styles.waiting_content}>
        {waitingInfo.payload.waitingCount}
        {t('waiting.TEAM')}
      </Text>
    </View>
  );
}
function WaitingTimeInfo({
  isSetWaitingTime,
  waitingTimeMaxLimit,
  waitingInfo,
  t,
}: {
  isSetWaitingTime: boolean;
  waitingTimeMaxLimit: number;
  waitingInfo: WaitingInfoDTO;
  t: any;
}) {
  if (!isSetWaitingTime) {
    return;
  }

  return (
    <View style={styles.waiting_wrapper}>
      <Text style={styles.waiting_title}>{t('waiting.WAITING TIME')}</Text>
      <Text style={styles.waiting_content}>
        {waitingInfo.payload.waitingTime}
        {t('waiting.MIN')}
        {+waitingInfo.payload.waitingTime === waitingTimeMaxLimit && '+'}
      </Text>
    </View>
  );
}
function WaitingInformation({ children }: any) {
  return <View style={styles.waiting_container}>{children}</View>;
}

/**
 * 대기열 관련 정보를 유저에게 보여줍니다.
 */
export default function WaitingInfo({
  children,
  userNationality,
}: {
  children: any;
  userNationality: string;
}) {
  return (
    <View
      style={
        userNationality === 'FOREIGNER'
          ? styles.container_foreigner
          : styles.container
      }
    >
      {children}
    </View>
  );
}

WaitingInfo.StoreLogo = StoreLogo;
WaitingInfo.StoreName = StoreName;
WaitingInfo.StoreInformation = StoreInformation;
WaitingInfo.WaitingTeamInfo = WaitingTeamInfo;
WaitingInfo.WaitingTimeInfo = WaitingTimeInfo;
WaitingInfo.WaitingInformation = WaitingInformation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: 401,
    height: 304,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  container_foreigner: {
    flexDirection: 'column',
    width: 401,
    height: 304,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  store_container: {
    flexDirection: 'column',
    height: 304,
    width: 400,
    alignItems: 'center',
    gap: 40,
  },
  store_logo: {
    width: 200,
    height: 174.605,
  },
  store_title: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Pretendard',
    fontSize: 40,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 52.8,
    width: 520,
  },
  store_title_foreigner: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Pretendard',
    fontSize: 40,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 52.8,
    width: 520,
  },
  waiting_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
  },
  waiting_wrapper: {
    flexDirection: 'column',
    width: 'auto',
    alignItems: 'center',
  },
  waiting_title: {
    color: '#000',
    fontFamily: 'Pretendard',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 32,
  },
  waiting_content: {
    color: '#000',
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 64,
  },
});
