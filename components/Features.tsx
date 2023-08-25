'use client';

import Lottie from "lottie-react";
import styles from '@/styles';

import learn from "../public/learn.json";
import review from "../public/review.json";
import test from "../public/test.json";
import exams from "../public/exams.json";

const featureData = [
  {
    heading: "Gain the CBT Experience!",
    description: "Jambite replicates the JAMB Computer Based Test experience with a realistic interface, question formats, and performance analytics.",
    image: learn,
  },
  {
    heading: "17 Subjects - You're covered!",
    description: "Our comprehensive platform offers questions for all the JAMB 17 subjects for Jambites. Images and diagrams appear as in the questions in the real JAMB exam.",
    image: exams,
  },
  {
    heading: "Practice with over 5,000 past questions",
    description: "Gain a competitive edge and boost your performance with our extensive collection of over 5,000 past questions. Our comprehensive question bank equips you to excel in your exams.",
    image: test,
  },
  {
    heading: "Accurate Answers and Solutions",
    description: "Rest assured, our answers and solutions have undergone rigorous review by professionals and top tutors. We prioritize accuracy and quality to provide you with reliable guidance.",
    image: review,
  }
];

function Feature ({ heading, description, image }) {
  return (
    <article className="lg:w-1/4 md:w-1/2 p-4">
      <div className={`${styles.blurcard} p-6 h-full`}>
        <div className="flex justify-center">
          <Lottie animationData={image} className="h-40 rounded w-full object-cover object-center mb-6"></Lottie>
        </div>
        <h2 className="text-2xl text-accent-4 text-center font-bold title-font mb-4">{heading}</h2>
        <p className="leading-snug text-base text-content text-center">{description}</p>
      </div>
    </article>
  );
};

export default function Features () {
  return (
    <section>
      <div className="flex items-center flex-wrap w-full mb-6">
        <div className="w-full mb-6 mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-center px-2">We covered ALL JAMB Subjects!</h1>
          <div className="h-1 w-1/3 bg-accent-1 rounded mx-auto"></div>
        </div>
        <p className={`lg:w-3/5 w-full leading-loose text-content mx-auto text-center p-4 ${styles.fontsizemd}`}>
        English Language, Mathematics, Commerce, Accounting, Biology, Physics, Chemistry, Literature-In-English, Government, 
        Christian Religious Knowlegde, Geography, Economics, Islamic Religous Knowlegde, Civic Education, Insurance, Current Affairs, History.
        </p>
      </div>
      <div className="flex flex-wrap w-full">
        {featureData.map((data, index) => (
          <Feature key={index} heading={data.heading} description={data.description} image={data.image} />
        ))}
      </div>
    </section>
  );
};