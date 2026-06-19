import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-16 md:py-20">
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 mb-16 pb-12 border-b border-border/50">
          {/* Brand & Contact */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight">
              Seed Investments
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              AMFI-Registered Mutual Fund Distributor and IRDAI-Licensed
              Insurance Advisor based in Chennai, India.
            </p>
            <div className="text-sm text-muted-foreground space-y-1.5">
              <p>
                <span className="font-medium text-foreground">ARN:</span>{" "}
                136455
              </p>
              <p>
                <span className="font-medium text-foreground">
                  GSTIN:
                </span>{" "}
                XXXXXX9999X9ZX
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Address:
                </span>{" "}
                A, Superette, P No 143, E Main Rd, MGR Nagar, Pammal, Chennai
                600075
              </p>
            </div>
          </div>

          {/* Regulatory Info */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight">
              Regulatory Information
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">NSE Member</p>
                <p className="font-semibold text-foreground">1008340</p>
              </div>
              <div>
                <p className="text-muted-foreground">License</p>
                <p className="font-semibold text-foreground">IG 12345</p>
              </div>
              <div>
                <p className="text-muted-foreground">BSE Member</p>
                <p className="text-muted-foreground font-semibold">
                  [Pending]
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Tech Partner</p>
                <p className="font-semibold text-foreground">
                  Wealth Elite
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Website</p>
                <p className="font-semibold text-foreground">
                  Renascence Solutions
                </p>
              </div>
            </div>
          </div>

          {/* Grievance */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight">
              Grievance Redressal
            </h3>
            <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm">
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                For any concerns, contact us at{" "}
                <a
                  href="mailto:complaints@seedinvestments.in"
                  className="text-primary font-semibold hover:underline"
                >
                  complaints@seedinvestments.in
                </a>
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You can also reach out to AMFI, SEBI (via SCORES Portal), and
                IRDAI if your issue is unresolved within 30 days.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-blue-200/50 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-950/30 p-5">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">
              Commission Transparency
            </p>
            <p className="text-xs text-blue-600/80 dark:text-blue-300/80 leading-relaxed">
              Seed Investments earns commission from Asset Management Companies
              (AMCs) and Insurance Companies as permitted by regulations. All
              commission structures are disclosed upfront. Commissions do not
              increase investor costs or influence our recommendations.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200/50 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/30 p-5">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
              Legal Disclaimer
            </p>
            <p className="text-xs text-amber-600/80 dark:text-amber-300/80 leading-relaxed">
              Mutual Fund Investments are subject to market risks. Past
              performance is not a guarantee of future results. Please read all
              scheme-related documents carefully before investing. This website
              is for informational purposes only and does not constitute
              financial advice. Seed Investments does not provide investment
              advice as defined under SEBI (Investment Advisers) Regulations,
              2013.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Seed Investments. All Rights
            Reserved.
            <span className="hidden sm:inline mx-2 text-border">|</span>
            <span className="block sm:inline mt-1 sm:mt-0">
              Registered Office: Chennai, India.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
