export const formatCountdown = (countdown) => {
  const days = Math.floor(countdown / 86400);
  const hours = Math.floor((countdown % 86400) / 3600);
  const minutes = Math.floor((countdown % 3600) / 60);
  const seconds = countdown % 60;
  return { days, hours, minutes, seconds };
};
