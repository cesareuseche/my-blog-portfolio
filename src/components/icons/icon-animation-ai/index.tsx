"use client";
import dynamic from "next/dynamic";
import lottieJson from "../../../../public/animation/chatbotai-lottie.json";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });


const LottieAnimation = () => {
  return (
    <Lottie
      loop
      animationData={lottieJson}
      play
    />
  );
};

export default LottieAnimation;
