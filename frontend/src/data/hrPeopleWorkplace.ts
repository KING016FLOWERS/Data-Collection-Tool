/**
 * Department User Module 12 – People & Workplace, Version 1.0.
 * Source: Leather_Nexus_Common_Evidence_Database_People_Workplace(1).pdf
 * Section titles A–P and 186 permanent PW-* field IDs are preserved.
 * These are READ-ONLY field previews. No responses are persisted yet.
 */
export type HRField = {
  id: string;
  question: string;
  inputType: string;
  requirement: "M" | "C" | "O";
  privacy: "P0" | "P1" | "P2" | "P3";
  evidence: string;
  frequency: string;
  risk: "Standard" | "Major" | "Critical";
  sourcePage: number;
};

export type HRSection = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  theme: string;
  fields: HRField[];
};

export const hrPeopleSections: HRSection[] = [
  {
    "id": "A",
    "slug": "A",
    "title": "Facility & Workforce Profile",
    "description": "Legal entity, workforce demographics, shifts and welfare facilities",
    "icon": "users",
    "theme": "sky",
    "fields": [
      {
        "id": "PW-A001",
        "sourcePage": 3,
        "question": "Legal entity / facility name",
        "inputType": "Text",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Business registration / site profile",
        "frequency": "Annual",
        "risk": "Standard"
      },
      {
        "id": "PW-A002",
        "sourcePage": 3,
        "question": "Facility address and operating location",
        "inputType": "Text",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Registration / licence",
        "frequency": "Annual",
        "risk": "Standard"
      },
      {
        "id": "PW-A003",
        "sourcePage": 3,
        "question": "HR contact / responsible function",
        "inputType": "Text/Role",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Organisation chart / responsibility matrix",
        "frequency": "On change",
        "risk": "Standard"
      },
      {
        "id": "PW-A004",
        "sourcePage": 3,
        "question": "Total workforce – current headcount",
        "inputType": "Number",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "HR master / payroll summary",
        "frequency": "Monthly",
        "risk": "Major"
      },
      {
        "id": "PW-A005",
        "sourcePage": 3,
        "question": "Workforce by employment type: permanent / fixed-term / temporary / casual",
        "inputType": "Numeric split",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "HR master / contracts",
        "frequency": "Monthly",
        "risk": "Major"
      },
      {
        "id": "PW-A006",
        "sourcePage": 3,
        "question": "Contract / agency labour headcount",
        "inputType": "Number",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Contractor roster / invoices / attendance",
        "frequency": "Monthly",
        "risk": "Major"
      },
      {
        "id": "PW-A007",
        "sourcePage": 3,
        "question": "Migrant / inter-state / foreign worker headcount (aggregate only)",
        "inputType": "Number",
        "requirement": "C",
        "privacy": "P0",
        "evidence": "Aggregated HR record; permits where applicable",
        "frequency": "Quarterly",
        "risk": "Major"
      },
      {
        "id": "PW-A008",
        "sourcePage": 3,
        "question": "Young worker headcount (legal working age but under 18), if any",
        "inputType": "Number",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Age-verification register (no ID upload by default)",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-A009",
        "sourcePage": 3,
        "question": "Gender distribution (aggregate; voluntary/legally permissible categories)",
        "inputType": "Numeric split",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "Aggregated HR data",
        "frequency": "Quarterly",
        "risk": "Standard"
      },
      {
        "id": "PW-A010",
        "sourcePage": 3,
        "question": "Workers with disabilities – aggregate, where voluntarily disclosed / legally permitted",
        "inputType": "Number",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "Aggregated HR data / accommodation records",
        "frequency": "Quarterly",
        "risk": "Standard"
      },
      {
        "id": "PW-A011",
        "sourcePage": 3,
        "question": "Number of shifts and normal shift timings",
        "inputType": "Structured text",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Shift roster / standing orders",
        "frequency": "Annual/on change",
        "risk": "Major"
      },
      {
        "id": "PW-A012",
        "sourcePage": 3,
        "question": "Peak-season / seasonal workforce pattern",
        "inputType": "Text + numbers",
        "requirement": "C",
        "privacy": "P0",
        "evidence": "Production / manpower plan",
        "frequency": "Seasonal",
        "risk": "Major"
      },
      {
        "id": "PW-A013",
        "sourcePage": 3,
        "question": "Worker accommodation / dormitory provided?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Facility profile",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-A014",
        "sourcePage": 3,
        "question": "Canteen / transport / childcare / welfare facilities provided?",
        "inputType": "Multi-select",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Facility profile / service contracts",
        "frequency": "Annual",
        "risk": "Standard"
      },
      {
        "id": "PW-A015",
        "sourcePage": 3,
        "question": "Subcontracted processes involving labour outside the facility?",
        "inputType": "Yes/No + details",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Supplier/subcontractor register",
        "frequency": "Quarterly",
        "risk": "Major"
      }
    ]
  },
  {
    "id": "B",
    "slug": "B",
    "title": "HR Governance, Policies & Legal Compliance",
    "description": "HR policies, responsibilities and statutory requirements",
    "icon": "book",
    "theme": "emerald",
    "fields": [
      {
        "id": "PW-B001",
        "sourcePage": 3,
        "question": "Approved HR / people policy or HR manual available?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Controlled HR manual / policy",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-B002",
        "sourcePage": 3,
        "question": "Defined HR roles, authorities and accountability?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Organisation chart / job descriptions / RACI",
        "frequency": "Annual/on change",
        "risk": "Major"
      },
      {
        "id": "PW-B003",
        "sourcePage": 4,
        "question": "Register of applicable labour, employment, wage, social-security and workplace laws maintained?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Legal register / compliance calendar",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-B004",
        "sourcePage": 4,
        "question": "Statutory licences / registrations / notices current?",
        "inputType": "Status + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Applicable licences / registrations",
        "frequency": "On renewal",
        "risk": "Critical"
      },
      {
        "id": "PW-B005",
        "sourcePage": 4,
        "question": "Written code of conduct / business ethics expectations communicated to workers?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Code + communication record",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-B006",
        "sourcePage": 4,
        "question": "Policy prohibiting child labour and protecting young workers?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Policy / procedure",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-B007",
        "sourcePage": 4,
        "question": "Policy prohibiting forced labour, bonded labour, trafficking and recruitment fees?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Policy / recruitment standard",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-B008",
        "sourcePage": 4,
        "question": "Equal opportunity / non-discrimination / anti-harassment policy?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Policy / POSH or equivalent procedure",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-B009",
        "sourcePage": 4,
        "question": "Freedom of association / collective bargaining policy or commitment?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Policy / worker communication",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-B010",
        "sourcePage": 4,
        "question": "Working hours, overtime and leave policy?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Policy / standing orders",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-B011",
        "sourcePage": 4,
        "question": "Wages, benefits and deduction policy?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Payroll policy / wage rules",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-B012",
        "sourcePage": 4,
        "question": "Disciplinary and termination procedure based on due process?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Procedure / standing orders",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-B013",
        "sourcePage": 4,
        "question": "Grievance / complaint / whistleblowing procedure?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Procedure + channels",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-B014",
        "sourcePage": 4,
        "question": "Worker personal-data privacy / retention / access rules?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Privacy policy / data retention schedule",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-B015",
        "sourcePage": 4,
        "question": "Periodic internal review of HR/social-compliance risks and legal changes?",
        "inputType": "Yes/No + Record",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Risk assessment / legal review minutes",
        "frequency": "Quarterly/annual",
        "risk": "Major"
      }
    ]
  },
  {
    "id": "C",
    "slug": "C",
    "title": "Recruitment, Hiring, Age & Employment Eligibility",
    "description": "Fair recruitment, age controls and hiring eligibility",
    "icon": "userplus",
    "theme": "amber",
    "fields": [
      {
        "id": "PW-C001",
        "sourcePage": 4,
        "question": "Documented recruitment and hiring procedure?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Recruitment procedure",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-C002",
        "sourcePage": 4,
        "question": "Minimum-age verification performed before employment?",
        "inputType": "Yes/No + Control",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Age-verification procedure; sampled proof verified, not centrally uploaded",
        "frequency": "Per hire",
        "risk": "Critical"
      },
      {
        "id": "PW-C003",
        "sourcePage": 4,
        "question": "Any worker below legal minimum working age identified?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Age-verification audit result",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-C004",
        "sourcePage": 4,
        "question": "Child-labour remediation procedure available if a case is found?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Remediation procedure / partner arrangements",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-C005",
        "sourcePage": 4,
        "question": "Young-worker protections defined (hours, hazardous work, night work, education)?",
        "inputType": "Yes/No + Upload",
        "requirement": "C",
        "privacy": "P1",
        "evidence": "Young-worker risk assessment / register",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-C006",
        "sourcePage": 4,
        "question": "Workers are recruited without deposits, security payments or prohibited fees?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Worker interviews / recruitment records / agency contract",
        "frequency": "Per recruitment cycle",
        "risk": "Critical"
      },
      {
        "id": "PW-C007",
        "sourcePage": 4,
        "question": "Original identity/travel documents remain with workers except lawful voluntary safekeeping?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Worker interviews / policy",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-C008",
        "sourcePage": 4,
        "question": "Recruitment agencies / labour contractors approved and legally licensed?",
        "inputType": "Yes/No + Upload",
        "requirement": "C",
        "privacy": "P1",
        "evidence": "Agency licence / due-diligence record / contract",
        "frequency": "On onboarding/annual",
        "risk": "Critical"
      },
      {
        "id": "PW-C009",
        "sourcePage": 5,
        "question": "Agency contracts prohibit worker-paid recruitment fees and rights violations?",
        "inputType": "Yes/No + Upload",
        "requirement": "C",
        "privacy": "P1",
        "evidence": "Agency agreement",
        "frequency": "On contract renewal",
        "risk": "Critical"
      },
      {
        "id": "PW-C010",
        "sourcePage": 5,
        "question": "Right-to-work / employment eligibility verified as legally required?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Verification control record; no unnecessary ID copies",
        "frequency": "Per hire",
        "risk": "Critical"
      },
      {
        "id": "PW-C011",
        "sourcePage": 5,
        "question": "Job vacancy / selection criteria are non-discriminatory?",
        "inputType": "Yes/No + Sample",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Job advertisements / interview forms",
        "frequency": "Per hiring cycle",
        "risk": "Major"
      },
      {
        "id": "PW-C012",
        "sourcePage": 5,
        "question": "Employment terms explained in a language workers understand before starting work?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Induction / signed acknowledgement / worker interview",
        "frequency": "Per hire",
        "risk": "Major"
      }
    ]
  },
  {
    "id": "D",
    "slug": "D",
    "title": "Employment Terms, Contracts & Forced-Labour Safeguards",
    "description": "Contracts, employment conditions and forced-labour prevention",
    "icon": "shield",
    "theme": "cyan",
    "fields": [
      {
        "id": "PW-D001",
        "sourcePage": 5,
        "question": "Written employment contract / appointment letter provided where legally required?",
        "inputType": "Yes/No + Sample",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Contract sample / issuance register",
        "frequency": "Per hire",
        "risk": "Critical"
      },
      {
        "id": "PW-D002",
        "sourcePage": 5,
        "question": "Contracts state job, wage, hours, benefits and key terms clearly?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Contract template / worker interview",
        "frequency": "Annual + sample",
        "risk": "Major"
      },
      {
        "id": "PW-D003",
        "sourcePage": 5,
        "question": "Workers receive a copy of their contract / terms?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Acknowledgement / worker interviews",
        "frequency": "Per hire",
        "risk": "Major"
      },
      {
        "id": "PW-D004",
        "sourcePage": 5,
        "question": "No blank papers, resignation letters, promissory notes or coercive documents signed as employment condition?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Worker interviews / HR audit",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-D005",
        "sourcePage": 5,
        "question": "Workers are free to leave workplace / accommodation outside working hours subject only to lawful safety controls?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Rules / interviews / access control review",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-D006",
        "sourcePage": 5,
        "question": "Workers may terminate employment with legally permitted notice and without unlawful financial penalty?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Termination policy / sampled settlements",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-D007",
        "sourcePage": 5,
        "question": "No involuntary overtime / coercion / threats associated with overtime refusal?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Overtime consent / interviews",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-D008",
        "sourcePage": 5,
        "question": "No prison, bonded, indentured or trafficked labour used?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Due-diligence statement / interviews",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-D009",
        "sourcePage": 5,
        "question": "Employment status is not misclassified to avoid legal obligations?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Contracts / payroll / contractor arrangements",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-D010",
        "sourcePage": 5,
        "question": "Homeworkers / off-site workers, if used, are formally identified and covered by equivalent labour protections?",
        "inputType": "Yes/No + Details",
        "requirement": "C",
        "privacy": "P1",
        "evidence": "Homeworker register / contracts / due diligence",
        "frequency": "Quarterly",
        "risk": "Major"
      }
    ]
  },
  {
    "id": "E",
    "slug": "E",
    "title": "Working Hours, Overtime, Rest & Leave",
    "description": "Working-time records, overtime, rest and leave",
    "icon": "clock",
    "theme": "indigo",
    "fields": [
      {
        "id": "PW-E001",
        "sourcePage": 5,
        "question": "Normal working hours per day and per week",
        "inputType": "Number",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Attendance system / work rules",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-E002",
        "sourcePage": 5,
        "question": "Maximum actual weekly hours observed in latest 3 months",
        "inputType": "Number",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Time records / payroll cross-check",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-E003",
        "sourcePage": 5,
        "question": "Overtime hours separately captured and approved?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Attendance / OT approval records",
        "frequency": "Monthly",
        "risk": "Major"
      },
      {
        "id": "PW-E004",
        "sourcePage": 5,
        "question": "Overtime is voluntary except where law/CBA permits otherwise?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Consent / worker interviews",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-E005",
        "sourcePage": 5,
        "question": "Workers receive legally required weekly rest days?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Attendance / shift roster",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-E006",
        "sourcePage": 5,
        "question": "Meal and rest breaks comply with law / policy?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Shift rules / attendance / interviews",
        "frequency": "Monthly",
        "risk": "Major"
      },
      {
        "id": "PW-E007",
        "sourcePage": 5,
        "question": "Annual / earned leave entitlement and utilisation tracked?",
        "inputType": "Yes/No + Numbers",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Leave register / balance report",
        "frequency": "Monthly",
        "risk": "Major"
      },
      {
        "id": "PW-E008",
        "sourcePage": 6,
        "question": "Sick / medical leave provided as legally required?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Leave policy / aggregate records",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-E009",
        "sourcePage": 6,
        "question": "Maternity / parental / statutory family leave provided as applicable?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Policy / aggregate usage",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-E010",
        "sourcePage": 6,
        "question": "Public / national holidays and compensatory arrangements compliant?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Holiday list / payroll",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-E011",
        "sourcePage": 6,
        "question": "Time records accurately reflect hours worked; no off-the-clock work?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Time/payroll reconciliation / interviews",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-E012",
        "sourcePage": 6,
        "question": "Working-hour exceptions are documented, lawful, time-bound and risk assessed?",
        "inputType": "Yes/No + Upload",
        "requirement": "C",
        "privacy": "P1",
        "evidence": "Approval / legal basis / risk assessment",
        "frequency": "Per exception",
        "risk": "Critical"
      }
    ]
  },
  {
    "id": "F",
    "slug": "F",
    "title": "Wages, Benefits, Social Security & Payroll Integrity",
    "description": "Fair pay, benefits and payroll controls",
    "icon": "wallet",
    "theme": "rose",
    "fields": [
      {
        "id": "PW-F001",
        "sourcePage": 6,
        "question": "Applicable legal / sectoral minimum wage identified for each worker category?",
        "inputType": "Yes/No + Rate table",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Wage notification / legal register",
        "frequency": "On legal change",
        "risk": "Critical"
      },
      {
        "id": "PW-F002",
        "sourcePage": 6,
        "question": "Lowest basic wage paid meets or exceeds applicable legal minimum?",
        "inputType": "Yes/No + Amount",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Payroll analysis",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-F003",
        "sourcePage": 6,
        "question": "Overtime premium rates comply with applicable requirements?",
        "inputType": "Yes/No + Rates",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Payroll / law / CBA",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-F004",
        "sourcePage": 6,
        "question": "Wages paid on time and at legally required frequency?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Bank/payment records / payroll",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-F005",
        "sourcePage": 6,
        "question": "Workers receive understandable wage slips / statements?",
        "inputType": "Yes/No + Sample",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Payslip template / worker interview",
        "frequency": "Monthly",
        "risk": "Major"
      },
      {
        "id": "PW-F006",
        "sourcePage": 6,
        "question": "All deductions are lawful, transparent and authorised where required?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Payroll sample / consent / policy",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-F007",
        "sourcePage": 6,
        "question": "No disciplinary deductions or unlawful wage penalties?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Payroll / disciplinary records",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-F008",
        "sourcePage": 6,
        "question": "Statutory social-security / insurance contributions made correctly and on time?",
        "inputType": "Yes/No + Status",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Contribution returns / payment evidence",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-F009",
        "sourcePage": 6,
        "question": "Legally required bonuses / gratuity / severance / benefits provided?",
        "inputType": "Yes/No + Status",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Payroll / settlement records",
        "frequency": "As applicable",
        "risk": "Critical"
      },
      {
        "id": "PW-F010",
        "sourcePage": 6,
        "question": "Piece-rate / incentive workers are protected against earnings below legal minimum?",
        "inputType": "Yes/No",
        "requirement": "C",
        "privacy": "P2",
        "evidence": "Piece-rate calculation / payroll",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-F011",
        "sourcePage": 6,
        "question": "Workers can query or contest wage calculations through an accessible process?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Payroll query / grievance process",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-F012",
        "sourcePage": 6,
        "question": "Living-wage / wage-gap analysis performed where required by customer or chosen by facility?",
        "inputType": "Yes/No + Metric",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "Wage benchmark analysis",
        "frequency": "Annual",
        "risk": "Standard"
      },
      {
        "id": "PW-F013",
        "sourcePage": 6,
        "question": "Payroll records reconcile with attendance, worker roster and bank/payment records?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Reconciliation / internal audit",
        "frequency": "Monthly",
        "risk": "Critical"
      }
    ]
  },
  {
    "id": "G",
    "slug": "G",
    "title": "Equality, Non-Discrimination, Harassment & Discipline",
    "description": "Workplace fairness and respectful treatment",
    "icon": "heart",
    "theme": "orange",
    "fields": [
      {
        "id": "PW-G001",
        "sourcePage": 6,
        "question": "Recruitment, pay, promotion, training and termination decisions use job-related criteria?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "HR procedure / sampled records",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-G002",
        "sourcePage": 6,
        "question": "No discrimination based on protected characteristics under applicable law / international principles?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Policy / interviews / case review",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-G003",
        "sourcePage": 6,
        "question": "Equal-pay review / unjustified wage disparity check conducted?",
        "inputType": "Yes/No + Metric",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "Aggregated payroll analytics",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-G004",
        "sourcePage": 7,
        "question": "Anti-harassment / sexual-harassment prevention mechanism implemented?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Policy, committee evidence, training records",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-G005",
        "sourcePage": 7,
        "question": "Complaints of harassment investigated confidentially and without retaliation?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P3",
        "evidence": "Case-management control statement; aggregate case metrics",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-G006",
        "sourcePage": 7,
        "question": "Reasonable accommodation process exists for disability, pregnancy or other legally protected needs?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Accommodation procedure / aggregate evidence",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-G007",
        "sourcePage": 7,
        "question": "Pregnancy testing / contraception / other intrusive medical screening is not used unlawfully for employment decisions?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P3",
        "evidence": "Policy / clinic protocol / interviews",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-G008",
        "sourcePage": 7,
        "question": "Disciplinary rules are written, proportionate and communicated?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Disciplinary procedure",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-G009",
        "sourcePage": 7,
        "question": "No corporal punishment, mental/physical coercion, verbal abuse or degrading treatment?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Worker interviews / grievance data",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-G010",
        "sourcePage": 7,
        "question": "Disciplinary actions are documented with due process / opportunity to respond or appeal?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Sampled disciplinary records",
        "frequency": "Quarterly",
        "risk": "Major"
      },
      {
        "id": "PW-G011",
        "sourcePage": 7,
        "question": "Non-retaliation protection exists for complaints, worker representation, audits and safety reporting?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Policy / worker interviews",
        "frequency": "Annual",
        "risk": "Critical"
      }
    ]
  },
  {
    "id": "H",
    "slug": "H",
    "title": "Freedom of Association, Collective Bargaining & Worker Voice",
    "description": "Worker representation, bargaining and consultation",
    "icon": "message",
    "theme": "violet",
    "fields": [
      {
        "id": "PW-H001",
        "sourcePage": 7,
        "question": "Workers are free to form/join lawful worker organisations or choose not to join?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Policy / interviews",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-H002",
        "sourcePage": 7,
        "question": "No interference, discrimination or retaliation against worker representatives?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Interviews / case review",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-H003",
        "sourcePage": 7,
        "question": "Recognised union / worker committee present?",
        "inputType": "Yes/No + Type",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Committee/union information",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-H004",
        "sourcePage": 7,
        "question": "Worker representatives are selected/elected without management interference?",
        "inputType": "Yes/No",
        "requirement": "C",
        "privacy": "P1",
        "evidence": "Election / nomination record",
        "frequency": "Per election",
        "risk": "Major"
      },
      {
        "id": "PW-H005",
        "sourcePage": 7,
        "question": "Collective bargaining agreement (CBA) applicable?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "CBA / settlement agreement",
        "frequency": "On change",
        "risk": "Major"
      },
      {
        "id": "PW-H006",
        "sourcePage": 7,
        "question": "CBA terms are implemented and monitored?",
        "inputType": "Yes/No",
        "requirement": "C",
        "privacy": "P1",
        "evidence": "Payroll / committee minutes / compliance review",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-H007",
        "sourcePage": 7,
        "question": "Worker representatives have reasonable access to workers and management?",
        "inputType": "Yes/No",
        "requirement": "C",
        "privacy": "P1",
        "evidence": "Meeting records / interviews",
        "frequency": "Quarterly",
        "risk": "Major"
      },
      {
        "id": "PW-H008",
        "sourcePage": 7,
        "question": "Formal worker consultation forums / committees operate regularly?",
        "inputType": "Yes/No + Frequency",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Committee minutes / attendance",
        "frequency": "Quarterly",
        "risk": "Major"
      },
      {
        "id": "PW-H009",
        "sourcePage": 7,
        "question": "Worker suggestions / concerns are tracked to closure?",
        "inputType": "Yes/No + Metric",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Suggestion register / action tracker",
        "frequency": "Monthly/quarterly",
        "risk": "Major"
      },
      {
        "id": "PW-H010",
        "sourcePage": 7,
        "question": "Management communicates significant workplace changes to affected workers?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Communication / consultation record",
        "frequency": "As needed",
        "risk": "Major"
      }
    ]
  },
  {
    "id": "I",
    "slug": "I",
    "title": "Grievance, Complaints, Remedy & Whistleblowing",
    "description": "Accessible grievance channels, remedy and protection",
    "icon": "alert",
    "theme": "pink",
    "fields": [
      {
        "id": "PW-I001",
        "sourcePage": 8,
        "question": "Multiple grievance channels available (e.g., supervisor, HR, box, hotline, committee)?",
        "inputType": "Yes/No + Multi-select",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Procedure / channel evidence",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-I002",
        "sourcePage": 8,
        "question": "At least one confidential / anonymous channel available where legally permissible?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Channel evidence",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-I003",
        "sourcePage": 8,
        "question": "Grievance mechanism accessible to contract / agency / migrant workers?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Communication / interviews",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-I004",
        "sourcePage": 8,
        "question": "Workers are trained / informed on how to raise grievances?",
        "inputType": "Yes/No + Record",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Induction / awareness record",
        "frequency": "Annual + new hire",
        "risk": "Major"
      },
      {
        "id": "PW-I005",
        "sourcePage": 8,
        "question": "Grievances logged with category, date, status and closure time?",
        "inputType": "Yes/No + KPI",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Anonymised grievance register",
        "frequency": "Monthly",
        "risk": "Major"
      },
      {
        "id": "PW-I006",
        "sourcePage": 8,
        "question": "Investigation responsibilities and timelines defined?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Procedure",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-I007",
        "sourcePage": 8,
        "question": "Remedy / corrective action provided where grievance is substantiated?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Anonymised case closure / CAPA",
        "frequency": "Per case",
        "risk": "Critical"
      },
      {
        "id": "PW-I008",
        "sourcePage": 8,
        "question": "Non-retaliation monitored and communicated?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Policy / follow-up records",
        "frequency": "Per case",
        "risk": "Critical"
      },
      {
        "id": "PW-I009",
        "sourcePage": 8,
        "question": "Grievance trends analysed by category / department / root cause?",
        "inputType": "Yes/No + Dashboard",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Aggregated trend analysis",
        "frequency": "Quarterly",
        "risk": "Major"
      },
      {
        "id": "PW-I010",
        "sourcePage": 8,
        "question": "Serious allegations are escalated to appropriate senior management / authority as required?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P3",
        "evidence": "Escalation protocol / control statement",
        "frequency": "Per case",
        "risk": "Critical"
      }
    ]
  },
  {
    "id": "J",
    "slug": "J",
    "title": "Competence, Training, Awareness & Development",
    "description": "Role competence, skills and training effectiveness",
    "icon": "award",
    "theme": "teal",
    "fields": [
      {
        "id": "PW-J001",
        "sourcePage": 8,
        "question": "Competence requirements defined for roles affecting quality, environment, OH&S and compliance?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Competency matrix / job descriptions",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-J002",
        "sourcePage": 8,
        "question": "Education / skill / experience evidence verified for critical roles?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Qualification verification / licence",
        "frequency": "On hire/renewal",
        "risk": "Major"
      },
      {
        "id": "PW-J003",
        "sourcePage": 8,
        "question": "Annual training-needs analysis completed?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Training needs matrix",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-J004",
        "sourcePage": 8,
        "question": "New-employee induction covers employment rights, policies, grievance and safety?",
        "inputType": "Yes/No + Record",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Induction checklist / attendance",
        "frequency": "Per hire",
        "risk": "Critical"
      },
      {
        "id": "PW-J005",
        "sourcePage": 8,
        "question": "Job-specific training provided before unsupervised work?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Training / authorisation record",
        "frequency": "Per assignment",
        "risk": "Critical"
      },
      {
        "id": "PW-J006",
        "sourcePage": 8,
        "question": "Refresher training frequency defined for critical topics?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Training plan",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-J007",
        "sourcePage": 8,
        "question": "Training delivered in language / format workers understand?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Training material / worker interview",
        "frequency": "Per training",
        "risk": "Major"
      },
      {
        "id": "PW-J008",
        "sourcePage": 8,
        "question": "Training effectiveness evaluated rather than attendance only?",
        "inputType": "Yes/No + Method",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Test / observation / competency sign-off",
        "frequency": "Per critical training",
        "risk": "Major"
      },
      {
        "id": "PW-J009",
        "sourcePage": 8,
        "question": "Awareness of quality / environmental / OH&S policies and worker contribution assessed?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Interview / awareness assessment",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-J010",
        "sourcePage": 8,
        "question": "Supervisors / managers trained in labour rights, grievance handling and non-discrimination?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Training records",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-J011",
        "sourcePage": 8,
        "question": "Career development / upskilling opportunities tracked?",
        "inputType": "Yes/No + KPI",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "Training hours / development plans",
        "frequency": "Annual",
        "risk": "Standard"
      },
      {
        "id": "PW-J012",
        "sourcePage": 8,
        "question": "Training hours per employee per year",
        "inputType": "Calculated number",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "LMS / training register",
        "frequency": "Annual",
        "risk": "Standard"
      }
    ]
  },
  {
    "id": "K",
    "slug": "K",
    "title": "Workplace Environment, Welfare & Employee Experience",
    "description": "Workplace conditions, amenities and employee feedback",
    "icon": "building",
    "theme": "blue",
    "fields": [
      {
        "id": "PW-K001",
        "sourcePage": 9,
        "question": "Workplace physical conditions are suitable for operations and worker wellbeing?",
        "inputType": "Rating + Evidence",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Workplace inspection / observations",
        "frequency": "Monthly/quarterly",
        "risk": "Major"
      },
      {
        "id": "PW-K002",
        "sourcePage": 9,
        "question": "Lighting adequate and maintained?",
        "inputType": "Yes/No + Measurement",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Inspection / lux measurements where required",
        "frequency": "Periodic",
        "risk": "Major"
      },
      {
        "id": "PW-K003",
        "sourcePage": 9,
        "question": "Ventilation / indoor air / heat stress controls adequate?",
        "inputType": "Yes/No + Measurement",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Monitoring / inspection / risk assessment",
        "frequency": "Periodic",
        "risk": "Critical"
      },
      {
        "id": "PW-K004",
        "sourcePage": 9,
        "question": "Noise exposure / control and worker protection adequate?",
        "inputType": "Yes/No + Measurement",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Noise survey / control records",
        "frequency": "Periodic",
        "risk": "Critical"
      },
      {
        "id": "PW-K005",
        "sourcePage": 9,
        "question": "Sanitation / toilets are sufficient, clean and accessible?",
        "inputType": "Yes/No + Counts",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Inspection / facility records",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-K006",
        "sourcePage": 9,
        "question": "Safe potable drinking water is freely accessible?",
        "inputType": "Yes/No + Test",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Water test / inspection",
        "frequency": "As legally required",
        "risk": "Critical"
      },
      {
        "id": "PW-K007",
        "sourcePage": 9,
        "question": "Canteen / food hygiene controls adequate where provided?",
        "inputType": "Yes/No",
        "requirement": "C",
        "privacy": "P1",
        "evidence": "Hygiene inspection / licence / test",
        "frequency": "Monthly",
        "risk": "Major"
      },
      {
        "id": "PW-K008",
        "sourcePage": 9,
        "question": "Dormitory / accommodation conditions meet applicable safety, space, hygiene and privacy requirements?",
        "inputType": "Yes/No + Checklist",
        "requirement": "C",
        "privacy": "P1",
        "evidence": "Accommodation inspection / register",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-K009",
        "sourcePage": 9,
        "question": "Rest areas / changing rooms / washing facilities appropriate to work and workforce?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Inspection",
        "frequency": "Quarterly",
        "risk": "Major"
      },
      {
        "id": "PW-K010",
        "sourcePage": 9,
        "question": "Employee satisfaction / workplace experience survey conducted?",
        "inputType": "Yes/No + Upload",
        "requirement": "O",
        "privacy": "P1",
        "evidence": "Survey methodology / questionnaire",
        "frequency": "Annual/half-yearly",
        "risk": "Standard"
      },
      {
        "id": "PW-K011",
        "sourcePage": 9,
        "question": "Employee Satisfaction Index / overall workplace experience score",
        "inputType": "Calculated %",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "Aggregated survey result",
        "frequency": "Annual/half-yearly",
        "risk": "Standard"
      },
      {
        "id": "PW-K012",
        "sourcePage": 9,
        "question": "Workload / work-pressure / fatigue perception score",
        "inputType": "Calculated %",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "Anonymous survey / worker interviews",
        "frequency": "Annual/half-yearly",
        "risk": "Major"
      },
      {
        "id": "PW-K013",
        "sourcePage": 9,
        "question": "Management communication / supervisor support score",
        "inputType": "Calculated %",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "Anonymous survey",
        "frequency": "Annual/half-yearly",
        "risk": "Standard"
      },
      {
        "id": "PW-K014",
        "sourcePage": 9,
        "question": "Training/development satisfaction score",
        "inputType": "Calculated %",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "Anonymous survey",
        "frequency": "Annual/half-yearly",
        "risk": "Standard"
      },
      {
        "id": "PW-K015",
        "sourcePage": 9,
        "question": "Grievance confidence / psychological safety perception score",
        "inputType": "Calculated %",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "Anonymous survey",
        "frequency": "Annual/half-yearly",
        "risk": "Major"
      },
      {
        "id": "PW-K016",
        "sourcePage": 9,
        "question": "Action plan established for material employee-experience findings?",
        "inputType": "Yes/No + Upload",
        "requirement": "O",
        "privacy": "P1",
        "evidence": "Action plan / management review",
        "frequency": "After survey",
        "risk": "Major"
      }
    ]
  },
  {
    "id": "L",
    "slug": "L",
    "title": "Occupational Health & Safety – People Interface",
    "description": "Worker safety involvement, controls and emergency readiness",
    "icon": "hardhat",
    "theme": "lime",
    "fields": [
      {
        "id": "PW-L001",
        "sourcePage": 9,
        "question": "OH&S roles and responsibilities assigned, including competent responsible person(s)?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Organisation chart / appointment",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-L002",
        "sourcePage": 9,
        "question": "Workers and representatives participate in hazard identification / risk assessment?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Risk assessment sign-off / committee minutes",
        "frequency": "On assessment",
        "risk": "Critical"
      },
      {
        "id": "PW-L003",
        "sourcePage": 9,
        "question": "Worker-accessible hazard / near-miss reporting mechanism?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Reporting procedure / records",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-L004",
        "sourcePage": 9,
        "question": "Health & safety committee established where required / appropriate?",
        "inputType": "Yes/No + Composition",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Committee constitution / minutes",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-L005",
        "sourcePage": 10,
        "question": "Required safety training completed and documented?",
        "inputType": "Yes/No + %",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Training matrix / records",
        "frequency": "Monthly/quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-L006",
        "sourcePage": 10,
        "question": "PPE provided free of charge, appropriate, maintained and use monitored?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "PPE issue / assessment / observation",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-L007",
        "sourcePage": 10,
        "question": "First-aid resources, trained first aiders and medical response available?",
        "inputType": "Yes/No + Counts",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "First-aid roster / inspection",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-L008",
        "sourcePage": 10,
        "question": "Emergency response roles, drills and worker training current?",
        "inputType": "Yes/No + Dates",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Emergency plan / drill records",
        "frequency": "At planned frequency",
        "risk": "Critical"
      },
      {
        "id": "PW-L009",
        "sourcePage": 10,
        "question": "Work-related incidents / injuries / occupational illnesses recorded and investigated?",
        "inputType": "Yes/No + KPI",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Incident register / investigation",
        "frequency": "Monthly/per incident",
        "risk": "Critical"
      },
      {
        "id": "PW-L010",
        "sourcePage": 10,
        "question": "Corrective actions from incidents / near misses tracked to closure?",
        "inputType": "Yes/No + KPI",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "CAPA tracker",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-L011",
        "sourcePage": 10,
        "question": "Occupational health surveillance is risk-based and legally compliant?",
        "inputType": "Yes/No",
        "requirement": "C",
        "privacy": "P3",
        "evidence": "Fitness/medical surveillance control statement; no diagnoses in portal",
        "frequency": "As required",
        "risk": "Critical"
      },
      {
        "id": "PW-L012",
        "sourcePage": 10,
        "question": "Workers can remove themselves from imminent serious danger without retaliation, consistent with law and policy?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Policy / interviews",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-L013",
        "sourcePage": 10,
        "question": "Pregnant / young / vulnerable workers receive risk-appropriate workplace protections?",
        "inputType": "Yes/No",
        "requirement": "C",
        "privacy": "P2",
        "evidence": "Risk assessment / accommodation controls",
        "frequency": "As needed",
        "risk": "Critical"
      },
      {
        "id": "PW-L014",
        "sourcePage": 10,
        "question": "Contractor workers receive equivalent site safety induction and controls?",
        "inputType": "Yes/No + %",
        "requirement": "C",
        "privacy": "P1",
        "evidence": "Contractor induction / permits",
        "frequency": "Per contractor",
        "risk": "Critical"
      }
    ]
  },
  {
    "id": "M",
    "slug": "M",
    "title": "Termination, Retrenchment & Separation",
    "description": "Lawful separation procedures and final settlements",
    "icon": "logout",
    "theme": "slate",
    "fields": [
      {
        "id": "PW-M001",
        "sourcePage": 10,
        "question": "Termination grounds and process comply with law / contract / CBA?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Termination procedure / sampled cases",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-M002",
        "sourcePage": 10,
        "question": "Final wages, benefits and statutory dues settled within required time?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Final settlement records",
        "frequency": "Per separation",
        "risk": "Critical"
      },
      {
        "id": "PW-M003",
        "sourcePage": 10,
        "question": "Workers receive required notice / payment in lieu?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Notice / settlement record",
        "frequency": "Per separation",
        "risk": "Critical"
      },
      {
        "id": "PW-M004",
        "sourcePage": 10,
        "question": "No discriminatory, retaliatory or forced termination practices?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P3",
        "evidence": "Anonymised case review / interviews",
        "frequency": "Quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-M005",
        "sourcePage": 10,
        "question": "Retrenchment / mass layoff process includes legal consultation, notice and mitigation where applicable?",
        "inputType": "Yes/No + Plan",
        "requirement": "C",
        "privacy": "P2",
        "evidence": "Restructuring plan / consultation record",
        "frequency": "Per event",
        "risk": "Critical"
      },
      {
        "id": "PW-M006",
        "sourcePage": 10,
        "question": "Exit interview / reason for leaving captured on an aggregated basis?",
        "inputType": "Yes/No + Metric",
        "requirement": "O",
        "privacy": "P1",
        "evidence": "Exit process / aggregated trend",
        "frequency": "Monthly/quarterly",
        "risk": "Standard"
      }
    ]
  },
  {
    "id": "N",
    "slug": "N",
    "title": "Worker Privacy & Personal Data Protection",
    "description": "Data minimisation, retention and access safeguards",
    "icon": "lock",
    "theme": "plum",
    "fields": [
      {
        "id": "PW-N001",
        "sourcePage": 10,
        "question": "Defined lawful purpose for each category of worker personal data collected?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Data inventory / privacy policy",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-N002",
        "sourcePage": 10,
        "question": "Only minimum necessary worker data is collected and retained?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Data inventory / retention schedule",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-N003",
        "sourcePage": 10,
        "question": "Access to HR/payroll/medical data is role-restricted and logged where appropriate?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P2",
        "evidence": "Access-control matrix",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-N004",
        "sourcePage": 11,
        "question": "Worker data retention and secure disposal periods defined?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Retention schedule / disposal procedure",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-N005",
        "sourcePage": 11,
        "question": "Workers informed about collection/use/sharing of their personal data as required?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Privacy notice / acknowledgement",
        "frequency": "On hire/update",
        "risk": "Major"
      },
      {
        "id": "PW-N006",
        "sourcePage": 11,
        "question": "Sensitive data (medical, biometric, union or protected-trait data) receives enhanced safeguards?",
        "inputType": "Yes/No",
        "requirement": "C",
        "privacy": "P3",
        "evidence": "Control statement / access review",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-N007",
        "sourcePage": 11,
        "question": "Employee monitoring / CCTV / biometrics are lawful, proportionate and communicated?",
        "inputType": "Yes/No",
        "requirement": "C",
        "privacy": "P2",
        "evidence": "Notice / impact assessment / policy",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-N008",
        "sourcePage": 11,
        "question": "Personal-data incidents / complaints are managed and remediated?",
        "inputType": "Yes/No + Metric",
        "requirement": "M",
        "privacy": "P3",
        "evidence": "Incident register / CAPA (anonymised)",
        "frequency": "Per event",
        "risk": "Critical"
      }
    ]
  },
  {
    "id": "O",
    "slug": "O",
    "title": "People Metrics, Monitoring, Audit & Continual Improvement",
    "description": "Workforce KPIs, audits and corrective action",
    "icon": "chart",
    "theme": "gold",
    "fields": [
      {
        "id": "PW-O001",
        "sourcePage": 11,
        "question": "Annual employee turnover rate",
        "inputType": "Calculated %",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "HR master / separation records",
        "frequency": "Monthly/annual",
        "risk": "Standard"
      },
      {
        "id": "PW-O002",
        "sourcePage": 11,
        "question": "Voluntary turnover rate",
        "inputType": "Calculated %",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "HR master / exit data",
        "frequency": "Monthly/annual",
        "risk": "Standard"
      },
      {
        "id": "PW-O003",
        "sourcePage": 11,
        "question": "Absenteeism rate",
        "inputType": "Calculated %",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "Attendance data",
        "frequency": "Monthly",
        "risk": "Standard"
      },
      {
        "id": "PW-O004",
        "sourcePage": 11,
        "question": "Overtime intensity – OT hours / total hours",
        "inputType": "Calculated %",
        "requirement": "O",
        "privacy": "P0",
        "evidence": "Time records",
        "frequency": "Monthly",
        "risk": "Major"
      },
      {
        "id": "PW-O005",
        "sourcePage": 11,
        "question": "Training completion rate for mandatory training",
        "inputType": "Calculated %",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Training system",
        "frequency": "Monthly/quarterly",
        "risk": "Major"
      },
      {
        "id": "PW-O006",
        "sourcePage": 11,
        "question": "Grievance closure rate within target time",
        "inputType": "Calculated %",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Grievance tracker",
        "frequency": "Monthly/quarterly",
        "risk": "Major"
      },
      {
        "id": "PW-O007",
        "sourcePage": 11,
        "question": "Lost-time / recordable incident metrics tracked as applicable?",
        "inputType": "Calculated",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Incident statistics",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-O008",
        "sourcePage": 11,
        "question": "Internal HR/social compliance audit conducted?",
        "inputType": "Yes/No + Date",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Audit report / checklist",
        "frequency": "Annual/periodic",
        "risk": "Major"
      },
      {
        "id": "PW-O009",
        "sourcePage": 11,
        "question": "Nonconformities / findings assigned owner, root cause, due date and status?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "CAPA register",
        "frequency": "Monthly",
        "risk": "Major"
      },
      {
        "id": "PW-O010",
        "sourcePage": 11,
        "question": "Effectiveness of corrective actions verified?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "CAPA effectiveness check",
        "frequency": "Per CAPA",
        "risk": "Major"
      },
      {
        "id": "PW-O011",
        "sourcePage": 11,
        "question": "People/workplace performance reviewed by top management?",
        "inputType": "Yes/No + Date",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Management review minutes / dashboard",
        "frequency": "At planned interval",
        "risk": "Major"
      },
      {
        "id": "PW-O012",
        "sourcePage": 11,
        "question": "Objectives / targets established for material people/workplace risks or improvement areas?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "People objectives / action plan",
        "frequency": "Annual",
        "risk": "Major"
      },
      {
        "id": "PW-O013",
        "sourcePage": 11,
        "question": "External audit / customer audit social findings tracked and closed?",
        "inputType": "Yes/No + KPI",
        "requirement": "C",
        "privacy": "P1",
        "evidence": "Audit report / CAPA",
        "frequency": "Per audit",
        "risk": "Major"
      },
      {
        "id": "PW-O014",
        "sourcePage": 11,
        "question": "Trend analysis identifies recurring issues, vulnerable groups or systemic root causes using aggregated data?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P0",
        "evidence": "Dashboard / analysis",
        "frequency": "Quarterly/annual",
        "risk": "Major"
      }
    ]
  },
  {
    "id": "P",
    "slug": "P",
    "title": "Contractors, Labour Agencies & On-site Service Providers",
    "description": "Contractor due diligence and labour compliance",
    "icon": "handshake",
    "theme": "coral",
    "fields": [
      {
        "id": "PW-P001",
        "sourcePage": 11,
        "question": "Register of labour contractors / agencies / on-site service providers maintained?",
        "inputType": "Yes/No + Upload",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Approved provider register",
        "frequency": "Quarterly",
        "risk": "Major"
      },
      {
        "id": "PW-P002",
        "sourcePage": 11,
        "question": "Pre-engagement due diligence covers licences, labour practices, wages, hours, child/forced-labour and safety?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Due-diligence checklist",
        "frequency": "On onboarding/annual",
        "risk": "Critical"
      },
      {
        "id": "PW-P003",
        "sourcePage": 12,
        "question": "Contracts require compliance with labour law and facility social/OH&S requirements?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Service agreement / code of conduct",
        "frequency": "On contract",
        "risk": "Critical"
      },
      {
        "id": "PW-P004",
        "sourcePage": 12,
        "question": "Facility verifies contractor wage/benefit compliance rather than relying only on declaration?",
        "inputType": "Yes/No",
        "requirement": "C",
        "privacy": "P2",
        "evidence": "Sample payroll / payment verification",
        "frequency": "Monthly/quarterly",
        "risk": "Critical"
      },
      {
        "id": "PW-P005",
        "sourcePage": 12,
        "question": "Contract worker hours / rest / overtime monitored?",
        "inputType": "Yes/No",
        "requirement": "C",
        "privacy": "P2",
        "evidence": "Attendance / contractor records",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-P006",
        "sourcePage": 12,
        "question": "Contract workers receive grievance access and non-retaliation protection?",
        "inputType": "Yes/No",
        "requirement": "C",
        "privacy": "P1",
        "evidence": "Communication / interviews",
        "frequency": "Annual",
        "risk": "Critical"
      },
      {
        "id": "PW-P007",
        "sourcePage": 12,
        "question": "Contractor H&S performance and incidents included in site metrics?",
        "inputType": "Yes/No",
        "requirement": "C",
        "privacy": "P1",
        "evidence": "Incident statistics / contractor review",
        "frequency": "Monthly",
        "risk": "Critical"
      },
      {
        "id": "PW-P008",
        "sourcePage": 12,
        "question": "Poor-performing providers receive CAPA, suspension or termination based on defined criteria?",
        "inputType": "Yes/No",
        "requirement": "M",
        "privacy": "P1",
        "evidence": "Supplier/contractor CAPA",
        "frequency": "Per issue",
        "risk": "Major"
      }
    ]
  }
];
