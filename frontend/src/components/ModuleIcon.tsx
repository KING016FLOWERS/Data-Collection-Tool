import {
  Award, Building2, ChartNoAxesCombined, Cloud, Droplets, Factory, FileSignature,
  FlaskConical, FolderOpen, HardHat, MapPinned, Recycle, Scale, Target,
  TriangleAlert, Users, Wind, Zap
} from "lucide-react";

const icons = {
  building: Building2,
  scale: Scale,
  factory: Factory,
  "map-pin": MapPinned,
  zap: Zap,
  cloud: Cloud,
  droplets: Droplets,
  flask: FlaskConical,
  recycle: Recycle,
  wind: Wind,
  "hard-hat": HardHat,
  users: Users,
  award: Award,
  "file-signature": FileSignature,
  "triangle-alert": TriangleAlert,
  target: Target,
  "folder-open": FolderOpen,
  "chart-line": ChartNoAxesCombined,
} as const;

export function ModuleIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons] ?? Target;
  return <Icon className={className} strokeWidth={2} />;
}
