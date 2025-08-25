import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, Building, Mail, Phone, MapPin, Menu, X } from 'lucide-react';

// Main App Component
const App = () => {

  return (
    <div className="bg-white text-gray-800 font-sans antialiased">
      {/* Container for the entire application */}
      <main className="min-h-screen">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

// A custom hook to handle scroll animations
const useFadeIn = (threshold = 0.2) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: threshold });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return [ref, controls];
};

// Header component with a responsive navigation bar
const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="absolute top-0 left-0 right-0 z-50 bg-gray-600 bg-opacity-20 backdrop-blur-md shadow-lg"
    >
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-white tracking-widest">
          KPA ENGG
        </a>
        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 text-white">
          <NavItem href="#about" title="About Us" />
          <NavItem href="#services" title="Services" />
          <NavItem href="#projects" title="Projects" />
          <NavItem href="#contact" title="Contact" />
        </ul>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>
      {/* Mobile Navigation */}
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: isMenuOpen ? '0%' : '-100%' }}
        transition={{ type: 'tween' }}
        className="absolute top-16 left-0 w-full bg-blue-900 md:hidden overflow-hidden"
      >
        <ul className="flex flex-col items-center py-4 space-y-4 text-white text-lg">
          <MobileNavItem href="#about" title="About Us" onClick={() => setIsMenuOpen(false)} />
          <MobileNavItem href="#services" title="Services" onClick={() => setIsMenuOpen(false)} />
          <MobileNavItem href="#projects" title="Projects" onClick={() => setIsMenuOpen(false)} />
          <MobileNavItem href="#contact" title="Contact" onClick={() => setIsMenuOpen(false)} />
        </ul>
      </motion.div>
    </motion.header>
  );
};

const NavItem = ({ href, title }) => (
  <li>
    <a
      href={href}
      className="relative text-lg before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-white before:transition-all before:duration-300 hover:before:w-full"
    >
      {title}
    </a>
  </li>
);

const MobileNavItem = ({ href, title, onClick }) => (
  <li>
    <a href={href} className="block w-full py-2 text-center" onClick={onClick}>
      {title}
    </a>
  </li>
);

// Hero Section
const HeroSection = () => {
  const [ref, controls] = useFadeIn();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="relative rounded-3xl my-10 mx-12 h-screen flex items-center justify-center text-center text-white overflow-hidden"
    >
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1485083269755-a7b559a4fe5e?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          filter: '',
          transform: 'scale(1.05)',
        }}
      ></div>
      <div className="absolute inset-0 bg-black-900 opacity-70"></div>

      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
        }}
        className="z-10 px-4" // z-index is applied here
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
          Engineering Excellence
        </h1>
        <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto">
          Delivering comprehensive mechanical and civil construction services for a sustainable future.
        </p>
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-blue-900 py-3 px-8 rounded-full font-semibold shadow-xl transition-colors duration-300 hover:bg-gray-200"
        >
          Get in Touch
        </motion.a>
      </motion.div>
    </div>
  );
};

// About Us Section
const AboutSection = () => {
  const [ref, controls] = useFadeIn();

  return (
    <motion.section
      id="about"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.3 } },
      }}
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-4xl font-bold text-center mb-12">
          About Us
        </motion.h2>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}
            className="md:w-1/2"
          >
            <img
              src="https://placehold.co/600x400/D1D5DB/1F2937?text=Our+Team"
              alt="KPA Engg Team"
              className="rounded-xl shadow-lg w-full"
            />
          </motion.div>
          <motion.div
            variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }}
            className="md:w-1/2"
          >
            <p className="text-lg leading-relaxed mb-6">
              KPA Engineering Pvt. Ltd. is a premier mechanical and civil construction company, founded on the principles of quality, safety, and timely project delivery. With decades of experience, we specialize in a wide range of turnkey projects for various industries including petrochemical, chemical, power plants, and more.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Our team of skilled professionals is dedicated to providing innovative and reliable engineering solutions. We take pride in our ability to adapt to technological changes and maintain a high standard of excellence, ensuring every project is completed to the utmost satisfaction of our clients.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center text-blue-600 font-semibold transition-colors duration-300 hover:text-blue-800"
            >
              Learn More <span aria-hidden="true" className="ml-1 text-2xl leading-none">&rarr;</span>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

