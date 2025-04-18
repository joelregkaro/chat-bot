import { useState, useEffect, useRef } from "react";

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonials = [
    {
      name: "Rajesh Patel",
      role: "CEO, Technovate Solutions",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 5,
      text: "The GST code finder tool solved me countless hours of searching. The level of expertise is incredible and user friendly. RegisterKaro has truly simplified GST compliance for my business",
      tool: "GST Code Finder",
    },
    {
      name: "Priya Sharma",
      role: "CFO, GrowthTech Industries",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 5,
      text: "The compliance tools have revolutionized how we handle regulatory requirements. It's like having a legal expert at your fingertips.",
      tool: "Compliance Checker",
    },
    {
      name: "Amit Kumar",
      role: "Director, Smart Solutions",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 5,
      text: "The document verification system is incredibly accurate and saves us hours of manual work. Highly recommended!",
      tool: "Document Verifier",
    },
    {
      name: "Neha Gupta",
      role: "Legal Head, InnovateCorp",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 5,
      text: "The automated compliance checks have reduced our risk of errors by 90%. It's an indispensable tool for our legal team.",
      tool: "Compliance Checker",
    },
    {
      name: "Arun Singh",
      role: "Founder, TechStart India",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 5,
      text: "As a startup founder, this platform has been a game-changer. The GST filing process is now seamless and error-free.",
      tool: "GST Filing Assistant",
    },
    {
      name: "Meera Reddy",
      role: "Operations Manager, GlobalTech",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 5,
      text: "The document management system is intuitive and efficient. It has streamlined our entire compliance process.",
      tool: "Document Manager",
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
                      src={testimonial.image}
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
                    <svg
                      key={star}
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-darkgray text-base mb-5 leading-relaxed italic relative">
                  <span className="absolute -left-4 top-0 text-4xl text-blue/20">
                    "
                  </span>
                  {testimonial.text}
                  <span className="absolute -right-4 bottom-0 text-4xl text-orange/20">
                    "
                  </span>
                </p>
                {/* <div className="flex items-center text-sm text-darkgray/70 pt-3 border-t border-gray-100">
                  <span className="font-medium">Tool used:</span>
                  <span className="ml-2 text-blue font-semibold bg-blue/10 px-3 py-1 rounded-full">
                    {testimonial.tool}
                  </span>
                </div> */}
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
