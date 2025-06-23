"use client"

import { useState, useEffect } from 'react';
import styles from '../app/styles/Landing.module.css'


export const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate feature highlights
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: '✏️',
      title: 'Hand-drawn Feel',
      description: 'Create diagrams that look and feel like they were drawn by hand, giving your work a personal and authentic touch.'
    },
    {
      icon: '🔄',
      title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time. See changes instantly and collaborate seamlessly from anywhere.'
    },
    {
      icon: '🎨',
      title: 'Infinite Canvas',
      description: 'Never run out of space. Our infinite canvas adapts to your creativity, letting you expand your ideas without limits.'
    },
    {
      icon: '💾',
      title: 'Export Anywhere',
      description: 'Export your creations in multiple formats including PNG, SVG, and JSON. Share and integrate with ease.'
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your data stays secure. We prioritize privacy and give you full control over your creative work.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized for performance. Create and edit complex diagrams without any lag or performance issues.'
    }
  ];

  const stats = [
    { number: '2M+', label: 'Active Users' },
    { number: '50M+', label: 'Diagrams Created' },
    { number: '99.9%', label: 'Uptime' },
    { number: '190+', label: 'Countries' }
  ];

  return (
    <div className={styles.landingPage}>
      {/* Header */}
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>✏️</span>
            Excalidraw
          </div>
          <ul className={styles.navLinks}>
            <li><a href="#features">Features</a></li>
            <li><a href="#demo">Demo</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a href="/signup" className={styles.ctaButton}>Sign up</a>
          <button className={styles.mobileMenuBtn}>☰</button>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className={`${styles.hero} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <div className={styles.heroText}>
                <h1 className={styles.heroTitle}>
                  Sketch Your Ideas to Life
                </h1>
                <p className={styles.heroDescription}>
                  A virtual whiteboard for sketching hand-drawn like diagrams. No libraries used for rendering shapes just pure logic.
                  You can also collaborate with team or friends using a connect code!! Sign up to draw your ideas to life.
                  
                </p>
                <div className={styles.heroButtons}>
                  <a href="#" className={styles.btnPrimary}>Start Drawing</a>
                  <a href="#demo" className={styles.btnSecondary}>Watch Demo</a>
                </div>
              </div>
              <div className={styles.heroVisual}>
                <div className={styles.drawingCanvas}>
                  <svg viewBox="0 0 400 300" className={styles.animatedSvg}>
                    <defs>
                      <filter id="roughPaper">
                        <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise"/>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1"/>
                      </filter>
                    </defs>
                    
                    <path 
                      d="M50,50 Q100,30 150,50 T250,50" 
                      className={styles.drawPath1}
                      filter="url(#roughPaper)"
                    />
                    
                    <circle 
                      cx="100" 
                      cy="150" 
                      r="30" 
                      className={styles.drawCircle}
                      filter="url(#roughPaper)"
                    />
                    
                    <rect 
                      x="200" 
                      y="120" 
                      width="60" 
                      height="60" 
                      className={styles.drawRect}
                      filter="url(#roughPaper)"
                      transform="rotate(15 230 150)"
                    />
                    
                    <path 
                      d="M300,200 L350,180 L370,220 Z" 
                      className={styles.drawTriangle}
                      filter="url(#roughPaper)"
                    />
                    
                    <path 
                      d="M130,150 L200,150" 
                      className={styles.drawConnection}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.heroBackground}></div>
        </section>

        {/* Features Section */}
        <section id="features" className={styles.features}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Powerful Features for Creative Expression</h2>
              <p>Everything you need to turn your ideas into beautiful hand-drawn diagrams</p>
            </div>
            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`${styles.featureCard} ${index === activeFeature ? styles.active : ''}`}
                >
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      

        {/* Real-time Demo Section */}
        <section id="demo" className={styles.demo}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Experience Real-time Collaboration</h2>
              <p>Watch how multiple users can draw together simultaneously</p>
            </div>
            <div className={styles.demoContainer}>
              <div className={styles.demoVisual}>
                <div className={styles.collaboratorCursors}>
                  <div className={`${styles.cursor} ${styles.cursor1}`}>
                    <span>Shirley</span>
                  </div>
                  <div className={`${styles.cursor} ${styles.cursor2}`}>
                    <span>Bob</span>
                  </div>
                  <div className={`${styles.cursor} ${styles.cursor3}`}>
                    <span>Charlie</span>
                  </div>
                </div>
                <div className={styles.realtimeIndicator}>
                  <div className={styles.pulse}></div>
                  <span>Live collaboration</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2>Ready to Start Creating?</h2>
            <p>Join millions of users who trust Excalidraw for their creative work</p>
            <div className={styles.ctaButtons}>
              <a href="#" className={styles.btnPrimary}>Start Drawing Free</a>
              <a href="#" className={styles.btnSecondary}>Learn More</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">API</a>
              <a href="#">Integrations</a>
            </div>
            <div className={styles.footerSection}>
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">Tutorials</a>
              <a href="#">Blog</a>
              <a href="#">Community</a>
            </div>
            <div className={styles.footerSection}>
              <h4>Company</h4>
              <a href="#">About</a>
             
             
              <a href="#">Contact</a>
            </div>
            <div className={styles.footerSection}>
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2025 Excalidraw. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;