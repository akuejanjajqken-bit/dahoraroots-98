import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import LaunchSection from "@/components/sections/LaunchSection";
import TobaccoBluntSection from "@/components/sections/TobaccoBluntSection";
import BluntSection from "@/components/sections/BluntSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ArtistCollabs from "@/components/sections/ArtistCollabs";
import TrustBadges from "@/components/sections/TrustBadges";
import Newsletter from "@/components/sections/Newsletter";
import PartnerBrands from "@/components/sections/PartnerBrands";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <LaunchSection />
        <TobaccoBluntSection />
        <BluntSection />
        <FeaturedProducts />
        <ArtistCollabs />
        <TrustBadges />
        <Newsletter />
        <PartnerBrands />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
