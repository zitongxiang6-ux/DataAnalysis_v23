export type KeyChannelDealerScope = 'domestic' | 'international';

export type KeyChannelDealerRow = {
  name: string;
  current: string;
  previous: string;
  mom: number;
  lastYear: string;
  yoy: number;
  total: string;
  trend: string;
};

export const keyChannelDealerGroups: Record<KeyChannelDealerScope, KeyChannelDealerRow[]> = {
  domestic: [
    { name: '深圳华强科技', current: '¥1,856万', previous: '¥1,612万', mom: 15.2, lastYear: '¥1,520万', yoy: 22.1, total: '¥8,420万', trend: '持续领跑' },
    { name: '上海新联电子', current: '¥1,425万', previous: '¥1,266万', mom: 12.6, lastYear: '¥1,210万', yoy: 17.8, total: '¥6,880万', trend: '稳健增长' },
    { name: '北京中科创新', current: '¥856万', previous: '¥776万', mom: 10.3, lastYear: '¥720万', yoy: 18.9, total: '¥4,260万', trend: '重点突破' },
    { name: '广州恒通科技', current: '¥698万', previous: '¥644万', mom: 8.4, lastYear: '¥620万', yoy: 12.6, total: '¥3,410万', trend: '稳步提升' },
    { name: '南京瑞景集团', current: '¥568万', previous: '¥525万', mom: 8.1, lastYear: '¥496万', yoy: 14.5, total: '¥2,960万', trend: '稳定贡献' },
    { name: '青岛海联智能', current: '¥486万', previous: '¥452万', mom: 7.6, lastYear: '¥438万', yoy: 11.0, total: '¥2,540万', trend: '稳健增长' },
    { name: '厦门海沧科技', current: '¥405万', previous: '¥383万', mom: 5.8, lastYear: '¥368万', yoy: 10.1, total: '¥2,130万', trend: '稳中有升' },
    { name: '天津云谷电子', current: '¥365万', previous: '¥355万', mom: 2.9, lastYear: '¥350万', yoy: 4.3, total: '¥1,890万', trend: '增长放缓' },
    { name: '西安宏图科技', current: '¥305万', previous: '¥292万', mom: 4.6, lastYear: '¥278万', yoy: 9.7, total: '¥1,650万', trend: '稳步推进' },
    { name: '泉州海翼智能', current: '¥202万', previous: '¥194万', mom: 4.1, lastYear: '¥190万', yoy: 6.3, total: '¥1,120万', trend: '小幅增长' },
    { name: '无锡联创科技', current: '¥176万', previous: '¥167万', mom: 5.7, lastYear: '¥158万', yoy: 11.4, total: '¥980万', trend: '恢复增长' },
    { name: '东莞精密制造', current: '¥185万', previous: '¥227万', mom: -18.6, lastYear: '¥520万', yoy: -64.4, total: '¥620万', trend: '重点预警' },
  ],
  international: [
    { name: '新加坡AsiaTech', current: '¥985万', previous: '¥804万', mom: 22.5, lastYear: '¥756万', yoy: 30.3, total: '¥4,520万', trend: '高速增长' },
    { name: '迪拜GulfBuild', current: '¥386万', previous: '¥332万', mom: 16.4, lastYear: '¥298万', yoy: 29.5, total: '¥1,860万', trend: '重点突破' },
    { name: '越南VinaTech', current: '¥215万', previous: '¥182万', mom: 18.1, lastYear: '¥166万', yoy: 29.5, total: '¥1,120万', trend: '快速增长' },
    { name: '马来西亚MegaHome', current: '¥286万', previous: '¥252万', mom: 13.7, lastYear: '¥232万', yoy: 23.3, total: '¥1,420万', trend: '稳定提升' },
    { name: '泰国BangkokHome', current: '¥162万', previous: '¥144万', mom: 12.8, lastYear: '¥130万', yoy: 24.6, total: '¥850万', trend: '持续培育' },
    { name: '印尼JakartaBuild', current: '¥148万', previous: '¥132万', mom: 12.1, lastYear: '¥118万', yoy: 25.4, total: '¥760万', trend: '增长稳定' },
    { name: '菲律宾ManilaTech', current: '¥136万', previous: '¥121万', mom: 12.4, lastYear: '¥105万', yoy: 29.5, total: '¥690万', trend: '快速拉升' },
    { name: '日本TokyoLiving', current: '¥128万', previous: '¥119万', mom: 7.6, lastYear: '¥112万', yoy: 14.3, total: '¥620万', trend: '稳步增长' },
    { name: '韩国SeoulSpace', current: '¥116万', previous: '¥108万', mom: 7.4, lastYear: '¥101万', yoy: 14.9, total: '¥590万', trend: '稳定贡献' },
    { name: '澳洲SydneyHome', current: '¥105万', previous: '¥96万', mom: 9.4, lastYear: '¥88万', yoy: 19.3, total: '¥510万', trend: '较快增长' },
    { name: '德国BerlinBuild', current: '¥92万', previous: '¥84万', mom: 9.5, lastYear: '¥78万', yoy: 17.9, total: '¥430万', trend: '新兴增长' },
    { name: '法国ParisMaison', current: '¥86万', previous: '¥79万', mom: 8.9, lastYear: '¥72万', yoy: 19.4, total: '¥398万', trend: '培育增长' },
  ],
};
