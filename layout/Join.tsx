import Link from "next/link";

export default function Join () {
  return (
    <section className="bg-sky-600 dark:bg-sky-700 py-6">
      <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white sm:text-4xl">
            Let Jambite take you heights!
          </h2>
          <p className="mt-4 text-base leading-6 text-white">
            Start your journey towards exam success today!
          </p>
          <div className="mt-6">
            <Link href="/signIn" className="inline-flex items-center justify-center px-4 py-2 border rounded-md text-base font-medium text-blue-500 bg-white hover:bg-blue-50">
              Sign Up Now
            </Link>
          </div>
      </div>
    </section>
  );
};