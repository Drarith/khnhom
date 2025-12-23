export type TemplateType = 'default' | 'brutalist' | 'retro' | 'minimalism' | 'glassmorphism' | 'editorial' | 'neobrutalism' | 'khmerroyal';

export interface TemplateConfig {
  name: string;
  component: React.ComponentType<{ data: ProfileData }>;
  preview?: string;
}