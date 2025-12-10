import { TemplateConfig } from "@/types/templates";
import DefaultTemplate from "../components/templates/DefaultTemplate";
import BrutalistTemplate from "../components/templates/BrutalistTemplate";

export const templates: Record<string, TemplateConfig> = {
  default: {
    name: "Default",
    component: DefaultTemplate,
  },
  brutalist: {
    name: "Brutalist",
    component: BrutalistTemplate,
  },
};