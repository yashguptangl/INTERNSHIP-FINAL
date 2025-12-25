import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProgramsSection from '@/components/ProgramsSection';
import AboutSection from '@/components/AboutSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ProgramsSection />
        <AboutSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
