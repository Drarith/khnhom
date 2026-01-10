export interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}
