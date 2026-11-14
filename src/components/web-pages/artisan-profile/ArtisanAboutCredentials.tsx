import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Sparkles,
  Award,
  Layers,
} from "lucide-react";
import type { IArtisanProfileItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";

interface ArtisanAboutCredentialsProps {
  profile: IArtisanProfileItem;
}

export function ArtisanAboutCredentials({
  profile,
}: ArtisanAboutCredentialsProps) {
  const bio =
    profile.bio ||
    `Certified professional dedicated to delivering premium, punctual craftsmanship. With extensive practical field experience across residential and commercial properties in Ghana, I ensure all installations, repairs, and finishing adhere to the highest engineering standards and safety codes.`;

  const skills: string[] = profile.skills?.length
    ? profile.skills
    : profile.specialties?.length
      ? profile.specialties
      : [
          "Emergency Repairs",
          "Precision Diagnostic",
          "Preventative Maintenance",
          "Residential & Commercial",
          "Safety Code Compliance",
          "Post-Service Clean-up",
        ];

  const tools: string[] = profile.tools?.length
    ? profile.tools
    : [
          "Professional Diagnostic Tools",
          "Heavy-Duty Hand & Power Toolsets",
          "Calibrated Testing Equipment",
          "Safety Protective Gear & Helmets",
        ];

  const verifications = [
    {
      title: "Government Identity Verified",
      desc: "Ghana Card & biometric identity audited through official registries.",
    },
    {
      title: "Trade Skills & Track Record Audited",
      desc: "Field experience and previous project milestones independently checked.",
    },
    {
      title: "Nutsumo Escrow Payment Standard",
      desc: "Adheres to platform dispute guidelines with 100% escrow protection.",
    },
    {
      title: "Statutory Tax Compliant",
      desc: "Quotes show VAT, NHIL, GETFund, and the Nutsumo platform fee.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. About / Bio Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-title font-display font-bold text-lg">
          <FileText className="h-5 w-5 text-primary" />
          <h2>About the Professional</h2>
        </div>

        <p className="text-sm sm:text-base text-copy leading-relaxed whitespace-pre-line font-sans">
          {bio}
        </p>

        {/* Skills Pills */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-muted font-display block mb-3">
            Specialized Skills & Expertise
          </span>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-title border border-slate-200/60"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-muted font-display block mb-3">
            Equipment & Tools Provided
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-xs sm:text-sm text-title"
              >
                <Wrench className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Trust, Safety & Compliance Card */}
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-title font-display font-bold text-base sm:text-lg">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <h3>Verified Trust & Safety Standards</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {verifications.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-title">
                  {item.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-muted leading-relaxed mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
