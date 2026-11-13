import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ValueProps } from '../components/ValueProps';
import { ShopByCategory } from '../components/ShopByCategory';
import { SignatureCollection } from '../components/SignatureCollection';
import { CoffeeFinderSection } from '../components/CoffeeFinderSection';
import { WhyBrewly } from '../components/WhyBrewly';
import { SubscriptionBanner } from '../components/SubscriptionBanner';
import { BrewingExperience } from '../components/BrewingExperience';
import { CustomerReviews } from '../components/CustomerReviews';
import { BrandStorySection } from '../components/BrandStorySection';
import { NewsletterSection } from '../components/NewsletterSection';

export const Home = () => {
  return (
    <div className="space-y-0 selection:bg-amberGold-500 selection:text-white">
      {/* 1. Hero / Interactive Coffee Customizer */}
      <HeroSection />

      {/* 2. Trust / Brand Strip */}
      <ValueProps />

      {/* 3. Shop By Category */}
      <ShopByCategory />

      {/* 4. Best Selling Coffees */}
      <SignatureCollection />

      {/* 5. Coffee Finder Preview */}
      <CoffeeFinderSection />

      {/* 6. Why Brewly */}
      <WhyBrewly />

      {/* 7. Subscription Banner */}
      <SubscriptionBanner />

      {/* 8. Brewing Experience */}
      <BrewingExperience />

      {/* 9. Customer Reviews */}
      <CustomerReviews />

      {/* 10. Editorial Brand Story */}
      <BrandStorySection />

      {/* 11. Newsletter */}
      <NewsletterSection />
    </div>
  );
};
