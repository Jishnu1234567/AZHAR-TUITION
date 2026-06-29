import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import Features from "@/components/Features";
import Courses from "@/components/Courses";
import GallerySection from "@/components/GallerySection";
import Faculty from "@/components/Faculty";
import Events from "@/components/Events";
import Results from "@/components/Results";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <Features />
      <Courses />
      <GallerySection />
      <Faculty />
      <Events />
        <Results />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}