import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturesHero from '@/app/features/components/FeaturesHero';
import FeaturesBento from '@/app/features/components/FeaturesBento';
import RankTable from '@/app/features/components/RankTable';
import PlatformEconomics from '@/app/features/components/PlatformEconomics';

export default function FeaturesPage() {
  return (
    <main className="relative overflow-x-hidden bg-background">
      <Header />
      <FeaturesHero />
      <FeaturesBento />
      <RankTable />
      <PlatformEconomics />
      <Footer />
    </main>
  );
}