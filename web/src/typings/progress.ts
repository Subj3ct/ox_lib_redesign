import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface CircleProgressbarProps {
  label?: string;
  duration: number;
  position?: 'middle' | 'bottom';
  percent?: boolean;
}

export interface ProgressbarProps {
  label: string;
  duration: number;
  icon?: IconProp;
}
