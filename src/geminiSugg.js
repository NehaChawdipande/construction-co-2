import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Menu, X, Phone, Mail, MapPin, Building, Wrench, HardHat, Lightbulb, Target, Eye, Award, Users, TrendingUp, Calendar } from 'lucide-react';

// Animation Variants for Framer Motion
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

const fromLeftVariant = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
};

const fromRightVariant = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
};

// Custom CountUp Component
const CountUpAnimation = ({ end, duration = 3 }) => {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60; // 60fps
  const totalFrames = Math.round((duration * 1000) / frameRate);
  const easeOutQuad = t => t * (2 - t);

  useEffect(() => {
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      setCount(Math.round(end * progress));

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [end, duration, totalFrames]);

  return <span>{count}</span>;
};


// Helper Component for Animated Sections
const AnimatedSection = ({ children, className, variants = itemVariants }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'About Us', 'Services', 'Projects', 'Clients', 'Contact Us'];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" className={`font-bold text-2xl ${isScrolled || isMenuOpen ? 'text-gray-900' : 'text-white'}`}>
              KPA Engg
            </a>
          </div>
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              {navLinks.map(link => (
                <li key={link}>
                  <a href="#" className={`font-medium transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-200'}`}>{link}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden md:block">
            <a href="#" className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
              Get a Quote
            </a>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={isScrolled ? 'text-gray-900' : 'text-white'}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white"
        >
          <ul className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map(link => (
              <li key={link}>
                <a href="#" className="font-medium text-gray-600 hover:text-blue-600">{link}</a>
              </li>
            ))}
            <li>
              <a href="#" className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300">
                Get a Quote
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  );
};

// Hero Section Component
const Hero = () => {
  const slides = [
    {
      bg: "https://placehold.co/1920x1080/334155/e2e8f0?text=Industrial+Engineering",
      title: "Excellence in Engineering Solutions",
      subtitle: "Providing innovative and sustainable solutions for complex industrial challenges."
    },
    {
      bg: "https://placehold.co/1920x1080/1e293b/e2e8f0?text=Construction+Site",
      title: "Building the Future, Today",
      subtitle: "Committed to quality, safety, and timely delivery of every project we undertake."
    },
    {
      bg: "https://placehold.co/1920x1080/0f172a/e2e8f0?text=Project+Planning",
      title: "Precision in Every Detail",
      subtitle: "From concept to completion, our expert team ensures perfection at every stage."
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${slide.bg})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      ))}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <motion.h1 
          key={currentSlide}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          {slides[currentSlide].title}
        </motion.h1>
        <motion.p 
          key={currentSlide + 'sub'}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-lg md:text-xl max-w-3xl mb-8"
        >
          {slides[currentSlide].subtitle}
        </motion.p>
        <motion.a
          key={currentSlide + 'btn'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          href="#" 
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          Read More
        </motion.a>
      </div>
      <button onClick={prevSlide} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 z-20">
        <ChevronLeft size={32} />
      </button>
      <button onClick={nextSlide} className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 z-20">
        <ChevronRight size={32} />
      </button>
    </section>
  );
};

