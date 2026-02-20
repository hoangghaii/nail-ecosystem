/**
 * Confetti celebration utility for booking confirmation.
 * Lazy-loaded to avoid blocking main bundle.
 */

export async function celebrateBooking(): Promise<void> {
  const confetti = (await import("canvas-confetti")).default;

  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    colors: ["#D1948B", "#FDF8F5", "#333333"],
    spread: 360,
    startVelocity: 30,
    ticks: 60,
    zIndex: 9999,
  };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    // Fire from left
    confetti({
      ...defaults,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      particleCount,
    });

    // Fire from right
    confetti({
      ...defaults,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      particleCount,
    });
  }, 250);
}
