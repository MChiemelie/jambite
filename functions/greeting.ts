export default function getGreeting () {
  const currentHour = new Date().getHours();
    return currentHour >= 0 && currentHour < 12 ? 'Good Morning' : currentHour >= 12 && currentHour < 16 ? 'Good Afternoon' : 'Good Evening';
};
