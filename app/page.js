import Testimonials from "@/components/CarouselComponent";
import SectionDivider from "@/components/SectionDivider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <>
      <section className="relative w-full h-[65vh] overflow-hidden">

        {/* Background Image using next/image */}
        <Image
          src="/images/pexels-eneminess-9418435.jpg"
          alt="Students studying in a university library"
          fill
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Overlay for text readability (using a dark, translucent black/gray) */}
        <div className="absolute inset-0 bg-gray-900 opacity-30"></div>

        <div className="relative z-10 flex flex-col gap-4 items-center justify-center h-full text-center p-4">

          {/* Title: Tailwind Fade-In-Up Effect */}
          <h1
            className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg translate-y-4 animate-in fade-in duration-1000 slide-in-from-bottom-4"
          >
            Unlock a World of Knowledge
          </h1>

          <p
            className="text-white text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl font-light drop-shadow-md translate-y-4 animate-in fade-in duration-1000 slide-in-from-bottom-4 delay-200"
          >
            Your ultimate hub for shared university notes and study resources.
          </p>

          <Link href="/resources" passHref>
            <Button className={"scale-125"} size={"lg"}>Explore Now</Button>
          </Link>
        </div>
      </section>

      <SectionDivider />

      {/* Invitation To Contribution */}
      <section className="py-16 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Left Side: Image */}
            <div className="mb-10 lg:mb-0 relative h-96 w-full rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/images/share-resources.jpg"
                alt="Students collaborating and sharing study materials"
                layout="fill"
                objectFit="cover"
                priority
                className="transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Right Side: Text Content */}
            <div className="space-y-6">
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                <span className="block text-blue-600 dark:text-blue-500">Amplify Our Learning Community.</span>
                Share Your Resources.
              </h2>
              <p className="text-xl leading-relaxed">
                The strength of a university notes platform lies in its community. By sharing your well-organized notes, past papers, or insightful study guides, you empower countless fellow students to succeed in their academic journeys.
              </p>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                Every contribution helps build a richer, more comprehensive repository for everyone. It's a simple, impactful way to give back and foster a culture of collective success.
              </p>

              {/* Call to Action Button */}
              <div className="pt-4 flex justify-center items-center md:block">
                <Link className="flex items-center justify-center md:block" href="/signup" passHref>
                  <Button
                    className="px-20 py-5 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
                    variant="default"
                  >
                    Start Contributing Today →
                    <svg className="ml-3 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <div>
        <h2 className="text-4xl sm:text-5xl text-center mt-10 font-extrabold tracking-tight mb-6 leading-tight">
          <span className="block"><span className="text-6xl sm:text-7xl">"</span>Our Testimonials<span className="text-6xl sm:text-7xl">"</span></span>
        </h2>
        <Testimonials />
      </div>

      <SectionDivider />

      {/* About Section */}
      <section className="py-16 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">

            {/* Left Side: Text Content */}
            <div className="md:w-1/2 md:text-left">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900 dark:text-white">
                <span className="block">Crafting Digital Excellence,</span>
                <span className="block text-blue-600 dark:text-blue-50">One Project at a Time.</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                We are a team of passionate innovators dedicated to transforming ideas into impactful digital solutions. With a focus on user-centric design and cutting-edge technology, we try to build experiences that not only look stunning but also drive results.
              </p>

              {/* Button to About Page */}
              <div className="pt-4 flex justify-center items-center md:block">
                <Link className="flex items-center justify-center md:block" href="/about" passHref >
                  <Button
                    className="px-20 py-5 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
                    variant="default"
                  >
                    Learn More About Us
                    <svg className="ml-3 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side: Image */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl aspect-video rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
                <Image
                  src="/images/about-us-hero.jpg"
                  alt="Team collaborating on a project"
                  layout="fill"
                  objectFit="cover"
                  quality={90}
                  className="rounded-lg"
                />
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Contact Section */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

            {/* Right Side: Image/Visual */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative w-full max-w-md md:max-w-lg aspect-video rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
                <Image
                  src="/images/contact-us-visual.jpg"
                  alt="A team ready to provide support"
                  layout="fill"
                  objectFit="cover"
                  quality={90}
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Left Side: Text Content and Link */}
            <div className="md:w-1/2 md:text-left">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                <span className="block">Have Something In Your Mind?</span>
                <span className="block text-blue-600 dark:text-blue-500">Reach Out to Our Team.</span>
              </h2>

              <p className="text-lg sm:text-xl mb-8 leading-relaxed">
                Whether you have technical questions, feedback on the platform, or want to discuss a new feature, we are here to listen. Click below to find all our contact details.
              </p>

              {/* Link/Button */}
              <div className="pt-4 flex justify-center items-center md:block">
                <Link className="flex items-center justify-center md:block" href="/contact" passHref >
                  <Button
                    className="px-20 py-5 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
                    variant="default"
                  >
                    View Contact Information
                    <svg className="ml-3 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}