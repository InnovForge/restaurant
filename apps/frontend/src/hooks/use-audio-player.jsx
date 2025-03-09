import { useState, useEffect } from "react";

const useAudioNotification = () => {
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(ctx);

    const unlockAudio = () => {
      if (ctx.state === "suspended") {
        ctx.resume().then(() => console.log("🔊 AudioContext đã sẵn sàng!"));
      }
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      ctx.close();
    };
  }, []);

  return null;
};

export default useAudioNotification;
