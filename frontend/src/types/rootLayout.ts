export type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export type Locale = { locale: "en" | "kh" };
