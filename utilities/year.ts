export function randomYear() {
  const years = ['2000', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010'];
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  const randomIndex = randomBuffer[0] % years.length;
  return years[randomIndex];
}
