import { ProfileData } from "@/types/profileData";
import {templates} from "@/registry/templateRegistry";


export default function UserProfile({ data }: { data: ProfileData }) {
  // Get the template based on selectedTemplate field
  const templateKey = data.selectedTemplate || "default";
  const TemplateComponent = templates[templateKey]?.component || templates.default.component;

  return <TemplateComponent data={data} />;
}