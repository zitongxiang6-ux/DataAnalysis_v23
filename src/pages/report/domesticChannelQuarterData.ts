export type DomesticChannelQuarterRow = {
  name: string;
  dept: string;
  target: string;
  done: string;
  rate: string;
  status: '已达成' | '冲刺中' | '存在风险';
};

export const domesticChannelQuarterRows: DomesticChannelQuarterRow[] = [
  { name: '深圳华强科技', dept: '全球渠道部', target: '¥4,500万', done: '¥5,680万', rate: '126.2%', status: '已达成' },
  { name: '上海新联电子', dept: '全球渠道部', target: '¥3,800万', done: '¥4,256万', rate: '112.0%', status: '已达成' },
  { name: '北京中科创新', dept: '国内大客户部', target: '¥2,600万', done: '¥2,845万', rate: '109.4%', status: '已达成' },
  { name: '杭州智联网络', dept: '全球渠道部', target: '¥2,200万', done: '¥2,120万', rate: '96.4%', status: '冲刺中' },
  { name: '成都西部电子', dept: '国内大客户部', target: '¥1,800万', done: '¥1,520万', rate: '84.4%', status: '存在风险' },
  { name: '南京瑞景集团', dept: '国内重点渠道部', target: '¥1,650万', done: '¥1,520万', rate: '92.1%', status: '冲刺中' },
  { name: '青岛海联智能', dept: '全球渠道部', target: '¥1,520万', done: '¥1,392万', rate: '91.6%', status: '冲刺中' },
  { name: '厦门海沧科技', dept: '全球渠道部', target: '¥1,480万', done: '¥1,268万', rate: '85.7%', status: '存在风险' },
  { name: '天津云谷电子', dept: '国内重点渠道部', target: '¥1,420万', done: '¥1,210万', rate: '85.2%', status: '存在风险' },
  { name: '西安宏图科技', dept: '国内大客户部', target: '¥1,360万', done: '¥1,184万', rate: '87.1%', status: '冲刺中' },
  { name: '泉州海翼智能', dept: '全球渠道部', target: '¥1,200万', done: '¥1,058万', rate: '88.2%', status: '冲刺中' },
  { name: '东莞精密制造', dept: '国内重点渠道部', target: '¥1,100万', done: '¥812万', rate: '73.8%', status: '存在风险' },
  { name: '佛山德联电子', dept: '全球渠道部', target: '¥980万', done: '¥930万', rate: '94.9%', status: '冲刺中' },
  { name: '宁波华创设备', dept: '国内大客户部', target: '¥920万', done: '¥865万', rate: '94.0%', status: '冲刺中' },
  { name: '合肥科锐系统', dept: '国内重点渠道部', target: '¥860万', done: '¥628万', rate: '73.0%', status: '存在风险' },
];
