'use client';
import { TypeAnimation } from 'react-type-animation';

export default function Stake() {
  const sentence1Prefix = 'Computer-based tests can be overwhelming for Nigerian students, especially with limited access to computers. Since the launch of JAMB CBT in 2013, countless students have struggled with tech anxiety, causing even the brightest minds to ';
  const sentence1Suffix = '.';
  const sentence2Prefix = " While some solutions have scratched the surface, Jambite offers more than just an application—it's your comprehensive exam experience that transforms anxiety into ";
  const sentence2Suffix = '.';
  const sentence3 = ' Our mission is to bridge the gap, making the transition into higher education smooth for senior and post-secondary students.';
  const sentence4 = '\nYou want to see what we got? Keep scrolling. ☺️';

  return (
    <div>
      <h2 className="motion-translate-y-in-[100%] motion-translate-x-in-[0%] motion-opacity-in-[0%] motion-duration-[5s] motion-duration-[3.00s]/opacity motion-ease-linear text-center text-4xl font-semibold">Why we built Jambite</h2>
    </div>
    // <TypeAnimation
    //   sequence={[
    //     'Let’s face it.',
    //     1000,
    //     '',
    //     500,
    //     sentence1Prefix + 'trudge',
    //     1000,
    //     sentence1Prefix + 'lurch',
    //     1000,
    //     sentence1Prefix + 'stumble' + sentence1Suffix,
    //     1000,
    //     sentence1Prefix + 'stumble' + sentence1Suffix + sentence2Prefix + 'strenght',
    //     1000,
    //     sentence1Prefix + 'stumble' + sentence1Suffix + sentence2Prefix + 'confidence',
    //     1000,
    //     sentence1Prefix + 'stumble' + sentence1Suffix + sentence2Prefix + 'excellence' + sentence2Suffix,
    //     1000,
    //     sentence1Prefix + 'stumble' + sentence1Suffix + sentence2Prefix + 'excellence' + sentence2Suffix + sentence3,
    //     1000,
    //     sentence1Prefix + 'stumble' + sentence1Suffix + sentence2Prefix + 'excellence' + sentence2Suffix + sentence3,
    //     5000,
    //     sentence1Prefix + 'stumble' + sentence1Suffix + sentence2Prefix + 'excellence' + sentence2Suffix + sentence3 + sentence4,
    //     1000,
    //   ]}
    //   wrapper="p"
    //   cursor={true}
    //   speed={50}
    //   repeat={0}
    // />
  );
}
