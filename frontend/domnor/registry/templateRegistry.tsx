import { TemplateConfig } from "@/types/template";
import DefaultTemplate from "../components/templates/DefaultTemplate";
import BrutalistTemplate from "../components/templates/BrutalistTemplate";
import RetroTemplate from "../components/templates/RetroTemplate";
import MinimalismTemplate from "../components/templates/MinimalismTemplate";
import GlassmorphismTemplate from "../components/templates/GlassmorphismTemplate";
import EditorialTemplate from "../components/templates/EditorialTemplate";
import NeobrutalismTemplate from "../components/templates/NeobrutalismTemplate";
import KhmerRoyalTemplate from "../components/templates/KhmerRoyalTemplate";

export const templates: Record<string, TemplateConfig> = {
  default: {
    name: "Default",
    component: DefaultTemplate,
  },
  brutalist: {
    name: "Brutalist",
    component: BrutalistTemplate,
  },
  retro: {
    name: "Retro",
    component: RetroTemplate,
  },
  minimalism: {
    name: "Minimalism",
    component: MinimalismTemplate,
  },
  glassmorphism: {
    name: "Glassmorphism",
    component: GlassmorphismTemplate,
  },
  editorial: {
    name: "Editorial",
    component: EditorialTemplate,
  },
  neobrutalism: {
    name: "Neobrutalism",
    component: NeobrutalismTemplate,
  },
  khmerroyal: {
    name: "Khmer Royal",
    component: KhmerRoyalTemplate,
  },
};