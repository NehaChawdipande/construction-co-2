import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Menu, X, Phone, Mail, MapPin, Building, Wrench, HardHat, Lightbulb, Target, Eye, Award, Factory, Users, TrendingUp, Calendar, Send, CheckCheckIcon, CheckCircle, User, Hammer, Globe, RailSymbol, FactoryIcon, Train, Construction } from 'lucide-react';

// --- Animation Variants ---
const pageTransition = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeInOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.4, ease: "easeInOut" } }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
        }
    },
};

// Option 3: A simple, elegant slide-in from the side
const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const fromLeftVariant = {
    hidden: { opacity: 0, x: -100, rotate: -5 },
    visible: {
        opacity: 1,
        x: 0,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 10,
        }
    },
};

const fromRightVariant = {
    hidden: { opacity: 0, x: 100, rotate: 5 },
    visible: {
        opacity: 1,
        x: 0,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 10,
        }
    },
};

const heroTextVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// --- Helper Components ---
const CountUpAnimation = ({ end, duration = 3 }) => {
    const [count, setCount] = useState(0);
    const frameRate = 1000 / 60;
    const totalFrames = Math.round((duration * 1000) / frameRate);
    const easeOutQuad = t => t * (2 - t);

    useEffect(() => {
        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            setCount(Math.round(end * progress));
            if (frame === totalFrames) clearInterval(counter);
        }, frameRate);
        return () => clearInterval(counter);
    }, [end, duration, totalFrames]);

    return <span>{count}</span>;
};

const AnimatedSection = ({ children, className, variants = itemVariants }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
        if (inView) controls.start('visible');
    }, [controls, inView]);

    return (
        <motion.div ref={ref} initial="hidden" animate={controls} variants={variants} className={className}>
            {children}
        </motion.div>
    );
};

const PageWrapper = ({ children }) => (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
        {children}
    </motion.div>
);

const Loader = () => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-[9999] flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
                {/* Outer ring */}
                <motion.div
                    className="w-full h-full border-4 border-white border-opacity-30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                />
                {/* Inner spinner */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, ease: "linear", repeat: Infinity }}
                />
            </div>
            <motion.p
                className="text-white text-lg mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                Loading...
            </motion.p>
        </div>
    );
};


// --- Core Components ---

