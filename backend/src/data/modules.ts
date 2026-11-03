export type SustainabilityModule = {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
};

export const modules: SustainabilityModule[] = [
  { id: "01", title: "Organisation, Governance & Policy", description: "Corporate governance, ethics and policy framework.", icon: "building", color: "#475569" },
  { id: "02", title: "Legal & Regulatory Compliance", description: "Statutory compliance, permits and regulatory reporting.", icon: "scale", color: "#0891b2" },
  { id: "03", title: "Production, Process & Operational Baseline", description: "Manufacturing process baseline and operational KPIs.", icon: "factory", color: "#65a30d" },
  { id: "04", title: "Raw Material Traceability & Supplier Origin", description: "Track materials from source and chain of custody.", icon: "map-pin", color: "#0f766e" },
  { id: "05", title: "Energy Management & Utilities", description: "Energy consumption and utility monitoring.", icon: "zap", color: "#ca8a04" },
  { id: "06", title: "Carbon Footprint & GHG Inventory", description: "GHG emissions accounting and reduction targets.", icon: "cloud", color: "#4f46e5" },
  { id: "07", title: "Water, Wastewater, ZLD & CETP", description: "Water management and wastewater treatment.", icon: "droplets", color: "#0284c7" },
  { id: "08", title: "Chemical Management & Restricted Substances", description: "Chemical inventory and safe handling procedures.", icon: "flask", color: "#7c3aed" },
  { id: "09", title: "Solid Waste, Hazardous Waste & Circularity", description: "Waste segregation and circular economy practices.", icon: "recycle", color: "#16a34a" },
  { id: "10", title: "Air Emissions, Odour, Noise & Local Environment", description: "Stack emissions and community impact tracking.", icon: "wind", color: "#0f766e" },
  { id: "11", title: "Occupational Health & Safety", description: "Worker safety and occupational health programs.", icon: "hard-hat", color: "#dc2626" },
  { id: "12", title: "Human Resources, Labour & Social Compliance", description: "HR policies and social accountability standards.", icon: "users", color: "#db2777" },
  { id: "13", title: "Product Quality, Safety & Customer Compliance", description: "Quality control and customer requirement compliance.", icon: "award", color: "#2563eb" },
  { id: "14", title: "Procurement, Suppliers & Contractors", description: "Sustainable procurement and supplier audits.", icon: "file-signature", color: "#ea580c" },
  { id: "15", title: "Risk, Opportunity & Materiality", description: "Enterprise risk assessment and opportunity mapping.", icon: "triangle-alert", color: "#d97706" },
  { id: "16", title: "Objectives, Targets, KPIs & Sustainability Index", description: "Goal setting and sustainability performance index.", icon: "target", color: "#059669" },
  { id: "17", title: "Evidence Repository & Audit Trail", description: "Document management and audit trail tracking.", icon: "folder-open", color: "#6366f1" },
  { id: "18", title: "Gap Analysis, CAPA & Continual Improvement", description: "Gap identification and corrective action tracking.", icon: "chart-line", color: "#0d9488" }
];
