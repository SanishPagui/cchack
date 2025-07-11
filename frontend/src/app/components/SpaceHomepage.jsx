'use client';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import AchievementsSection from './AchievementsSection';
import BlogSection from './BlogSection';

const SpaceHomepage = () => {
  return (
    <div className="bg-black">
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <AchievementsSection />
      <BlogSection />
    </div>
  );
};

export default SpaceHomepage;
