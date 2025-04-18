import { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react";

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Founder, TechStart Solutions",
      content:
        "RegisterKaro made our company registration process incredibly smooth. Their team was always available to answer our questions and guided us through every step. Highly recommended!",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200&h=200&fit=crop&crop=faces&q=80",
    },
    {
      name: "Priya Patel",
      role: "CEO, GreenEarth Organics",
      content:
        "As a first-time entrepreneur, I was nervous about the registration process. RegisterKaro's team made it so simple and stress-free. Their expertise and support were invaluable.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=200&h=200&fit=crop&crop=faces&q=80",
    },
    {
      name: "Arjun Mehta",
      role: "Director, Mehta & Sons Trading",
      content:
        "We've used RegisterKaro for multiple business registrations. Their service is consistently excellent, and they handle all the paperwork efficiently. A trusted partner for our business needs.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=200&h=200&fit=crop&crop=faces&q=80",
    },
    {
      name: "Ananya Gupta",
      role: "Founder, Creative Minds Academy",
      content:
        "The team at RegisterKaro is professional and knowledgeable. They helped us navigate the complex registration process with ease. Their customer service is outstanding!",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=200&h=200&fit=crop&crop=faces&q=80",
    },
    {
      name: "Vikram Singh",
      role: "Managing Director, Singh Enterprises",
      content:
        "RegisterKaro's expertise in company registration is unmatched. They provided clear guidance and completed the process much faster than we expected. Excellent service!",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=200&h=200&fit=crop&crop=faces&q=80",
    },
    {
      name: "Neha Kapoor",
      role: "CEO, Kapoor Fashion House",
      content:
        "I was impressed by RegisterKaro's attention to detail and prompt responses. They made the registration process seamless and were always available to address our concerns.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=200&h=200&fit=crop&crop=faces&q=80",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Add window resize handler
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add effect to handle scrolling on mobile
  useEffect(() => {
    if (isMobile && containerRef.current) {
      const container = containerRef.current;
      const cardWidth = container.offsetWidth * 0.85; // 85vw
      const scrollPosition = currentSlide * (cardWidth + 32); // 32 is the gap (gap-8 = 2rem = 32px)

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [currentSlide, isMobile]);

  return (
    <section className="py-16 bg-gradient-to-br from-light-orange via-blue-50/30 to-orange-50/30 relative overflow-hidden">
      {/* Floating avatars */}
      <div className="absolute -left-10 top-20 opacity-20 animate-pulse">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Floating avatar"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>
      <div className="absolute right-20 top-10 opacity-20 animate-pulse delay-300">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Floating avatar"
          width={60}
          height={60}
          className="rounded-full"
        />
      </div>
      <div className="absolute left-1/3 bottom-20 opacity-20 animate-pulse delay-700">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Floating avatar"
          width={70}
          height={70}
          className="rounded-full"
        />
      </div>
      <div className="absolute right-1/4 bottom-40 opacity-20 animate-pulse delay-500">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Floating avatar"
          width={50}
          height={50}
          className="rounded-full"
        />
      </div>

      <div className="container mx-auto relative z-10">
        <h2 className="text-4xl font-bold text-blue text-center mb-3">
          What Our Users Say
        </h2>
        <p className="text-center text-darkgray mb-12 max-w-2xl mx-auto">
          Hear from businesses that have simplified their compliance journey
          with our tools
        </p>

        <div
          ref={containerRef}
          className="flex md:grid md:grid-cols-3 gap-8 px-4 cursor-pointer overflow-x-auto pb-4 md:pb-0 md:overflow-x-visible snap-x snap-mandatory md:snap-none"
        >
          {(isMobile
            ? testimonials
            : testimonials.slice(currentSlide, currentSlide + 3)
          ).map((testimonial, index) => (
            <div
              key={index}
              className={`relative border rounded-xl p-6 shadow-lg bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex-shrink-0 w-[85vw] md:w-auto snap-center overflow-hidden ${
                isMobile && index === currentSlide
                  ? "ring-2 ring-blue scale-105"
                  : !isMobile && currentSlide + index === currentSlide
                  ? "ring-2 ring-blue scale-105"
                  : ""
              }`}
              style={{
                transition: "all 0.5s ease-in-out",
                opacity:
                  (isMobile && index === currentSlide) ||
                  (!isMobile && currentSlide + index === currentSlide)
                    ? 1
                    : 0.8,
                transform: `translateY(${
                  (isMobile && index === currentSlide) ||
                  (!isMobile && currentSlide + index === currentSlide)
                    ? "-8px"
                    : "0"
                })`,
              }}
            >
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue/5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange/5 rounded-full translate-y-16 -translate-x-16"></div>

              <div className="relative z-10">
                <div className="flex items-center mb-5">
                  <div className="mr-3 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue to-orange rounded-full blur-sm opacity-50"></div>
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full border-4 border-white relative z-10"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-darkgray text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-darkgray/70 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex text-orange mb-3">
                  {[...Array(testimonial.rating)].map((_, star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-darkgray text-base mb-5 leading-relaxed italic relative">
                  <span className="absolute -left-4 top-0 text-4xl text-blue/20">
                    "
                  </span>
                  {testimonial.content}
                  <span className="absolute -right-4 bottom-0 text-4xl text-orange/20">
                    "
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-blue w-6"
                    : "bg-gray-300 hover:bg-gray-400 w-3"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
