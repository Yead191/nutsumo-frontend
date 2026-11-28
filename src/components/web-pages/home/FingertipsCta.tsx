import Link from "next/link";
import Image from "next/image";

export function FingertipsCta() {
  return (
    <section className="bg-white pb-20 sm:pb-28 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#4A0D1E] px-6 py-12 sm:px-14 sm:py-16 lg:py-20">
          {/* Image on the right, fading into the brand color */}
          <div className="absolute inset-y-0 right-0 hidden md:block w-1/2">
            <Image
              src="/images/why-choose/pro-craftsman.jpg"
              alt=""
              fill
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#4A0D1E] via-[#4A0D1E]/40 to-transparent" />
          </div>
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />

          <div className="relative max-w-lg">
            <h2 className="font-display text-4xl sm:text-5xl font-semibold leading-tight text-white!">
              Skilled help at your{" "}
              <span className="text-primary">fingertips</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/75">
              Post your job for free, compare quotes from verified pros, and
              pay only when you&apos;re happy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/account/post-job"
                className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Post a job
              </Link>
              <Link
                href="/pro-register"
                className="inline-flex items-center rounded-lg border border-white/50 px-6 py-3 text-base font-semibold text-white! hover:bg-white/10 transition-colors"
              >
                Become a pro
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
