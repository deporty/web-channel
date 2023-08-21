export interface GeneralAction {
  identifier: string;
  handler: (data?: any) => void;
  icon: string;
  display?: string;
  background: string;
  color: string;
  borderColor?: string;
  enable: (data: any) => boolean;
}

export interface MetaData {
  code: string;
  message: string;
}
