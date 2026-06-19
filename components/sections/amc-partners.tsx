"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/section";

const partners = [
  { name: "SBI Mutual Fund", file: "sbi-mf.png" },
  { name: "HDFC Mutual Fund", file: "hdfc-mf.png" },
  { name: "ICICI Prudential", file: "icici-mf.png" },
  { name: "Axis Mutual Fund", file: "axis-mf.png" },
  { name: "Kotak Mutual Fund", file: "kotak-mf.png" },
  { name: "Nippon India", file: "nippon-mf.png" },
  { name: "Mirae Asset", file: "mirae-mf.png" },
  { name: "Aditya Birla Sun Life", file: "birla-mf.png" },
  { name: "DSP Mutual Fund", file: "dsp-mf.png" },
  { name: "Franklin Templeton", file: "franklin-mf.png" },
  { name: "Canara Robeco", file: "canara-mf.png" },
  { name: "Quant Mutual Fund", file: "quant-mf.png" },
  { name: "Tata Mutual Fund", file: "tata-mf.png" },
  { name: "Motilal Oswal", file: "motilal-mf.png" },
  { name: "PPFAS Mutual Fund", file: "ppfas-mf.png" },
  { name: "Edelweiss Mutual Fund", file: "edelweiss-mf.png" },
  { name: "Invesco Mutual Fund", file: "invesco-mf.png" },
];

const PartnerCard: React.FC<{ name: string; file: string }> = ({
  name,
  file,
}) => (
  <div className="flex-shrink-0 mx-5 w-[200px] h-[100px] bg-card rounded-2xl border border-border/40 shadow-sm flex items-center justify-center p-5 hover:shadow-md transition-all duration-300 select-none">
    <Image
      src={`/${file}`}
      alt={name}
      width={150}
      height={60}
      className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-all duration-300"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = `https://placehold.co/300x150/ffffff/374151?text=${encodeURIComponent(name.replace(" Mutual Fund", "").replace("Asset", ""))}&font=roboto`;
      }}
    />
  </div>
);

const AmcPartners: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-muted/30 to-background overflow-hidden py-20">
      <Container>
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Trusted By
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            <span className="text-primary font-extrabold">17+</span> AMC
            Partners
          </h2>
          <p className="mt-2 max-w-xl mx-auto text-sm text-muted-foreground leading-relaxed">
            Partnered with India&apos;s most trusted mutual fund houses and
            digital execution platforms.
        </p>
        </div>
      </Container>

      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <div className="flex animate-scroll-infinite w-max">
          {partners.map((partner, index) => (
            <PartnerCard key={`a-${index}`} {...partner} />
          ))}
          {partners.map((partner, index) => (
            <PartnerCard key={`b-${index}`} {...partner} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmcPartners;
