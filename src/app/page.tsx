import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Products } from "@/components/Products";
import { SceneBackdrop } from "@/components/scene/SceneBackdrop";
import { Spotlight } from "@/components/Spotlight";
import { Studio } from "@/components/Studio";

export default function Home() {
  return (
    <>
      <SceneBackdrop />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Spotlight />
        <Products />
        <Studio />
      </main>
      <Footer />
    </>
  );
}
