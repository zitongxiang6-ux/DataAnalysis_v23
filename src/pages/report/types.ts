export type ReportType = 'weekly' | 'monthly' | 'quarterly';
export type ReportLevel = 'company' | 'department' | 'group';
export type ReportScope =
  | 'company'
  | 'global_channel'
  | 'domestic_key_account'
  | 'international_hotel'
  | 'international_channel_group'
  | 'domestic_channel_group'
  | 'odm_group';
export type ReportStatus = 'completed' | 'processing' | 'pending';

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  level?: ReportLevel;
  scope: ReportScope;
  period: string;
  generatedAt: string;
  updatedAt?: string;
  status: ReportStatus;
  fileSize: string;
}

export interface ReportVersion {
  version: string;
  generatedAt: string;
  fileSize: string;
  period: string;
}

export interface RankingItem {
  rank: number;
  name: string;
  amount: number;
  target: number;
  completion: number;
  change: number;
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  selected: boolean;
}
