import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LoadingScreen } from "@/components/birthday/LoadingScreen";
import { MusicPlayer } from "@/components/birthday/music";
import { CursorGlow } from "@/components/birthday/effects";
import {
  LandingScene, CakeScene, TimeScene, WishesScene, GalleryScene,
  LetterScene, ReasonsScene, StarsScene, StoryScene, FutureScene, FinalScene,
} from "@/components/birthday/sections";
import { SecretGift, EasterEgg } from "@/components/birthday/gift";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy 22nd Birthday, Lily ❤" },
      { name: "description", content: "A magical, cinematic birthday surprise for Lily from Harshit." },
      { property: "og:title", content: "Happy 22nd Birthday, Lily ❤" },
      { property: "og:description", content: "A magical, cinematic birthday surprise for Lily from Harshit." },
    ],
  }),
  component: Index,
});

function Index() {
  const [loaded, setLoaded] = useState(false);
  const scrollToCake = () => {
    document.getElementById("cake")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <div className="relative">
        <CursorGlow />
        <MusicPlayer />
        <EasterEgg />

        <main>
          <LandingScene />
          <section id="cake"><CakeScene onContinue={scrollToCake} /></section>
          <TimeScene />
          <WishesScene />
          <GalleryScene />
          <LetterScene />
          <ReasonsScene />
          <StarsScene />
          <StoryScene />
          <FutureScene />
          <FinalScene />
          <SecretGift />
        </main>

        <footer className="night-bg py-10 text-center text-xs text-pink/50">
          Made with endless love · Harshit → Lily · 29.06.2027
        </footer>
      </div>
    </>
  );
}
