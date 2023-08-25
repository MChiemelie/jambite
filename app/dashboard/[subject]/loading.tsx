import Image from "next/image";

export default function loading() {
  return (
   <div className="h-screen flex justify-center items-center space-x-4">
   <Image src='/logo.png' alt="Jambite logo" width={100} height={100} />
   <div className="flex bg-accent-1 p-2 rounded-sm justify-center items-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin h-5 w-5 space-x-4" viewBox="0 0 512 512">
     <path d="M320 146s24.36-12-64-12a160 160 0 10160 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32" /><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M256 58l80 80-80 80" />
    </svg>
    Getting Your Questions..
   </div>
  </div>
  );
}