// NEW About Section Component
const About = () => {
    const journey = [
        { year: "1992", event: "Company Inception", description: "KPA Engineering was founded with a vision to provide top-tier engineering solutions." },
        { year: "2001", event: "First Major Project", description: "Successfully completed our first large-scale industrial project, setting a benchmark for quality." },
        { year: "2010", event: "ISO Certification", description: "Achieved ISO 9001 certification, a testament to our commitment to quality management." },
        { year: "2018", event: "Expansion Overseas", description: "Expanded our operations internationally, undertaking projects in the Middle East." },
        { year: "2023", event: "Innovation Award", description: "Recognized with the 'Excellence in Engineering Innovation' award for our sustainable design solutions." }
    ];

    const whyUs = [
        { icon: <Award className="w-8 h-8 text-blue-500"/>, title: "Proven Expertise", description: "Decades of experience in delivering successful projects across various sectors." },
        { icon: <Users className="w-8 h-8 text-blue-500"/>, title: "Client-Centric Approach", description: "We prioritize client needs, ensuring satisfaction and building long-term partnerships." },
        { icon: <Lightbulb className="w-8 h-8 text-blue-500"/>, title: "Innovative Solutions", description: "Utilizing cutting-edge technology to provide efficient and sustainable results." },
        { icon: <HardHat className="w-8 h-8 text-blue-500"/>, title: "Safety First", description: "Adhering to the highest safety standards to ensure a secure working environment." }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* About Intro */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <AnimatedSection variants={fromLeftVariant}>
                        <img src="https://placehold.co/600x450/dbeafe/1e3a8a?text=KPA+Engineering" alt="About Us" className="rounded-lg shadow-xl w-full" />
                    </AnimatedSection>
                    <AnimatedSection variants={fromRightVariant}>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">About KPA Engineering</h2>
                        <p className="text-gray-600 mb-4">
                            KPA Engineering Pvt. Ltd., an ISO 9001, 14001 & OHSAS 18001 Certified company, has been a cornerstone in engineering construction since 1992. Headquartered in Surat, Gujarat, we have a rich history of completing diverse projects for industries like Petro-chemical, Power, Cement, and more.
                        </p>
                        <p className="text-gray-600">
                            Our reputation is built on a foundation of quality, safety, and timely execution. We are dedicated to being a complete solution provider in fabrication, erection, and commissioning, including turnkey projects.
                        </p>
                    </AnimatedSection>
                </div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    <AnimatedSection variants={fromLeftVariant} className="bg-gray-50 p-8 rounded-lg shadow-lg">
                        <div className="flex items-center mb-4">
                            <Target className="w-12 h-12 text-blue-600 mr-4"/>
                            <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
                        </div>
                        <p className="text-gray-600">To provide exceptional engineering services by delivering innovative and cost-effective solutions. We aim to exceed client expectations through our commitment to quality, safety, and timely project completion, fostering sustainable growth for our company and stakeholders.</p>
                    </AnimatedSection>
                    <AnimatedSection variants={fromRightVariant} className="bg-gray-50 p-8 rounded-lg shadow-lg">
                        <div className="flex items-center mb-4">
                            <Eye className="w-12 h-12 text-blue-600 mr-4"/>
                            <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
                        </div>
                        <p className="text-gray-600">To be a globally recognized leader in the engineering and construction industry, renowned for our excellence, innovation, and unwavering commitment to our clients' success. We aspire to shape a better future through sustainable and landmark projects.</p>
                    </AnimatedSection>
                </div>

                {/* Why Choose Us */}
                <div className="mb-24">
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800">Why Choose Us?</h2>
                        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Our dedication and expertise set us apart.</p>
                    </AnimatedSection>
                    <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                        {whyUs.map((item, index) => (
                            <motion.div key={index} variants={itemVariants} className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                                <div className="flex justify-center mb-4">{item.icon}</div>
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h4>
                                <p className="text-gray-600">{item.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Journey Timeline */}
                <div>
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-800">Our Journey</h2>
                        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Tracing our milestones since 1992.</p>
                    </AnimatedSection>
                    <div className="relative">
                        {/* The vertical line */}
                        <div className="absolute left-1/2 h-full w-0.5 bg-blue-200 transform -translate-x-1/2"></div>
                        {journey.map((item, index) => (
                            <AnimatedSection key={index} className="mb-8 flex justify-between items-center w-full" variants={index % 2 === 0 ? fromLeftVariant : fromRightVariant}>
                                <div className={`w-5/12 ${index % 2 === 0 ? 'order-1' : 'order-3'}`}></div>
                                <div className="z-10 flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full text-white font-bold order-2">
                                    <Calendar className="w-6 h-6"/>
                                </div>
                                <div className={`w-5/12 p-6 bg-gray-50 rounded-lg shadow-lg ${index % 2 === 0 ? 'order-3 text-left' : 'order-1 text-right'}`}>
                                    <p className="text-blue-600 font-bold text-xl mb-1">{item.year}</p>
                                    <h4 className="font-semibold text-gray-800 mb-2">{item.event}</h4>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};


// Stats Section Component
const Stats = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

    const stats = [
        { value: 25, label: "Years Experience" },
        { value: 450, label: "Projects Completed" },
        { value: 300, label: "Happy Clients" },
        { value: 50, label: "Expert Staff" }
    ];

    return (
        <section ref={ref} className="py-20 bg-cover bg-fixed bg-center" style={{ backgroundImage: "url('https://placehold.co/1920x400/1e293b/475569?text=Parallax+BG')" }}>
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                    {stats.map((stat, index) => (
                        <motion.div key={index} initial={{opacity: 0, y: 30}} animate={inView ? {opacity: 1, y: 0} : {}} transition={{duration: 0.5, delay: index * 0.2}}>
                            <h3 className="text-4xl md:text-5xl font-bold text-blue-400">
                                {inView && <CountUpAnimation end={stat.value} duration={3} />}+
                            </h3>
                            <p className="text-lg font-medium mt-2">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Services Section Component
const Services = () => {
  const services = [
    { icon: <Building size={40} />, title: "Structural Design", description: "Comprehensive structural analysis and design for commercial and industrial buildings." },
    { icon: <Wrench size={40} />, title: "Mechanical Engineering", description: "Expert solutions for HVAC, plumbing, and fire protection systems." },
    { icon: <HardHat size={40} />, title: "Construction Management", description: "Overseeing projects from inception to completion, ensuring quality and efficiency." },
    { icon: <Lightbulb size={40} />, title: "Project Consulting", description: "Providing expert advice and strategic planning for successful project outcomes." },
    { icon: <MapPin size={40} />, title: "Geotechnical Services", description: "Site investigation and analysis to ensure a solid foundation for your project." },
    { icon: <TrendingUp size={40} />, title: "MEP Engineering", description: "Integrated Mechanical, Electrical, and Plumbing design for modern buildings." },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">We offer a wide range of engineering services to meet the diverse needs of our clients.</p>
        </AnimatedSection>
        
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-blue-600 mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Projects Section Component
const Projects = () => {
  const projects = [
    { img: "https://placehold.co/600x400/60a5fa/1e293b?text=Project+Alpha", title: "Industrial Complex", category: "Completed" },
    { img: "https://placehold.co/600x400/38bdf8/1e293b?text=Project+Beta", title: "Commercial Tower", category: "Ongoing" },
    { img: "https://placehold.co/600x400/0ea5e9/1e293b?text=Project+Gamma", title: "Residential Area", category: "Completed" },
    { img: "https://placehold.co/600x400/0284c7/1e293b?text=Project+Delta", title: "Bridge Construction", category: "Completed" },
    { img: "https://placehold.co/600x400/0369a1/1e293b?text=Project+Epsilon", title: "Power Plant", category: "Ongoing" },
    { img: "https://placehold.co/600x400/075985/1e293b?text=Project+Zeta", title: "Water Treatment Facility", category: "Completed" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Our Projects</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">A glimpse into some of the prestigious projects we have successfully delivered.</p>
        </AnimatedSection>
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {projects.map((project, index) => (
            <motion.div key={index} variants={itemVariants} className="group relative overflow-hidden rounded-lg shadow-lg">
              <img src={project.img} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                <h3 className="text-white text-xl font-bold">{project.title}</h3>
                <p className="text-blue-300 text-sm">{project.category}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Clients Section Component
const Clients = () => {
  const logos = [
    "https://placehold.co/150x80/e2e8f0/475569?text=Client+1",
    "https://placehold.co/150x80/e2e8f0/475569?text=Client+2",
    "https://placehold.co/150x80/e2e8f0/475569?text=Client+3",
    "https://placehold.co/150x80/e2e8f0/475569?text=Client+4",
    "https://placehold.co/150x80/e2e8f0/475569?text=Client+5",
    "https://placehold.co/150x80/e2e8f0/475569?text=Client+6",
  ];
  const extendedLogos = [...logos, ...logos]; // Duplicate for seamless loop

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Our Esteemed Clients</h2>
          <p className="text-gray-600 mt-2">We are proud to have worked with leading organizations.</p>
        </AnimatedSection>
        <div className="relative w-full overflow-hidden mask-image">
          <div className="flex animate-scroll">
            {extendedLogos.map((logo, index) => (
              <div key={index} className="flex-shrink-0 w-1/3 md:w-1/6 p-4">
                <img src={logo} alt={`Client logo ${index + 1}`} className="mx-auto grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .mask-image {
          -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
          mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
        }
      `}</style>
    </section>
  );
};

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-gray-300">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-bold text-white mb-4">KPA Engg</h3>
          <p className="text-sm">
            Your trusted partner in engineering excellence. We are committed to delivering innovative and sustainable solutions for a better future.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-400">About Us</a></li>
            <li><a href="#" className="hover:text-blue-400">Services</a></li>
            <li><a href="#" className="hover:text-blue-400">Projects</a></li>
            <li><a href="#" className="hover:text-blue-400">Contact Us</a></li>
          </ul>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-400">Structural Design</a></li>
            <li><a href="#" className="hover:text-blue-400">Mechanical Engineering</a></li>
            <li><a href="#" className="hover:text-blue-400">Construction Management</a></li>
            <li><a href="#" className="hover:text-blue-400">Project Consulting</a></li>
          </ul>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <MapPin size={16} className="mr-3 mt-1 flex-shrink-0" />
              <span>123 Engineering Lane, Surat, Gujarat, 395009, India</span>
            </li>
            <li className="flex items-center">
              <Mail size={16} className="mr-3" />
              <a href="mailto:info@kpaengg.com" className="hover:text-blue-400">info@kpaengg.com</a>
            </li>
            <li className="flex items-center">
              <Phone size={16} className="mr-3" />
              <a href="tel:+911234567890" className="hover:text-blue-400">+91 123 456 7890</a>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
    <div className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Mohanty Constructions. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);


// Main App Component
export default function App() {
  return (
    <div className="bg-white font-sans">
      <Header />
      <main>
        <Hero />
        <About />
        <Stats />
        <Services />
        <Projects />
        <Clients />
      </main>
      <Footer />
    </div>
  );
}
