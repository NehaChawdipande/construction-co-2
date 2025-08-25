import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Menu, X, Phone, Mail, MapPin, Building, Wrench, HardHat, Lightbulb, Target, Eye, Award, Users, TrendingUp, Calendar, Send } from 'lucide-react';

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

const itemVariants = {
    hidden: { y: 80, opacity: 0, scale: 0.8 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10,
        }
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

    const navLinks = ['Home', 'About Us', 'Services', 'Projects', 'Contact Us'];

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
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-xl' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <motion.a
                        href="/"
                        onClick={(e) => { e.preventDefault(); handleNavClick('Home'); }}
                        className={`font-bold text-2xl ${isScrolled || isMenuOpen ? 'text-gray-900' : 'text-white'}`}
                        whileHover={{ scale: 1.1, rotate: 2 }}
                    >
                        Mohanty Constructions
                    </motion.a>
                    <nav className="hidden md:block">
                        <ul className="flex items-center space-x-8">
                            {navLinks.map(link => {
                                const linkHref = link === 'Home' ? '/' : `/${link.toLowerCase().replace(/\s+/g, '-')}`;
                                return (
                                    <motion.li key={link} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
                                        <a href={linkHref} onClick={(e) => { e.preventDefault(); handleNavClick(link); }} className={`font-medium transition-colors duration-300 relative ${isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-200'} ${currentPage === link ? 'text-blue-500' : ''}`}>
                                            {link}
                                            {currentPage === link && <motion.div className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-blue-500" layoutId="underline" />}
                                        </a>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </nav>
                    <div className="hidden md:block">
                        <motion.a
                            href="/contact-us"
                            onClick={(e) => { e.preventDefault(); handleNavClick('Contact Us'); }}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            Get a Quote
                        </motion.a>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={isScrolled ? 'text-gray-900' : 'text-white'}>
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
                        <ul className="flex flex-col items-center space-y-4 py-4">
                            {navLinks.map(link => (
                                <motion.li key={link} variants={itemVariants}>
                                    <a href={link === 'Home' ? '/' : `/${link.toLowerCase().replace(/\s+/g, '-')}`} onClick={(e) => { e.preventDefault(); handleNavClick(link); }} className="font-medium text-gray-600 hover:text-blue-600">
                                        {link}
                                    </a>
                                </motion.li>
                            ))}
                            <motion.li variants={itemVariants}>
                                <a href="/contact-us" onClick={(e) => { e.preventDefault(); handleNavClick('Contact Us'); }} className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700">
                                    Get a Quote
                                </a>
                            </motion.li>
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
                        <h3 className="text-xl font-bold text-white mb-4">Mohanty Constructions</h3>
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
                            <li className="flex items-start"><MapPin size={16} className="mr-3 mt-1 flex-shrink-0" /><span>123 Engineering Lane, Surat, Gujarat, 395009, India</span></li>
                            <li className="flex items-center"><Mail size={16} className="mr-3" /><a href="mailto:info@mohantyconstructions.com" className="hover:text-blue-400">info@mohantyconstructions.com</a></li>
                            <li className="flex items-center"><Phone size={16} className="mr-3" /><a href="tel:+911234567890" className="hover:text-blue-400">+91 123 456 7890</a></li>
                        </ul>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
                        <p className="text-sm mb-4">Stay updated with our latest projects and news.</p>
                        <div className="flex">
                            <input type="email" placeholder="Your Email" className="w-full px-3 py-2 rounded-l-md text-gray-800 focus:outline-none" />
                            <motion.button className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><Send size={16} /></motion.button>
                        </div>
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
};

const ClientsPage = () => {
    const logos = [
        "https://placehold.co/150x80/e2e8f0/475569?text=Client+1", "https://placehold.co/150x80/e2e8f0/475569?text=Client+2",
        "https://placehold.co/150x80/e2e8f0/475569?text=Client+3", "https://placehold.co/150x80/e2e8f0/475569?text=Client+4",
        "https://placehold.co/150x80/e2e8f0/475569?text=Client+5", "https://placehold.co/150x80/e2e8f0/475569?text=Client+6",
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
                </section>
            </div>
            <style jsx>{`
                @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .animate-scroll { animation: scroll 30s linear infinite; }
                .mask-image { -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent); mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent); }
            `}</style>
        </>
    );
};

// --- Page Components ---
// const HomePage = () => {
//     const slides = [
//         {
//             bg: "https://images.unsplash.com/photo-1566278692283-ca5f64d828d4?q=80&w=1166&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             title: "Excellence in Engineering Solutions",
//             subtitle: "Providing innovative and sustainable solutions for complex industrial challenges."
//         },
//         {
//             bg: "https://images.unsplash.com/photo-1485083269755-a7b559a4fe5e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             title: "Building the Future, Today",
//             subtitle: "Committed to quality, safety, and timely delivery of every project we undertake."
//         },
//         {
//             bg: "https://images.unsplash.com/photo-1568057373106-63057e421d1c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             title: "Precision in Every Detail",
//             subtitle: "From concept to completion, our expert team ensures perfection at every stage."
//         }
//     ];
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const nextSlide = () => setCurrentSlide(p => (p === slides.length - 1 ? 0 : p + 1));
//     const prevSlide = () => setCurrentSlide(p => (p === 0 ? slides.length - 1 : p - 1));
//     useEffect(() => { const i = setInterval(nextSlide, 5000); return () => clearInterval(i); }, []);

//     // Staggered text animation variants
//     const heroTitleWords = slides[currentSlide].title.split(" ");
//     const heroSubtitleWords = slides[currentSlide].subtitle.split(" ");
//     const titleContainer = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: {
//                 staggerChildren: 0.1,
//                 delayChildren: 0.2
//             }
//         }
//     };
//     const titleItem = {
//         hidden: { opacity: 0, y: 50 },
//         visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
//     };

//     return (
//         <PageWrapper>
//             <section className="relative h-screen w-full overflow-hidden">
//                 <AnimatePresence>
//                     <motion.div
//                         key={currentSlide}
//                         initial={{ opacity: 0, scale: 1.2 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0.9 }}
//                         transition={{ duration: 1.8, ease: "easeInOut" }}
//                         className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
//                         style={{ backgroundImage: `url(${slides[currentSlide].bg})` }}
//                     >
//                         <div className="absolute inset-0 bg-black bg-opacity-50"></div>
//                     </motion.div>
//                 </AnimatePresence>
//                 <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
//                     <motion.h1 key={currentSlide + 't'} className="text-4xl md:text-6xl font-bold mb-4" variants={titleContainer} initial="hidden" animate="visible">
//                         {heroTitleWords.map((word, index) => (
//                             <motion.span key={index} className="inline-block mr-2" variants={titleItem}>{word}</motion.span>
//                         ))}
//                     </motion.h1>
//                     <motion.p key={currentSlide + 's'} className="text-lg md:text-xl max-w-3xl mb-8" variants={titleContainer} initial="hidden" animate="visible">
//                         {heroSubtitleWords.map((word, index) => (
//                             <motion.span key={index} className="inline-block mr-1" variants={titleItem}>{word}</motion.span>
//                         ))}
//                     </motion.p>
//                 </div>
//                 <motion.button
//                     onClick={prevSlide}
//                     className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 z-20"
//                     whileHover={{ scale: 1.2, rotate: -10 }}
//                     whileTap={{ scale: 0.9 }}
//                 >
//                     <ChevronLeft size={32} />
//                 </motion.button>
//                 <motion.button
//                     onClick={nextSlide}
//                     className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 z-20"
//                     whileHover={{ scale: 1.2, rotate: 10 }}
//                     whileTap={{ scale: 0.9 }}
//                 >
//                     <ChevronRight size={32} />
//                 </motion.button>
//             </section>
//             <AboutSectionPreview />
//             <StatsSection />
//             <ServicesSectionPreview />
//             <WhyChooseUsPreview />
//             <FeaturedProjectsPreview />
//             <ClientsPage />
//         </PageWrapper>
//     );
// };

// --- Page Components ---
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
                    <motion.h1 key={currentSlide + 't'} className="text-4xl md:text-6xl font-bold mb-4" variants={titleContainer} initial="hidden" animate="visible">
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
        { year: "1992", event: "Company Inception", description: "Mohanty Constructions was founded with a vision to provide top-tier engineering solutions." },
        { year: "2001", event: "First Major Project", description: "Successfully completed our first large-scale industrial project, setting a benchmark for quality." },
        { year: "2010", event: "ISO Certification", description: "Achieved ISO 9001 certification, a testament to our commitment to quality management." },
        { year: "2018", event: "Expansion Overseas", description: "Expanded our operations internationally, undertaking projects in the Middle East." },
        { year: "2023", event: "Innovation Award", description: "Recognized with the 'Excellence in Engineering Innovation' award for our sustainable design solutions." }
    ];
    const whyUs = [
        { icon: <Award className="w-8 h-8 text-blue-500" />, title: "Proven Expertise", description: "Decades of experience in delivering successful projects across various sectors." },
        { icon: <Users className="w-8 h-8 text-blue-500" />, title: "Client-Centric Approach", description: "We prioritize client needs, ensuring satisfaction and building long-term partnerships." },
        { icon: <Lightbulb className="w-8 h-8 text-blue-500" />, title: "Innovative Solutions", description: "Utilizing cutting-edge technology to provide efficient and sustainable results." },
        { icon: <HardHat className="w-8 h-8 text-blue-500" />, title: "Safety First", description: "Adhering to the highest safety standards to ensure a secure working environment." }
    ];

    return (
        <PageWrapper>
            <div className=" w-full pt-20 absolute top-0 left-0  bg-cover bg-center bg-gray-900" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1706977527005-c430d7f977ce?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`, height:'100%' }} >
                {/* This is the new div for the blur overlay */}
                </div><div className="absolute top-0 left-0 w-full h-full backdrop-filter backdrop-blur-sm"></div>
                    <section className="py-20 relative h-full">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                                <div variants={fromLeftVariant}><img src="https://images.unsplash.com/photo-1727786550996-4fa0512e633b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="About Us" className="rounded-lg shadow-xl w-full h-md" /></div>
                                <AnimatedSection variants={fromRightVariant}>
                                    <h2 className="text-3xl font-bold text-gray-200 mb-4">About Mohanty Constructions</h2>
                                    <p className="text-gray-300 mb-4">Mohanty Constructions Pvt. Ltd., an ISO 9001, 14001 & OHSAS 18001 Certified company, has been a cornerstone in engineering construction since 1992. Headquartered in Surat, Gujarat, we have a rich history of completing diverse projects for industries like Petro-chemical, Power, Cement, and more.</p>
                                    <p className="text-gray-300">Our reputation is built on a foundation of quality, safety, and timely execution. We are dedicated to being a complete solution provider in fabrication, erection, and commissioning, including turnkey projects.</p>
                                </AnimatedSection>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8 mb-24">
                                <AnimatedSection variants={fromLeftVariant} className="bg-gray-50 p-8 rounded-lg shadow-lg">
                                    <div className="flex items-center mb-4"><Target className="w-12 h-12 text-blue-600 mr-4" /><h3 className="text-2xl font-bold text-gray-800">Our Mission</h3></div>
                                    <p className="text-gray-600">To provide exceptional engineering services by delivering innovative and cost-effective solutions. We aim to exceed client expectations through our commitment to quality, safety, and timely project completion.</p>
                                </AnimatedSection>
                                <AnimatedSection variants={fromRightVariant} className="bg-gray-50 p-8 rounded-lg shadow-lg">
                                    <div className="flex items-center mb-4"><Eye className="w-12 h-12 text-blue-600 mr-4" /><h3 className="text-2xl font-bold text-gray-800">Our Vision</h3></div>
                                    <p className="text-gray-600">To be a globally recognized leader in the engineering and construction industry, renowned for our excellence, innovation, and unwavering commitment to our clients' success.</p>
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
                            <div>
                                <AnimatedSection className="text-center mb-16"><h2 className="text-3xl font-bold text-gray-800">Our Journey</h2></AnimatedSection>
                                <div className="relative">
                                    <div className="absolute left-1/2 h-full w-0.5 bg-blue-200 transform -translate-x-1/2"></div>
                                    {journey.map((item, index) => (
                                        <AnimatedSection key={index} className="mb-8 flex justify-between items-center w-full" variants={index % 2 === 0 ? fromLeftVariant : fromRightVariant}>
                                            <div className={`w-5/12 ${index % 2 === 0 ? 'order-1' : 'order-3'}`}></div>
                                            <motion.div
                                                className="z-10 flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full text-white font-bold order-2 shadow-lg"
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


const ServicesPage = () => {
    const services = [
        { icon: <Building size={40} />, title: "Structural Design", description: "Comprehensive structural analysis and design for commercial and industrial buildings." },
        { icon: <Wrench size={40} />, title: "Mechanical Engineering", description: "Expert solutions for HVAC, plumbing, and fire protection systems." },
        { icon: <HardHat size={40} />, title: "Construction Management", description: "Overseeing projects from inception to completion, ensuring quality and efficiency." },
        { icon: <Lightbulb size={40} />, title: "Project Consulting", description: "Providing expert advice and strategic planning for successful project outcomes." },
        { icon: <MapPin size={40} />, title: "Geotechnical Services", description: "Site investigation and analysis to ensure a solid foundation for your project." },
        { icon: <TrendingUp size={40} />, title: "MEP Engineering", description: "Integrated Mechanical, Electrical, and Plumbing design for modern buildings." },
    ];
    return (
        <PageWrapper>

            <div className=" relative h-screen w-full overflow-hidden pt-20 absolute  top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url( https://images.unsplash.com/photo-1631171992385-784ae02b1acb?q=80&w=2019&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D` }} >
                {/* This is the new div for the blur overlay */}
                {/* <div className="absolute top-0 left-0 w-full h-full backdrop-filter backdrop-blur-sm"> */}

                <div className="absolute inset-0 bg-black bg-opacity-50">

                    <section className="py-20 mt-20">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <AnimatedSection className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-100">Our Services</h2>
                                <p className="text-gray-100 mt-2 max-w-2xl mx-auto text-xl">We offer a wide range of engineering services to meet the diverse needs of our clients.</p>
                            </AnimatedSection>
                            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
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

                </div>
            </div>
        </PageWrapper>
    );
};

const ProjectsPage = () => {
    const projects = [
        { img: "https://images.unsplash.com/photo-1663949233461-43ac152a6fa9?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Industrial Complex", category: "Completed" },
        { img: "https://images.unsplash.com/photo-1636367393690-1f07c7413851?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGNvbnN0cnVjdGlvbiUyMHByb2plY3RzJTIwYmd8ZW58MHwwfDB8fHww", title: "Commercial Tower", category: "Ongoing" },
        { img: "https://images.unsplash.com/photo-1701844279504-e3a974aaafb5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvbnN0cnVjdGlvbiUyMHByb2plY3QlMjBpbmRpYXxlbnwwfDB8MHx8fDA%3D", title: "Residential Area", category: "Completed" },
        { img: "https://images.unsplash.com/photo-1679801666948-c48ebbb42180?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Bridge Construction", category: "Completed" },
        { img: "https://images.unsplash.com/photo-1726087165810-76ad11242965?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvd2VyJTIwcGxhbnQlMjBjb25zdHJ1Y3Rpb24lMjBwcm9qZWN8ZW58MHwwfDB8fHww", title: "Power Plant", category: "Ongoing" },
        { img: "https://images.unsplash.com/photo-1744189554478-90387d3f1056?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdhdGVyJTIwdHJlYXRtZW50JTIwZmFjaWxpdHl8ZW58MHwwfDB8fHww", title: "Water Treatment Facility", category: "Completed" },
    ];
    return (
        <PageWrapper>
            <div className="pt-20 bg-gray-600">
                <section className="py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <AnimatedSection className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-100">Our Projects</h2>
                            <p className="text-gray-100 mt-2 max-w-2xl mx-auto">A glimpse into some of the prestigious projects we have successfully delivered.</p>
                        </AnimatedSection>
                        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                            {projects.map((project, index) => (
                                <motion.div key={index} variants={itemVariants} className="group relative overflow-hidden rounded-lg shadow-lg">
                                    <img src={project.img} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                    <div className="absolute bottom-0 left-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                        <h3 className="text-white text-xl font-bold">{project.title}</h3>
                                        <p className="text-blue-200 text-sm">{project.category}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            </div>
        </PageWrapper>
    );
};

const ContactPage = () => {
    return (
        <PageWrapper>
                      <div className="h-full relative" style={{backgroundImage: "url('https://images.unsplash.com/photo-1663058480259-2213d39f4f90?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", height:"100%"}}>

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
                                    <motion.button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Send Message</motion.button>
                                </form>
                            </motion.div>
                            <motion.div variants={fromRightVariant} initial="hidden" animate="visible" className="space-y-6 bg-white rounded-lg border p-12 ">
                                <div className="flex items-start"><MapPin className="text-blue-600 mt-1 mr-4 flex-shrink-0" /><div><h4 className="font-semibold">Address</h4><p>123 Engineering Lane, Surat, Gujarat, 395009, India</p></div></div>
                                <div className="flex items-start"><Mail className="text-blue-600 mt-1 mr-4 flex-shrink-0" /><div><h4 className="font-semibold">Email</h4><p>info@mohantyconstructions.com</p></div></div>
                                <div className="flex items-start"><Phone className="text-blue-600 mt-1 mr-4 flex-shrink-0" /><div><h4 className="font-semibold">Phone</h4><p>+91 123 456 7890</p></div></div>
                            </motion.div>
                        </div>
                    </div>
                </section>
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
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">About Mohanty Constructions</h2>
                    <p className="text-gray-600 mb-6">For over two decades, Mohanty Constructions has been a leader in providing comprehensive engineering services. Our commitment to innovation, quality, and client satisfaction has made us a trusted partner for projects of all scales.</p>

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
        { icon: <Building size={40} />, title: "Structural Design" },
        { icon: <Wrench size={40} />, title: "Mechanical Engineering" },
        { icon: <HardHat size={40} />, title: "Construction Management" },
    ];
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
                </AnimatedSection>
                <motion.div className="grid md:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                    {services.map((service, index) => (
                        <motion.div key={index} variants={itemVariants} className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
                            <div className="text-blue-600 mb-4 inline-block">{service.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
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
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">Why Choose Us?</h2>
                </AnimatedSection>
                <motion.div className="grid md:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                    {whyUs.map((item, index) => (
                        <motion.div key={index} variants={itemVariants} className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex justify-center mb-4">{item.icon}</div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h4>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
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
                <motion.div className="grid md:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
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