// Services Section
const ServicesSection = () => {
  const [ref, controls] = useFadeIn();

  const services = [
    {
      title: 'Mechanical Construction',
      description: 'Expertise in fabrication, erection, and commissioning of equipment, storage tanks, and piping systems.',
      icon: <Briefcase className="text-blue-600" size={40} />,
    },
    {
      title: 'Civil Construction',
      description: 'Comprehensive civil construction services, including industrial and residential building projects.',
      icon: <Building className="text-blue-600" size={40} />,
    },
    {
      title: 'Turnkey Projects',
      description: 'Managing entire projects from design and planning to execution, ensuring a seamless and efficient process.',
      icon: <Briefcase className="text-blue-600" size={40} />,
    },
    {
      title: 'Fabrication & Erection',
      description: 'Specialized services for fabricating and erecting structural steel and complex machinery.',
      icon: <Briefcase className="text-blue-600" size={40} />,
    },
  ];

  return (
    <motion.section
      id="services"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } },
      }}
      className="py-16 md:py-24 bg-gray-50"
    >
      <div className="container mx-auto px-4">
        <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-4xl font-bold text-center mb-12">
          Our Services
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="bg-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// Projects Section
const ProjectsSection = () => {
  const [ref, controls] = useFadeIn();

  const projects = [
    {
      title: 'Petrochemical Plant',
      description: 'Turnkey project for a major petrochemical facility.',
      image: 'https://placehold.co/600x400/E2E8F0/1F2937?text=Project+1',
    },
    {
      title: 'Power Plant Commissioning',
      description: 'Erection and commissioning of a new power generation unit.',
      image: 'https://placehold.co/600x400/E2E8F0/1F2937?text=Project+2',
    },
    {
      title: 'Industrial Building',
      description: 'Construction of a large-scale industrial manufacturing facility.',
      image: 'https://placehold.co/600x400/E2E8F0/1F2937?text=Project+3',
    },
    {
      title: 'Storage Tank Fabrication',
      description: 'Design and fabrication of specialized storage tanks.',
      image: 'https://placehold.co/600x400/E2E8F0/1F2937?text=Project+4',
    },
  ];

  return (
    <motion.section
      id="projects"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.1 } },
      }}
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-4xl font-bold text-center mb-12">
          Our Projects
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
              className="relative rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
            >
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              <div className="p-4 bg-white">
                <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// Contact Section
const ContactSection = () => {
  const [ref, controls] = useFadeIn();

  return (
    <motion.section
      id="contact"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } },
      }}
      className="py-16 md:py-24 bg-blue-900 text-white"
    >
      <div className="container mx-auto px-4">
        <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-4xl font-bold text-center mb-12">
          Contact Us
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-12">
          {/* Contact Details */}
          <motion.div variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }} className="md:w-1/2 space-y-6">
            <h3 className="text-2xl font-semibold">Get in Touch</h3>
            <p className="text-gray-300">
              We'd love to hear from you. Fill out the form or contact us directly using the details below.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail size={24} className="text-blue-300" />
                <a href="mailto:info@kpaenggindia.com" className="text-gray-300 hover:text-white">
                  info@kpaenggindia.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={24} className="text-blue-300" />
                <a href="tel:+918888224043" className="text-gray-300 hover:text-white">
                  +91 88882 24043
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={24} className="text-blue-300" />
                <p className="text-gray-300">
                  601, Western Corridor, Adajan Hazira Road, Surat, Gujarat 395009, India
                </p>
              </div>
            </div>
          </motion.div>
          {/* Contact Form */}
          <motion.div variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }} className="md:w-1/2">
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded-lg bg-white bg-opacity-10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 rounded-lg bg-white bg-opacity-10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full p-3 rounded-lg bg-white bg-opacity-10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              ></textarea>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-600 py-3 rounded-lg font-semibold shadow-md transition-colors duration-300 hover:bg-blue-700"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} KPA ENGG. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default App;
