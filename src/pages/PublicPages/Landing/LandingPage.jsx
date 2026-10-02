import React from "react";
import LandingHero from "../components/landing/LandingHero";
import FeaturedSection from "../components/landing/FeaturedSection";
import HowItWorks from "../components/landing/HowItWorks";
import OwnerCallToAction from "../components/landing/OwnerCallToAction";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <LandingHero />
      <FeaturedSection />
      <HowItWorks />
      <OwnerCallToAction />
    </div>
  );
}