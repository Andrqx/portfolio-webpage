import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HomeExperience from "@/components/HomeExperience";

export default function Home() {
  return (
    <HomeExperience>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </HomeExperience>
  );
}
