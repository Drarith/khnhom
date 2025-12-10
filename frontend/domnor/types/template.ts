export type TemplateType = 'default' | 'brutalist';

export interface TemplateConfig {
  name: string;
  component: React.ComponentType<{ data: ProfileData }>;
  preview?: string;
}