const Header = ({ setPage, currentPage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = ['Home', 'About Us', 'Services', 'Projects', 'Contact Us', 'Mohanty Projects'];

    const handleNavClick = (page) => {
        const pagePath = page === 'Home' ? '/' : `/${page.toLowerCase().replace(/\s+/g, '-')}`;

        // Change the URL without a page reload
        window.history.pushState({ page: page }, '', pagePath);

        // Update the parent component's state to trigger a re-render
        setPage(page);
        setIsMenuOpen(false);
        window.scrollTo(0, 0);
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 w-screen transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-white shadow-xl' : 'bg-transparent'}`}>
            <div className={`w-screen px-4 sm:px-6 lg:px-8 sm:py-8 ${isMenuOpen? 'sm:pb-2': ''} md:py-4 lg:py-2`}>
                <div className="flex items-center justify-center gap-8 lg:h-20 md:h-30 sm:h-30">
                    <motion.a
                        href="/"
                        onClick={(e) => { e.preventDefault(); handleNavClick('Home'); }}
                        className={`font-bold text-2xl sm:text:xl md:text-xl  ${isScrolled || isMenuOpen ? 'text-gray-800' : 'text-white'}`}
                        whileHover={{ scale: 1.1, rotate: 2 }}
                    >
                        Mohanty Construction Corp.
                    </motion.a>
                    <nav className="hidden md:block">
                        <ul className="flex items-center lg:space-x-8 md:space-x-4 sm:space-x-2">
                            {navLinks.map(link => {
                                const linkHref = link === 'Home' ? '/' : `/${link.toLowerCase().replace(/\s+/g, '-')}`;
                                return (
                                    <motion.li key={link} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
                                        <a href={linkHref} onClick={(e) => { e.preventDefault(); handleNavClick(link); }} className={`sm:text:sm md:text-sm transition-colors duration-300 relative ${isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-200'} ${currentPage === link ? 'text-blue-500' : ''}`}>
                                            {link}
                                            {currentPage === link && <motion.div className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-blue-500" layoutId="underline" />}
                                        </a>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </nav>
                    <div className="hidden md:flex">
                        <motion.a
                            href="/contact-us"
                            onClick={(e) => { e.preventDefault(); handleNavClick('Contact Us'); }}
                            className="bg-blue-900 w-full sm:text:sm md:text-sm text-white px-2 py-2 text-center rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 md:w-36 sm:w-24"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            // style={{ width: "120px" }}
                        >
                            Get a Quote
                        </motion.a>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={isScrolled || isMenuOpen? 'text-gray-900' : 'text-white'}>
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </motion.div>
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white">
                        <ul className={`flex flex-col items-center space-y-4 py-4 ${isMenuOpen && 'pb-12'}`}>
                            {navLinks.map(link => (
                                <motion.li key={link} variants={itemVariants}>
                                    <a href={link === 'Home' ? '/' : `/${link.toLowerCase().replace(/\s+/g, '-')}`} onClick={(e) => { e.preventDefault(); handleNavClick(link); }} className="font-medium text-gray-600 hover:text-blue-600">
                                        {link}
                                    </a>
                                </motion.li>
                            ))}
                            <motion.div variants={itemVariants} className={`${isMenuOpen && 'pt-4'}`}>
                                <a href="/contact-us" onClick={(e) => { e.preventDefault(); handleNavClick('Contact Us'); }} className='bg-blue-900 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700'>
                                    Get a Quote
                                </a>
                            </motion.div>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

const Footer = ({ setPage }) => {
    const handleNavClick = (page) => {
        const pagePath = page === 'Home' ? '/' : `/${page.toLowerCase().replace(/\s+/g, '-')}`;
        window.history.pushState({ page: page }, '', pagePath);
        setPage(page);
        window.scrollTo(0, 0);
    };

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                    <motion.div variants={itemVariants}>
                        <h3 className="text-xl font-bold text-white mb-4">Mohanty Construction Corp.</h3>
                        <p className="text-sm">Your trusted partner in engineering excellence, delivering innovative and sustainable solutions for a better future.</p>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            {['About Us', 'Services', 'Projects', 'Contact Us'].map(link => {
                                const linkHref = `/${link.toLowerCase().replace(/\s+/g, '-')}`;
                                return (
                                    <motion.li key={link} whileHover={{ x: 5, color: '#60A5FA' }}>
                                        <a
                                            href={linkHref}
                                            onClick={(e) => { e.preventDefault(); handleNavClick(link); }}
                                            className="hover:text-blue-400 transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start"><MapPin size={16} className="mr-3 mt-1 flex-shrink-0" /><span>Ground Floor, Chandranil Apartment, Near Tirpude College,
                                Sadar, Nagpur – 440001</span></li>
                            <li className="flex items-center"><Mail size={16} className="mr-3" /><a href="mailto:mohantyconstructioncorporation@gmail.com" className="hover:text-blue-400">mohantyconstructioncorporation@gmail.com</a></li>
                            <li className="flex items-center"><Phone size={16} className="mr-3" /><a href="tel:+919923365525" className="hover:text-blue-400">+91 9923365525</a></li>
                            <li className="flex items-center"><Globe size={16} className="mr-3" /><a href="https://www.indiamart.com/mohantyconstructioncorporation/" target="_blank" rel="noreferrer" className="hover:text-blue-400">IndiaMart Website</a></li>
                        </ul>
                    </motion.div>
                </motion.div>
            </div>
            <div className="bg-gray-800 py-4">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Mohanty Construction Corp.. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

const ClientsPage = () => {
    const logos = [
        "pwd.jpg", "zp.jpg",
        "mfd.png", "ord.jpg",
        "secr.jpg", "cr.jpg", "wr.jpg", "ngp.jpg"
    ];
    const extendedLogos = [...logos, ...logos];

    return (
        <>
            <div className="pt-10 pb-10 bg-gray-50">
                <section className="py-10">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <AnimatedSection className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800">Our Esteemed Clients</h2>
                            <p className="text-gray-600 mt-2">We are proud to have worked with leading organizations.</p>
                        </AnimatedSection>
                        <div className="relative object-contain  w-full overflow-hidden">
                            <div className="flex  object-contain animate-scroll">
                                {extendedLogos.map((logo, index) => (
                                    <div key={index} className="flex-shrink-0 p-4  object-contain " style={{ width: '12rem', height: '12rem' }}>
                                        <img src={logo} alt={`Client logo ${index + 1}`} className="w-full h-full mx-auto  object-contain transition-all duration-300" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <style jsx>{`
                @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .animate-scroll { animation: scroll 30s linear infinite; }
                }
            `}</style>
        </>
    );
};

const HomePage = () => {
    const slides = [
        {
            bg: "https://images.unsplash.com/photo-1566278692283-ca5f64d828d4?q=80&w=1166&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: "Excellence in Engineering Solutions",
            subtitle: "Providing innovative and sustainable solutions for complex industrial challenges."
        },
        {
            bg: "https://images.unsplash.com/photo-1485083269755-a7b559a4fe5e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: "Building the Future, Today",
            subtitle: "Committed to quality, safety, and timely delivery of every project we undertake."
        },
        {
            bg: "https://images.unsplash.com/photo-1568057373106-63057e421d1c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: "Precision in Every Detail",
            subtitle: "From concept to completion, our expert team ensures perfection at every stage."
        }
    ];
    const [currentSlide, setCurrentSlide] = useState(0);
    const nextSlide = () => setCurrentSlide(p => (p === slides.length - 1 ? 0 : p + 1));
    const prevSlide = () => setCurrentSlide(p => (p === 0 ? slides.length - 1 : p - 1));
    useEffect(() => { const i = setInterval(nextSlide, 5000); return () => clearInterval(i); }, []);

    // Staggered text animation variants
    const heroTitleWords = slides[currentSlide].title.split(" ");
    const heroSubtitleWords = slides[currentSlide].subtitle.split(" ");
    const titleContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };
    const titleItem = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <PageWrapper>
            <section className="relative h-screen w-full overflow-hidden">
                <AnimatePresence>
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 1.8, ease: "easeInOut" }}
                        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[currentSlide].bg})` }}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    </motion.div>
                </AnimatePresence>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                    <motion.h1 key={currentSlide + 't'} className="text-4xl px-10 md:text-6xl font-bold mb-4" variants={titleContainer} initial="hidden" animate="visible">
                        {heroTitleWords.map((word, index) => (
                            <motion.span key={index} className="inline-block mr-2" variants={titleItem}>{word}</motion.span>
                        ))}
                    </motion.h1>
                    <motion.p key={currentSlide + 's'} className="text-lg md:text-xl max-w-3xl mb-8" variants={titleContainer} initial="hidden" animate="visible">
                        {heroSubtitleWords.map((word, index) => (
                            <motion.span key={index} className="inline-block mr-1" variants={titleItem}>{word}</motion.span>
                        ))}
                    </motion.p>
                </div>
                <motion.button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 z-20"
                    whileHover={{ scale: 1.2, rotate: -10 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronLeft size={32} />
                </motion.button>
                <motion.button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 z-20"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronRight size={32} />
                </motion.button>
            </section>
            <AboutSectionPreview />
            <StatsSection />
            <ServicesSectionPreview />
            <WhyChooseUsPreview />
            <FeaturedProjectsPreview />
            <ClientsPage />
        </PageWrapper>
    );
};

const AboutPage = () => {
    const journey = [
        { year: "1992", event: "Company Inception", description: "Mohanty Construction Corp. was founded with a vision to provide top-tier engineering solutions." },
        { year: "2001", event: "First Major Project", description: "Successfully completed our first large-scale industrial project, setting a benchmark for quality." },
        { year: "2010", event: "ISO Certification", description: "Achieved ISO 9001 certification, a testament to our commitment to quality management." },
        { year: "2018", event: "Expansion Overseas", description: "Expanded our operations internationally, undertaking projects in the Middle East." },
        { year: "2023", event: "Innovation Award", description: "Recognized with the 'Excellence in Engineering Innovation' award for our sustainable design solutions." }
    ];
    const whyUs = [
        { icon: <Award className="w-8 h-8 text-blue-500" />, title: "Proven Track Record", description: "We are a specialized extension of Mohanty Construction Corporation, a company with a long-standing history of success in the infrastructure and construction sector." },
        { icon: <Users className="w-8 h-8 text-blue-500" />, title: "Specialized Expertise", description: "Our company was specifically created to focus on the technologically intensive and mission-critical domain of railway signaling and telecommunication (S&T) works." },
        { icon: <Lightbulb className="w-8 h-8 text-blue-500" />, title: "Comprehensive Solutions", description: "By combining the robust civil construction capabilities of our parent company with our specialized technical knowledge, we offer a complete, end-to-end solution for railway infrastructure projects." },
        { icon: <CheckCircle className="w-8 h-8 text-blue-500" />, title: "Commitment to Quality", description: "We have a team of qualified professionals dedicated to upholding stringent quality and safety standards, ensuring that we deliver projects of national importance with integrity and precision" }

    ];

    const teamMembers = [
        { name: "Mohd Iqbal Abdul Sattar", details: "M. Sc Electronics" },
        { name: "Sonali Basant Mohanty", details: "Financial Consultant" },
        { name: "Kazi Tafheem Ali Khan", details: "B.E Civil Engineering" },
        { name: "Vikas Modiwala", details: "B.E Mechanical Engineering" },
        { name: "Kazi Faraz Ali Khan", details: "Management Consultant" },
        { name: "Sowrabh Basant Mohanty", details: "Management Consultant" },
        { name: "Zakiruddin Shaikh", details: "B.E. Mechanical Engineering" }
    ];


    return (
        <PageWrapper>
            <div className=" w-full pt-20 absolute top-0 left-0  bg-cover bg-center bg-gray-900" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1706977527005-c430d7f977ce?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`, height: '100%' }} >
                {/* This is the new div for the blur overlay */}
            </div><div className="absolute top-0 left-0 w-full h-full backdrop-filter backdrop-blur-md" style={{ height: "100%" }}></div>
            <section className="py-20 relative h-full">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 md:gap-6 lg:gap-8 items-center mb-24">
                        <AnimatedSection variants={fromLeftVariant}><img src="https://images.unsplash.com/photo-1727786550996-4fa0512e633b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="About Us" className="rounded-lg shadow-xl align-center justify-center w-full h-1/2" /></AnimatedSection>

                        <AnimatedSection variants={fromRightVariant} className="mt-6">

                            <div className="max-w-4xl mx-auto my-8 p-6 rounded-xl shadow-lg bg-white border border-white text-gray-700 p-12">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-3xl md:text-2xl font-bold">About Mohanty Construction Corp.</h2>
                                </div>
                                <p className="text-gray-700 text-sm mb-4">
                                    Mohanty Construction Corp. Pvt. Ltd., is Registered Under MSME (ISO 9001:2015 CERTIFIED FIRM) and has been a cornerstone in engineering construction. <br /> <br />
                                    In the 2017 Independence Day speech, Prime Minister Narendra Modi gave a call for building a 'New India' by 2022. A key pillar for 'New India' is its infrastructure; from roads to dams to power plants to affordable housing, 'New India' will be built for the successes of tomorrow. As a growing Engineering, Procurement and Construction (EPC) company in India, Mohanty Construction Corporation is aligning with India’s growth vision. Mohanty Construction Corporation is productively contributing by leveraging its execution process and engineering strengths. We can also nimbly capitalize on new opportunities uncovered on India’s path to growth.
                                </p>
                                <p className="text-gray-700 text-sm">
                                    Our reputation is built on a foundation of quality, safety, and timely execution. We are dedicated to being a complete solution provider in fabrication, erection, and commissioning, including turnkey projects.
                                </p>
                            </div>
                        </AnimatedSection>

                    </div>
                    <div>
                        <AnimatedSection variants={fromRightVariant}>
                            <h3 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Values</h3>
                        </AnimatedSection>

                    </div>
                    <div className="grid md:grid-cols-2 gap-8 mb-24">
                        <AnimatedSection variants={fromLeftVariant} className="bg-gray-50 p-8 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4"><Target className="w-12 h-12 text-blue-600 mr-4" /><h3 className="text-2xl font-bold text-gray-800">Our Mission</h3></div>
                            <p className="text-gray-600">To be the customer's preferred choice by providing innovative, high-quality, and safe construction services through a robust supply chain and a commitment to developing our people and building a reputation of trust.</p>
                        </AnimatedSection>
                        <AnimatedSection variants={fromRightVariant} className="bg-gray-50 p-8 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4"><Eye className="w-12 h-12 text-blue-600 mr-4" /><h3 className="text-2xl font-bold text-gray-800">Our Vision</h3></div>
                            <p className="text-gray-600">To be the industry leader and a market driven engineering construction company renowned for excellence, quality, performance and reliability in all types of construction.</p>
                        </AnimatedSection>
                    </div>
                    <div className="mb-24">
                        <AnimatedSection className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-800">Why Choose Us?</h2></AnimatedSection>
                        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                            {whyUs.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="text-center p-6 bg-white rounded-lg border border-gray-200"
                                    whileHover={{ scale: 1.05, y: -5, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
                                >
                                    <motion.div className="flex justify-center mb-4" whileHover={{ rotate: 360, transition: { duration: 0.8 } }}>{item.icon}</motion.div>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h4>
                                    <p className="text-gray-600">{item.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                    <div className="mb-24">
                        {/* Our Team section - Added based on the user request */}
                        {/* <div className="mb-24"> */}
                        <AnimatedSection className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-800">Our Team</h2></AnimatedSection>
                        {/* <div className="bg-gray-50 p-8 rounded-lg shadow-lg"> */}
                        <p className="text-gray-600 mb-6 text-center">
                            Our highly experienced and diligent team of professionals assists us in offering best quality products to
                            our clients which are made in complete compliance with international quality standards. Our professionals
                            are highly experienced and knowledgeable in meeting the variegated needs of our valuable clients.
                        </p>
                        <h3 className="text-xl font-bold text-gray-800 text-center mb-8 mt-20">Our Pillars of Strength</h3>
                        <motion.div
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            {teamMembers.map((member, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm transition duration-300 ease-in-out hover:shadow-md"
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">{member.name}</h4>
                                        <p className="text-sm text-gray-500">{member.details}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                        {/* </div> */}
                        {/* </div> */}

                    </div>
                    <div>
                        <AnimatedSection className="text-center mb-16"><h2 className="text-3xl font-bold text-gray-800">Our Journey</h2></AnimatedSection>
                        <div className="relative">
                            <div className="absolute left-1/2 h-full w-0.5 bg-blue-200 transform -translate-x-1/2"></div>
                            {journey.map((item, index) => (
                                <AnimatedSection key={index} className="mb-8 flex justify-between items-center w-full" variants={index % 2 === 0 ? fromLeftVariant : fromRightVariant}>
                                    <div className={`w-5/12 ${index % 2 === 0 ? 'order-1' : 'order-3'}`}></div>
                                    <motion.div
                                        className="z-10 flex items-center justify-center w-12 h-12 bg-blue-900 rounded-full text-white font-bold order-2 shadow-lg"
                                        whileHover={{ scale: 1.2, rotate: 15 }}
                                    >
                                        <Calendar className="w-6 h-6" />
                                    </motion.div>
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
            {/* </div> */}
            {/* </div> */}
        </PageWrapper>
    );
};

const BuildingIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
        <line x1="8" y1="4" x2="8" y2="20"></line>
        <line x1="16" y1="4" x2="16" y2="20"></line>
        <line x1="4" y1="12" x2="20" y2="12"></line>
    </svg>
);

const CogIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"></path>
        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
        <path d="M12 2v2"></path><path d="M12 22v-2"></path>
        <path d="m17 20.66-1-1.73"></path><path d="m8 4.07 1 1.73"></path>
        <path d="m20.66 17-1.73-1"></path><path d="m4.07 8 1.73 1"></path>
        <path d="M2 12h2"></path><path d="M22 12h-2"></path>
        <path d="m17 3.34 1 1.73"></path><path d="m8 19.93-1-1.73"></path>
        <path d="m3.34 7 1.73 1"></path><path d="m19.93 16 1.73 1"></path>
    </svg>
);

const HardHatIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 12s3-7 10-7 10 7 10 7v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"></path>
        <path d="M12 12v-2.5"></path><path d="M12 19a3 3 0 0 0-3 3"></path>
        <path d="M12 19a3 3 0 0 1 3 3"></path>
    </svg>
);

const BriefcaseIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const LayersIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
);

const WorkflowIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="7" height="7" rx="2" ry="2"></rect>
        <rect x="14" y="3" width="7" height="7" rx="2" ry="2"></rect>
        <rect x="14" y="14" width="7" height="7" rx="2" ry="2"></rect>
        <rect x="3" y="14" width="7" height="7" rx="2" ry="2"></rect>
        <path d="M10 6.5h4"></path><path d="M6.5 10v4"></path>
        <path d="M17.5 10v4"></path><path d="M10 17.5h4"></path>
    </svg>
);


// Color mapping for Tailwind CSS
const colorVariants = {
    sky: { bg: 'bg-sky-500', text: 'text-sky-500', border: 'border-sky-500' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500' },
    teal: { bg: 'bg-teal-500', text: 'text-teal-500', border: 'border-teal-500' },
    indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500' },
    rose: { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500' },
};

// New ServiceSection Component
const ServiceSection = ({ service, index }) => {
    const isReversed = index % 2 !== 0;
    const colors = colorVariants[service.color];
    const animationDelay = `${index * 150}ms`;

    return (
        <div
            className="flex flex-col md:flex-row items-center gap-4 md:gap-8 animate-fade-in-up"
            style={{ animationDelay }}
        >
            {/* Image Section */}
            <div className={`w-full md:w-2/3 ${isReversed ? 'md:order-2' : ''}`}>
                <AnimatedSection variants={fromRightVariant} >  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-video"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found'; }}
                /></AnimatedSection>
            </div>

            {/* Text Content Section */}
            <div className={`w-full md:w-1/2 ${isReversed ? 'md:order-1' : ''}`}>
                <AnimatedSection variants={fromLeftVariant}>  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-2 rounded-lg ${colors.bg} bg-opacity-10`}>
                        <service.icon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">{service.title}</h3>
                </div>
                    <p className="text-md text-gray-600 leading-relaxed">{service.description}</p>  </AnimatedSection>
            </div>

        </div>
    );
};


const ServicesPage = () => {
    // Updated services data with image URLs
    const servicesData = [
        {
            icon: BuildingIcon,
            title: "Structural Design",
            description: "Comprehensive structural analysis and design for commercial and industrial buildings. Specialized engineering discipline of creating safe, stable, and resilient structures, with a particular focus on commercial and industrial buildings. This service provides comprehensive structural analysis and design, from a project's conceptual stage through to its completion.",
            color: "sky",
            imageUrl: "https://images.unsplash.com/photo-1725655469137-66ab8fac7455?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RydWN0dXJhbCUyMGRlc2lnbnxlbnwwfDJ8MHx8fDA%3D",
        },
        {
            icon: CogIcon,
            title: "Mechanical Engineering",
            description: "Offer specialized expertise in designing and implementing essential building systems. Our solutions cover high-performance HVAC for climate control, efficient plumbing systems, and reliable fire protection to ensure building safety and occupant comfort. We focus on integrating these systems seamlessly to meet performance, sustainability, and code requirements for any structure",
            color: "amber",
            imageUrl: "https://images.unsplash.com/photo-1646724810360-abfa1bb76d6d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVjaGFuaWNhbCUyMGVuZ2luZWVyaW5nfGVufDB8MnwwfHx8MA%3D%3D",
        },
        {
            icon: HardHatIcon,
            title: "Construction Management",
            description: "We provide end-to-end oversight of projects, from initial planning to final delivery. Our focus is on maintaining high standards of quality and efficiency while ensuring all deadlines and budgetary goals are met. This includes meticulous scheduling, resource allocation, and continuous risk management to guarantee successful project completion",
            color: "orange",
            imageUrl: "https://images.unsplash.com/photo-1600645896997-3c00e14c0b23?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29uc3RydWN0aW9uJTIwbWFuYWdlbWVudHxlbnwwfDJ8MHx8fDA%3D",
        },
        {
            icon: BriefcaseIcon,
            title: "Project Consulting",
            description: "Our services go beyond simple advice, offering comprehensive strategic planning to guide your project from conception to completion. We leverage deep industry expertise to provide actionable insights, identify potential risks, and develop robust frameworks that ensure your project stays on track, on budget, and achieves its goals. By focusing on smart, proactive decision-making, we empower you to navigate complexities and secure successful outcomes.",
            color: "teal",
            imageUrl: "https://images.unsplash.com/photo-1600645896997-3c00e14c0b23?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            icon: LayersIcon,
            title: "Geotechnical Services",
            description: "A solid foundation for any project begins with a thorough site investigation and analysis. This critical process involves evaluating the geological and environmental conditions of a potential construction site, including soil composition, groundwater levels, and potential hazards like seismic activity. The collected data is then used to inform the design of appropriate and cost-effective foundation systems, ensuring the structure's long-term stability and resilience.",
            color: "indigo",
            imageUrl: "https://images.unsplash.com/photo-1562118511-e0aa3d7b0373?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            icon: WorkflowIcon,
            title: "MEP Engineering",
            description: "We provide comprehensive, integrated design services that combine the core disciplines of Structural, Mechanical, Electrical, and Plumbing engineering. This holistic approach ensures all building systems work together seamlessly from the initial concept to the final construction. We provide a single point of responsibility for these critical elements, eliminating potential conflicts and inefficiencies that arise when designing these systems in isolation. The result is a more efficient, cost-effective, and functional modern building.",
            color: "rose",
            imageUrl: "https://images.unsplash.com/photo-1688524231834-fc8f8f71a463?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    ];

    return (
        <PageWrapper>

            <section className="relative h-[50vh] md:h-50 w-full" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1553048686-e3d0396506b9?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center px-4">
                    <motion.h1
                        className="text-2xl md:text-4xl font-bold text-white mb-4 mt-10"
                        variants={heroTextVariant}
                        initial="hidden"
                        animate="visible"
                    >
                        Our Services
                    </motion.h1>
                    <motion.p
                        className="text-md md:text-lg text-white max-w-2xl"
                        variants={heroTextVariant}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                    >
                        We offer a wide range of engineering services to meet the diverse needs of our clients.
                    </motion.p>
                </div>
            </section>

            <section className="py-10" style={{backgroundColor: '#FAFAF6'}}>
                <div className="space-y-20 md:space-y-28  md:space-y-30 px-20 md:px-16">
                    {servicesData.map((service, index) => (
                        <ServiceSection key={service.title} service={service} index={index} />
                    ))}
                </div>
            </section>
        </PageWrapper>
    );
};

const ProjectsPage = () => {

    // Mock data for all projects

    const mohantyConstruction = [
        {
            "title": "Construction of Pryoxlene Sheet Plant Foundation and Assembly Buildings.",
            "category": "Industrial",
            "client": "Ordnance Factory Board - Bhandara",
            "location": "Jawahar Nagar - Bhandara"
        },
        {
            "title": "Construction of Double Base Propellant Plant Foundation and Assembly Buildings.",
            "category": "Industrial",
            "client": "Ordnance Factory Board – Bhandara",
            "location": "Jawahar Nagar - Bhandara"
        },
        {
            "title": "Repair of Stages and Fabrication of Windows with Manhole Cover of Absorption Tower.",
            "category": "Industrial",
            "client": "Ordnance Factory Board – Bhandara",
            "location": "Jawahar Nagar - Bhandara"
        },
        {
            "title": "Supply, Fabrication and Erection of SS 304 Line at HMX Plant.",
            "category": "Industrial",
            "client": "Ordnance Factory Board – Bhandara",
            "location": "Jawahar Nagar - Bhandara"
        },
        {
            "title": "Supply, Fabrication and Fitting of New Drenching Operating Line for Manual Drenching System of RX – 143 Building.",
            "category": "Industrial",
            "client": "Ordnance Factory Board – Bhandara",
            "location": "Jawahar Nagar - Bhandara"
        },
        {
            "title": "Fabrication and fitting of CNA and WNA lines with required fitting and accessories.",
            "category": "Industrial",
            "client": "Ordnance Factory Board – Bhandara",
            "location": "Jawahar Nagar - Bhandara"
        },
        {
            title: 'Underground HDPE Line Installation',
            category: 'Industrial',
            client: 'Ordnance Factory Board – Bhandara',
            location: 'Jawahar Nagar - Bhandara'
        },
        {
            title: 'HDPE Waste Water Line Replacement',
            category: 'Industrial',
            client: 'Ordnance Factory Board - Bhandara',
            location: 'Jawahar Nagar - Bhandara'
        },
        {
            title: 'NOX Blower Line Modification',
            category: 'Industrial',
            client: 'Ordnance Factory Board - Bhandara',
            location: 'Jawahar Nagar - Bhandara'
        },
        {
            title: 'Grit Structure & Blower Strengthening',
            category: 'Industrial',
            client: 'Ordnance Factory Board - Bhandara',
            location: 'Jawahar Nagar - Bhandara'
        },
        {
            title: 'Chiller Line Lagging and Cladding',
            category: 'Industrial',
            client: 'Ordnance Factory Board - Bhandara',
            location: 'Jawahar Nagar - Bhandara'
        },
        {
            title: 'Steam Line Fabrication & Commissioning',
            category: 'Industrial',
            client: 'Ordnance Factory Board - Bhandara',
            location: 'Jawahar Nagar - Bhandara'
        },
        {
            title: 'Compressed Air Line Installation',
            category: 'Industrial',
            client: 'Ordnance Factory Board - Bhandara',
            location: 'Jawahar Nagar - Bhandara'
        },
        {
            title: 'Water Line Installation',
            category: 'Industrial',
            client: 'Ordnance Factory Board - Bhandara',
            location: 'Jawahar Nagar - Bhandara'
        },
        {
            title: 'Autoclave Coil Fabrication',
            category: 'Industrial',
            client: 'Ordnance Factory Board - Bhandara',
            location: 'Jawahar Nagar - Bhandara'
        },
        {
            title: 'SNA Line Fabrication',
            category: 'Industrial',
            client: 'Ordnance Factory Board - Bhandara',
            location: 'Jawahar Nagar - Bhandara'
        },
        {
            title: 'Intake Fume Line Replacement',
            category: 'Industrial',
            client: 'Ordnance Factory Board - Bhandara',
            location: 'Jawahar Nagar - Bhandara'
        },
        {
            title: 'Demolition of OHE Structures',
            category: 'Railway',
            client: 'Western Railways- Indian Railways',
            location: 'Mumbai, Maharashtra'
        },
        {
            title: 'Railway Signaling & Telecom at Central Hospital',
            category: 'Railway',
            client: 'Central Railways-Indian Railways',
            location: 'Byculla – Mumbai, Maharashtra'
        },
        {
            title: 'Railway Signaling & Telecom at Bilaspur Station',
            category: 'Railway',
            client: 'South East Central Railways-Indian Railways',
            location: 'Bilaspur - Chhattisgarh'
        },
        {
            "title": "Construction of Tourist Toilet Blocks",
            "category": "Administrative & Utility Buildings",
            "client": "Melghat Forest Department - Melghat",
            "location": "Chikhaldara - Amravati"
        },
        {
            "title": "Repairs and Renovation of Forest Quarters",
            "category": "Administrative & Utility Buildings",
            "client": "Melghat Forest Department – Melghat",
            "location": "Chikhaldara - Amravati"
        },
        {
            "title": "Repairs and Renovation of Forest Quarters",
            "category": "Administrative & Utility Buildings",
            "client": "Melghat Forest Department – Melghat",
            "location": "Paratwada - Amravati"
        },
        {
            "title": "Construction of VIP Suites",
            "category": "Administrative & Utility Buildings",
            "client": "Melghat Forest Department – Melghat",
            "location": "Chikhaldara - Amravati"
        },
        {
            "title": "Construction of Protection Camps",
            "category": "Administrative & Utility Buildings",
            "client": "Melghat Forest Department – Melghat",
            "location": "Chikhaldara - Amravati"
        },
        {
            "title": "Renovation and upgradation of Rural Hospital",
            "category": "Administrative & Utility Buildings",
            "client": "National Health Mission",
            "location": "Katol – Nagpur"
        },
        {
            "title": "Construction of School Building",
            "category": "Administrative & Utility Buildings",
            "client": "Zilla Parishad – Nagpur",
            "location": "Kelvad – Saoner"
        },
        {
            "title": "Construction of School Building",
            "category": "Administrative & Utility Buildings",
            "client": "Zilla Parishad – Nagpur",
            "location": "Dahalgaon – Saoner"
        },
        {
            "title": "Construction of School Building",
            "category": "Administrative & Utility Buildings",
            "client": "Buty Public School",
            "location": "Kamptee – Nagpur"
        },
        {
            "title": "Construction of Commercial Complex",
            "category": "Administrative & Utility Buildings",
            "client": "Buty Chambers",
            "location": "Sitabuldi – Nagpur"
        },
        {
            "title": "Construction of Girls Hostel",
            "category": "Administrative & Utility Buildings",
            "client": "Charu Girls Hostel",
            "location": "Sadar – Nagpur"
        },
        {
            "title": "Construction of Commercial Complex",
            "category": "Administrative & Utility Buildings",
            "client": "Gigeo Construction Co. Pvt. ltd",
            "location": "Sitabuldi – Nagpur"
        },
        {
            "title": "Repairs and Renovation of Ajni Police Station",
            "category": "Administrative & Utility Buildings",
            "client": "Public Works Department - Nagpur",
            "location": "Ajni – Nagpur"
        }
    ];

    const getCategories = (projects) => {
        const categoriesSet = new Set(projects.map(p => p.category));
        return ['All', ...Array.from(categoriesSet).sort()];
    };

    const [filter, setFilter] = useState('All');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const categories = getCategories(mohantyConstruction);

    // useEffect to handle the filtering logic whenever the filter state changes
    useEffect(() => {
        if (filter === 'All') {
            setFilteredProjects(mohantyConstruction);
        } else {
            setFilteredProjects(mohantyConstruction.filter(project => project.category === filter));
        }
    }, [filter]);


    return (
        <PageWrapper >
            <section className="relative h-[50vh] md:h-50 w-full" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1514069709437-f1c294e44e1a?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center px-4">
                    <motion.h1
                        className="text-2xl md:text-4xl font-bold text-white mb-4 mt-10"
                        variants={heroTextVariant}
                        initial="hidden"
                        animate="visible"
                    >
                        Our Projects
                    </motion.h1>
                    <motion.p
                        className="text-md md:text-lg text-white max-w-2xl"
                        variants={heroTextVariant}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                    >
                        Showcasing our legacy of engineering excellence and innovation.
                    </motion.p>
                </div>
            </section>



            <section className="py-10" style={{ backgroundColor: "#f7f6f6ff" }}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-20">
                        <h2 className="text-3xl font-bold text-gray-800">Mohanty Construction Corp.</h2>
                        <p className="text-gray-600 mt-2 px-8 text-justify">Mohanty Construction Corporation has long-standing expertise in delivering large-scale civil and infrastructure projects, Mohanty Projects Private Limited has been structured to focus on technologically intensive and mission-critical railway works. This includes design, installation, testing, commissioning, and maintenance of signaling and telecommunication systems for the Indian Railways</p>
                    </AnimatedSection>
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800">Explore All Our Projects</h2>
                        <p className="text-gray-600 mt-2">A gallery of our successful ventures across various sectors.</p>
                    </AnimatedSection>

                    {/* Filter buttons */}
                    <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4 mb-12">
                        {categories.map((cat) => (
                            <motion.button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 mb-2 ${filter === cat ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-100 hover:text-blue-600'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </div>

                    {/* Projects Grid */}
                    <motion.div
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={index}
                                className="relative bg-white rounded-2xl shadow-md border-t-4 border-transparent p-6 pb-10 transition-all duration-500 hover:border-blue-500 hover:shadow-xl group"
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                            >
                                <div className="p-2 rounded-full text-gray-800 mr-4 flex-shrink-0 align-center mb-4"
                                    style={{
                                        width: 'fit-content',
                                        backgroundColor: '#CDE8E5'
                                    }}>
                                    {/* Placeholder icon. You can replace with an actual icon based on category. */}
                                    <div className="flex items-center pl-2 pr-4">
                                        <div className="inline-block mr-2">
                                            {project.category.toLowerCase() === "railway" ? <Train></Train> : project.category.toLowerCase() === 'industrial' ? <FactoryIcon> </FactoryIcon> : <Building></Building>}

                                        </div>
                                        <span className="inline-block text-xs font-semibold uppercase text-gray-800">
                                            {project.category}
                                        </span>
                                    </div>

                                </div>
                                <div className="flex items-start mb-4">

                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-gray-700 leading-tight">{project.title}</h3>
                                    </div>
                                </div>
                                <div> {/* Aligned with the icon's content */}
                                    <p className="text-sm text-gray-600 mb-1">
                                        <span className="font-semibold">Client:</span> {project.client}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Location:</span> {project.location}
                                    </p>
                                </div>
                                <div className="absolute inset-0 rounded-2xl border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </motion.div>
                        ))}
                    </motion.div>

                </div>
            </section>

        </PageWrapper>
    );
};


const MohantyPvtPage = () => {

    return (
        <PageWrapper>
            <section className="relative h-[50vh] md:h-50 w-full" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1514069709437-f1c294e44e1a?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center px-4">
                    <motion.h1
                        className="text-2xl md:text-4xl font-bold text-white mb-4 mt-10"
                        variants={heroTextVariant}
                        initial="hidden"
                        animate="visible"
                    >
                        Mohanty Projects Pvt. Ltd.
                    </motion.h1>
                    <motion.p
                        className="text-md md:text-lg text-white max-w-2xl"
                        variants={heroTextVariant}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                    >
                        Showcasing our legacy of engineering excellence and innovation.
                    </motion.p>
                </div>
            </section>

            <section className="bg-white py-12 md:pt-12 md:pb-12">
                <div className="container mx-auto px-8 sm:px-6 lg:px-16 grid md:grid-cols-2 gap-2">
                    <AnimatedSection variants={fromLeftVariant} className="mr-10">
                        <h3 className='text-3xl text-center text-gray-800 pb-4'>Building Excellence and Innovation</h3><br></br>
                        <img src="https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uc3RydWN0aW9ufGVufDB8MXwwfHx8MA%3D%3D" alt="About Us" className="rounded-lg shadow-xl w-full" /></AnimatedSection>
                    <AnimatedSection className="text-left mb-12">
                        <p className="text-gray-600 text-md text-justify sm:mt-8 mt-2">Mohanty Projects Private Limited is an extended and specialized wing of Mohanty Construction Corporation, a well-established entity with a proven track record in the infrastructure and construction sector. Incorporated under the provisions of the Companies Act and registered with the Ministry of Corporate Affairs, Government of India, the Company was formed to diversify and strengthen the Group’s presence in highly specialized infrastructure domains, particularly in Railway Signaling and Telecommunication (S&T) works. <br /> While Mohanty Construction Corporation has long-standing expertise in delivering large-scale civil and infrastructure projects, Mohanty Projects Private Limited has been structured to focus on technologically intensive and mission-critical railway works. This includes design, installation, testing, commissioning, and maintenance of signaling and telecommunication systems for the Indian Railways. <br />The creation of Mohanty Projects Private Limited represents a strategic initiative to leverage the parent organization’s legacy of reliability, resources, and operational excellence while building a specialized corporate identity dedicated to serving the railway sector. By combining the construction capabilities of Mohanty Construction Corporation with the technical expertise of Mohanty Projects Private Limited, the Group has positioned itself as a holistic infrastructure solutions provider.
                            <br />The core operations of the Company encompass execution of works related to railway signaling systems, telecommunication networks, installation, testing, commissioning, and maintenance. With a team of qualified professionals, robust technical capabilities, and adherence to stringent quality and safety standards, Mohanty Projects Private Limited has established itself as a dependable service provider in this highly specialized sector.
                            <br />The Company is committed to delivering projects of national importance with integrity, precision, and timeliness, thereby contributing to the modernization and efficiency enhancement of the Indian Railways. Guided by principles of professionalism, compliance, and continuous innovation, Mohanty Projects Private Limited endeavors to strengthen its position as a trusted partner in the advancement of railway infrastructure.</p>
                    </AnimatedSection>
                </div> </section>

        </PageWrapper>
    );
};

const ContactPage = () => {
    return (
        <PageWrapper>
            <div className="h-full relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1663058480259-2213d39f4f90?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
                <div className="relative inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center px-4">

                    <section className="py-20 ">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <AnimatedSection className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-100 pt-10">Contact Us</h2>
                                <p className="text-gray-100 mt-2">We'd love to hear from you. Reach out to us for any inquiries.</p>
                            </AnimatedSection>
                            <div className="grid md:grid-cols-2 gap-12">
                                <motion.div variants={fromLeftVariant} initial="hidden" animate="visible">
                                    <form className="space-y-6 bg-white rounded-lg border p-12">
                                        <input type="text" placeholder="Your Name" className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <input type="email" placeholder="Your Email" className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <textarea placeholder="Your Message" rows="6" className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                                        <motion.button type="submit" className="w-full bg-blue-900 text-white p-3 rounded-md font-semibold hover:bg-blue-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Send Message</motion.button>
                                    </form>
                                </motion.div>
                                <motion.div variants={fromRightVariant} initial="hidden" animate="visible" className="space-y-6 bg-white rounded-lg border p-12 ">
                                    <div className="flex items-start text-left"><MapPin className="text-blue-600 mt-1 mr-4 flex-shrink-0" /><div><h4 className="font-semibold">Address</h4><p>Ground Floor, Chandranil Apartment, Near Tirpude College,
                                        Sadar, Nagpur – 440001</p></div></div>
                                    <div className="flex items-start text-left"><Mail className="text-blue-600 mt-1 mr-4 flex-shrink-0" /><div><h4 className="font-semibold">Email</h4><p>mohantyconstructioncorporation@gmail.com</p></div></div>
                                    <div className="flex items-start text-left"><Phone className="text-blue-600 mt-1 mr-4 flex-shrink-0" /><div><h4 className="font-semibold">Phone</h4><p>+91 9923365525</p></div></div>
                                    <div className="flex items-start text-left"><Globe className="text-blue-600 mt-1 mr-4 flex-shrink-0" /><div><h4 className="font-semibold">Website</h4><p> https://www.indiamart.com/mohantyconstructioncorporation/</p></div></div>

                                </motion.div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </PageWrapper>
    );
};

// --- Section Previews for Home Page ---
const AboutSectionPreview = () => (
    <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <AnimatedSection variants={fromLeftVariant}><img src="https://images.unsplash.com/photo-1706891713426-282a9e4ad9f5?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="About Us" className="rounded-lg shadow-xl w-full" /></AnimatedSection>
                <AnimatedSection variants={fromRightVariant}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">About Mohanty Construction</h2>
                    <p className="text-gray-600 mb-6 text-justify">For over a decade, Mohanty Construction Corp. has been a leader in providing comprehensive engineering services. Our commitment to innovation, quality, and client satisfaction has made us a trusted partner for projects of all scales.</p>

                    <a href="about-us" className="bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-900 transition-all duration-300">
                        Know More
                    </a>
                </AnimatedSection>

            </div>
        </div>
    </section>
);

const StatsSection = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
    const stats = [{ value: 25, label: "Years Experience" }, { value: 450, label: "Projects Completed" }, { value: 300, label: "Happy Clients" }, { value: 50, label: "Expert Staff" }];

    return (
        <section ref={ref} className="py-20 bg-cover bg-fixed bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1724041875463-ba0a3f2fc68c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
            <div className="absolute inset-0 bg-black bg-opacity-60">
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                    {stats.map((stat, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.2 }}>
                            <h3 className="text-4xl md:text-5xl font-bold text-gray-100">{inView && <CountUpAnimation end={stat.value} duration={3} />}+</h3>
                            <p className="text-lg font-medium mt-2">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ServicesSectionPreview = () => {
    const services = [
        { icon: <Building size={40} />, title: "Structural Design", desc: "Comprehensive structural analysis and design for commercial and industrial buildings." },
        { icon: <Wrench size={40} />, title: "Mechanical Engineering", desc: "Expert solutions for HVAC, plumbing, and fire protection systems." },
        { icon: <Hammer size={40} />, title: "Construction Management", desc: "Overseeing projects from inception to completion, ensuring quality and efficiency." },
    ];
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="text-left ml-20 mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
                    <h2 className="text-xl text-gray-400 mt-4">We offer a wide range of construction solutions, designed to meet your every need.</h2>
                </AnimatedSection>
                <motion.div className="grid md:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                    {services.map((service, index) => (
                        <motion.div key={index} variants={itemVariants} className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
                            <div className="text-blue-600 mb-2 inline-block">{service.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                            <p className="text-md mt-2 text-gray-800">{service.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const WhyChooseUsPreview = () => {
    const whyUs = [
        { icon: <Award className="w-8 h-8 text-blue-500" />, title: "Proven Expertise", description: "Decades of experience in delivering successful projects." },
        { icon: <Users className="w-8 h-8 text-blue-500" />, title: "Client-Centric Approach", description: "We prioritize client needs and build long-term partnerships." },
        { icon: <Lightbulb className="w-8 h-8 text-blue-500" />, title: "Innovative Solutions", description: "Utilizing cutting-edge technology for efficient results." },
    ];
    return (
        <section className="py-20 bg-gray-50 grid md:grid-cols-2">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center justify-center">
                <AnimatedSection className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Why Choose Us?</h2>
                    <h2 className="text-lg mt-2 text-gray-400">
                        Building on a Foundation of Trust and Excellence
                    </h2>
                </AnimatedSection>
                <motion.div className="grid md:grid-cols-1 gap-4" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                    {whyUs.map((item, index) => (
                        <motion.div key={index} variants={itemVariants} className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex justify-center mb-4">{item.icon}</div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h4>
                            <p className="text-gray-600 text-md">{item.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 sm:pt-4">
                <AnimatedSection variants={fromLeftVariant}><img src="https://images.unsplash.com/photo-1566350321650-83c2b8e587a9?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="About Us" className="rounded-lg shadow-xl w-full h-full" /></AnimatedSection>
            </div>

        </section>
    );
};

const FeaturedProjectsPreview = () => {
    const projects = [
        { img: "https://images.unsplash.com/photo-1663949233461-43ac152a6fa9?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Industrial Complex", category: "Completed" },
        { img: "https://images.unsplash.com/photo-1636367393690-1f07c7413851?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGNvbnN0cnVjdGlvbiUyMHByb2plY3RzJTIwYmd8ZW58MHwwfDB8fHww", title: "Commercial Tower", category: "Ongoing" },
        { img: "https://images.unsplash.com/photo-1701844279504-e3a974aaafb5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvbnN0cnVjdGlvbiUyMHByb2plY3QlMjBpbmRpYXxlbnwwfDB8MHx8fDA%3D", title: "Residential Area", category: "Completed" },
    ];
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">Featured Projects</h2>
                </AnimatedSection>
                <motion.div className="grid md:grid-cols-2 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                    {projects.map((project, index) => (
                        <motion.div key={index} variants={itemVariants} className="group relative overflow-hidden rounded-lg shadow-lg">
                            <img src={project.img} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
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

const getPageFromPath = (path) => {
    switch (path) {
        case '/': return 'Home';
        case '/about-us': return 'About Us';
        case '/services': return 'Services';
        case '/projects': return 'Projects';
        case '/contact-us': return 'Contact Us';
        case '/mohanty-projects': return 'Mohanty Projects'
        default: return 'Home';
    }
};

// --- Main App Component ---
const App = () => {
    // State to manage the current page
    const [currentPage, setCurrentPage] = useState('Home');
    // State to manage the loading status
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const handlePopState = () => {
            // This function updates the state when the user clicks back/forward
            setCurrentPage(getPageFromPath(window.location.pathname));
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);
    // Get the initial page from the URL path
    useEffect(() => {
        const path = window.location.pathname.replace(/^\/|\/$/g, '');
        const pageMap = {
            '': 'Home',
            'about-us': 'About Us',
            'services': 'Services',
            'projects': 'Projects',
            'contact-us': 'Contact Us'
        };
        setCurrentPage(pageMap[path] || 'Home');
    }, []);

    // Simulate an initial loading delay for a better user experience
    useEffect(() => {
        // Here you would typically fetch data or check for initial API responses.
        // We'll use a simple setTimeout to simulate this.
        setTimeout(() => {
            setIsLoading(false);
        }, 1500); // 1.5 seconds delay
    }, []);

    // Determine which page component to render based on currentPage state
    const renderPage = () => {
        switch (currentPage) {
            case 'Home':
                return <HomePage setPage={setCurrentPage} />;
            case 'About Us':
                return <AboutPage />;
            case 'Services':
                return <ServicesPage />;
            case 'Projects':
                return <ProjectsPage />;
            case 'Contact Us':
                return <ContactPage />;
            case 'Mohanty Projects':
                return <MohantyPvtPage />;
            default:
                return <HomePage />;
        }
    };

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <Loader key="loader" />
                ) : (
                    <>
                        <Header setPage={setCurrentPage} currentPage={currentPage} />
                        <main>
                            {renderPage()}

                        </main>
                        <Footer setPage={setCurrentPage} />

                    </>
                )}
            </AnimatePresence>
        </>

    );
};

export default App;

