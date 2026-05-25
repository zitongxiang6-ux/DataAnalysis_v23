export const SHIPPING_DEPARTMENTS = [
  '全球渠道部',
  '国内大客户部',
  '国际酒店部',
  '储能事业部',
  '河东电子',
];

export const SHIPPING_HIERARCHY_FILTER_OPTIONS = [
  { value: 'all', label: '全部' },
  ...SHIPPING_DEPARTMENTS.map((department) => ({
    value: ['department', department].join('|'),
    label: `部门：${department}`,
  })),
  { value: 'group|全球渠道部|国际渠道组', label: '分组：全球渠道部 / 国际渠道组' },
  { value: 'group|全球渠道部|国内渠道组', label: '分组：全球渠道部 / 国内渠道组' },
  { value: 'group|全球渠道部|ODM组', label: '分组：全球渠道部 / ODM组' },
  { value: 'area|全球渠道部|国际渠道组|维护组', label: '区域：全球渠道部 / 国际渠道组 / 维护组' },
  { value: 'area|全球渠道部|国际渠道组|发展组', label: '区域：全球渠道部 / 国际渠道组 / 发展组' },
  { value: 'area|全球渠道部|国际渠道组|开拓组', label: '区域：全球渠道部 / 国际渠道组 / 开拓组' },
  { value: 'area|全球渠道部|国内渠道组|维护组', label: '区域：全球渠道部 / 国内渠道组 / 维护组' },
  { value: 'area|全球渠道部|国内渠道组|开拓组', label: '区域：全球渠道部 / 国内渠道组 / 开拓组' },
  { value: 'area|全球渠道部|国内渠道组|地产组', label: '区域：全球渠道部 / 国内渠道组 / 地产组' },
  { value: 'area|全球渠道部|ODM组|国际ODM', label: '区域：全球渠道部 / ODM组 / 国际ODM' },
  { value: 'area|全球渠道部|ODM组|国内ODM', label: '区域：全球渠道部 / ODM组 / 国内ODM' },
];

export function matchesShippingHierarchyFilter(
  row: { dept?: string; department?: string; group?: string; area?: string },
  filterValue: string
) {
  if (filterValue === 'all') return true;

  const [level, department, group, area] = filterValue.split('|');
  const rowDepartment = row.dept ?? row.department;

  if (level === 'department') return rowDepartment === department;
  if (level === 'group') return rowDepartment === department && row.group === group;
  if (level === 'area') {
    return rowDepartment === department && row.group === group && row.area === area;
  }

  return true;
}
