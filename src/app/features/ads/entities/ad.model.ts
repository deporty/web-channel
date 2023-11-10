export type Breakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type StatusAd = 'active' | 'completed';
export enum BreakpointsEnum {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}
export type AdBreakpoint = Record<Breakpoints, string>;
export interface IAdModel {
  id: string;
  adBreakpoint: AdBreakpoint;
  defaultAd: Breakpoints;
  link?: string;
  status: StatusAd;
  title: string;
  counterClicks: number;
}
