export const mapRegionToCord = (geojson) =>
  geojson.features.reduce((acc, cur) => {
    acc[cur.properties.name] = cur.properties.cp;
    return acc;
  }, {});

export const getRegionNameList = (geojson) =>
  geojson.features.map(({ properties }) => properties.name);

export const REGION_MAP = {
  '010': 'beijing',
  '021': 'shanghai',
  '022': 'tianjin',
  '023': 'chongqing',
  '031': 'hebei',
  '035': 'shanxi',
  '037': 'henan',
  '041': 'liaoning',
  '043': 'jilin',
  '045': 'heilongjiang',
  '047': 'neimenggu',
  '051': 'jiangsu',
  '053': 'shandong',
  '055': 'anhui',
  '057': 'zhejiang',
  '059': 'fujian',
  '071': 'hubei',
  '073': 'hunan',
  '075': 'guangdong',
  '077': 'guangxi',
  '079': 'jiangxi',
  '080': 'xizang',
  '081': 'sichuan',
  '085': 'guizhou',
  '087': 'yunnan',
  '089': 'hainan',
  '091': 'shanxi1',
  '093': 'gansu',
  '095': 'ningxia',
  '097': 'qinghai',
  '099': 'xinjiang',
  852: 'xianggang',
  853: 'aomen',
  886: 'taiwan',
};
