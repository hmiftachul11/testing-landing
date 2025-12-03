'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Iridescence from '@/components/ui/animations/Iridescence';
import LaunchAppButton from '@/components/ui/animations/LaunchAppButton';
import Feature from './Feature';
import { HowItWork } from './HowItWork';
import { DefiFlywheelSection } from './DefiFlywheelSection';
import { IntegrationsMarquee } from './IntegrationsMarquee';
import { CTA } from './CTA';
import { Footer } from './Footer';
import { 
  NeuroNoise, 
  MeshGradient, 
  Metaballs 
} from '@paper-design/shaders-react';

export default function Landing() {
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Shader selection state
  const [selectedShader, setSelectedShader] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Applied color parameters for each shader type
  const [shaderColors, setShaderColors] = useState({
    neuroNoise: {
      colorBack: "#000000",
      colorMid: "#FF6B35", 
      colorFront: "#FF6B35"
    },
    meshGradient: {
      color1: "#000000",
      color2: "#FF6B35",
      color3: "#FF8C42",
      color4: "#FF6B35"
    },
    iridescence: {
      r: 0.93,
      g: 0.41,
      b: 0.09
    },
    metaballs: {
      colorBack: "#000000",
      colorMid: "#FF6B35",
      colorFront: "#FF8C42"
    }
  });

  // Pending color changes (staged but not yet applied)
  const [pendingColors, setPendingColors] = useState({
    neuroNoise: {
      colorBack: "#000000",
      colorMid: "#FF6B35", 
      colorFront: "#FF6B35"
    },
    meshGradient: {
      color1: "#000000",
      color2: "#FF6B35",
      color3: "#FF8C42",
      color4: "#FF6B35"
    },
    iridescence: {
      r: 0.93,
      g: 0.41,
      b: 0.09
    },
    metaballs: {
      colorBack: "#000000",
      colorMid: "#FF6B35",
      colorFront: "#FF8C42"
    }
  });

  // Dynamic shader configurations based on individual color parameters
  const getShaderOptions = () => {
    return [
      {
        name: 'Neuro Noise',
        component: NeuroNoise,
        props: {
          className: "w-full h-full",
          colorBack: shaderColors.neuroNoise.colorBack,
          colorMid: shaderColors.neuroNoise.colorMid,
          colorFront: shaderColors.neuroNoise.colorFront,
          speed: 0.8,
          brightness: 0.1,
          contrast: 0.6,
          scale: 1.5,
        }
      },
      {
        name: 'Mesh Gradient',
        component: MeshGradient,
        props: {
          className: "w-full h-full",
          colors: [
            shaderColors.meshGradient.color1,
            shaderColors.meshGradient.color2,
            shaderColors.meshGradient.color3,
            shaderColors.meshGradient.color4
          ],
          distortion: 1,
          swirl: 0.8,
          speed: 0.2,
        }
      },
      {
        name: 'Iridescence Ocean',
        component: Iridescence,
        props: {
          className: "w-full h-full",
          color: [shaderColors.iridescence.r, shaderColors.iridescence.g, shaderColors.iridescence.b] as [number, number, number],
          speed: 1,
          amplitude: 0.05,
          mouseReact: true,
        }
      },
      {
        name: 'Iridescence Orbit',
        component: Iridescence,
        props: {
          className: "w-full h-full",
          color: [shaderColors.iridescence.r, shaderColors.iridescence.g, shaderColors.iridescence.b] as [number, number, number],
          speed: 1,
          amplitude: 0.05,
          mouseReact: true,
        }
      },
      {
        name: 'Metaballs',
        component: Metaballs,
        props: {
          className: "w-full h-full",
          colorBack: shaderColors.metaballs.colorBack,
          colorMid: shaderColors.metaballs.colorMid,
          colorFront: shaderColors.metaballs.colorFront,
          speed: 0.3,
          brightness: 0.2,
          contrast: 0.7,
        }
      }
    ];
  };

  // Helper functions to update pending colors (staged changes)
  const updatePendingColor = (shaderType: string, colorKey: string, value: string | number) => {
    setPendingColors(prev => ({
      ...prev,
      [shaderType]: {
        ...prev[shaderType as keyof typeof prev],
        [colorKey]: value
      }
    }));
  };

  // Apply pending changes to active shader colors
  const applyColorChanges = () => {
    setShaderColors({ ...pendingColors });
  };

  // Reset pending changes back to current applied colors
  const resetPendingChanges = () => {
    setPendingColors({ ...shaderColors });
  };

  // Default colors for each shader type
  const defaultColors = {
    neuroNoise: {
      colorBack: "#000000",
      colorMid: "#FF6B35", 
      colorFront: "#FF6B35"
    },
    meshGradient: {
      color1: "#000000",
      color2: "#FF6B35",
      color3: "#FF8C42",
      color4: "#FF6B35"
    },
    iridescence: {
      r: 0.93,
      g: 0.41,
      b: 0.09
    },
    metaballs: {
      colorBack: "#000000",
      colorMid: "#FF6B35",
      colorFront: "#FF8C42"
    }
  };

  // Restore default colors for current shader and auto-apply
  const restoreDefaultColors = () => {
    const shaderTypes = ['neuroNoise', 'meshGradient', 'iridescence', 'iridescence', 'metaballs'];
    const currentShaderType = shaderTypes[selectedShader] as keyof typeof defaultColors;
    
    // Update both pending and applied colors simultaneously
    const newColors = {
      ...shaderColors,
      [currentShaderType]: { ...defaultColors[currentShaderType] }
    };
    
    setPendingColors(newColors);
    setShaderColors(newColors);
  };

  // Check if there are pending changes
  const hasPendingChanges = () => {
    return JSON.stringify(shaderColors) !== JSON.stringify(pendingColors);
  };

  // Check if current shader is using default colors
  const isUsingDefaultColors = () => {
    const shaderTypes = ['neuroNoise', 'meshGradient', 'iridescence', 'iridescence', 'metaballs'];
    const currentShaderType = shaderTypes[selectedShader] as keyof typeof defaultColors;
    
    return JSON.stringify(shaderColors[currentShaderType]) === JSON.stringify(defaultColors[currentShaderType]);
  };

  // Types for color controls
  type ColorControl = {
    key: string;
    label: string;
    value: string | number;
    type?: 'range' | 'color';
    min?: number;
    max?: number;
    step?: number;
  };

  // Get current shader color controls based on selected shader (showing pending values)
  const getCurrentColorControls = (): ColorControl[] => {
    const shaderTypes = ['neuroNoise', 'meshGradient', 'iridescence', 'iridescence', 'metaballs'];
    const shaderType = shaderTypes[selectedShader];

    switch (shaderType) {
      case 'neuroNoise':
        return [
          { key: 'colorBack', label: 'Back', value: pendingColors.neuroNoise.colorBack, type: 'color' },
          { key: 'colorMid', label: 'Mid', value: pendingColors.neuroNoise.colorMid, type: 'color' },
          { key: 'colorFront', label: 'Front', value: pendingColors.neuroNoise.colorFront, type: 'color' }
        ];
      case 'meshGradient':
        return [
          { key: 'color1', label: 'Color 1', value: pendingColors.meshGradient.color1, type: 'color' },
          { key: 'color2', label: 'Color 2', value: pendingColors.meshGradient.color2, type: 'color' },
          { key: 'color3', label: 'Color 3', value: pendingColors.meshGradient.color3, type: 'color' },
          { key: 'color4', label: 'Color 4', value: pendingColors.meshGradient.color4, type: 'color' }
        ];
      case 'iridescence':
        return [
          { key: 'r', label: 'Red', value: pendingColors.iridescence.r, type: 'range', min: 0, max: 1, step: 0.01 },
          { key: 'g', label: 'Green', value: pendingColors.iridescence.g, type: 'range', min: 0, max: 1, step: 0.01 },
          { key: 'b', label: 'Blue', value: pendingColors.iridescence.b, type: 'range', min: 0, max: 1, step: 0.01 }
        ];
      case 'metaballs':
        return [
          { key: 'colorBack', label: 'Back', value: pendingColors.metaballs.colorBack, type: 'color' },
          { key: 'colorMid', label: 'Mid', value: pendingColors.metaballs.colorMid, type: 'color' },
          { key: 'colorFront', label: 'Front', value: pendingColors.metaballs.colorFront, type: 'color' }
        ];
      default:
        return [];
    }
  };

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const bg = bgRef.current;
    const content = contentRef.current;
    const navbar = navbarRef.current;
    if (!bg || !content || !navbar) return;

    // Store original styles to restore on cleanup
    const originalBgStyle = bg.style.cssText;
    const originalContentStyle = content.style.cssText;
    const originalNavbarStyle = navbar.style.cssText;

    // Set final size immediately but scale to 0 - responsive margins
    const updateBgClass = () => {
      if (window.innerWidth < 640) {
        bg.className = 'fixed inset-0 z-0 m-2 rounded-lg overflow-hidden';
      } else if (window.innerWidth < 768) {
        bg.className = 'fixed inset-0 z-0 m-4 rounded-xl overflow-hidden';
      } else {
        bg.className = 'fixed inset-0 z-0 m-8 rounded-2xl overflow-hidden';
      }
    };
    updateBgClass();
    gsap.set(bg, {
      scale: 0.001,
      borderRadius: '50%',
      transformOrigin: 'center center',
    });

    // Hide content and navbar initially
    gsap.set(content, {
      opacity: 0,
    });
    gsap.set(content.children, {
      y: 50,
      opacity: 0,
    });
    gsap.set(navbar, {
      y: -20,
      opacity: 0,
    });

    // Animation: grow from center using scale
    const tl = gsap.timeline({ delay: 0 });

    // Background expansion
    tl.to(bg, {
      scale: 1,
      borderRadius: '24px',
      duration: 2.5,
      ease: 'power3.out',
      onComplete: () => {
        if (bg) {
          bg.style.transition = 'all 1s ease-in-out';
          gsap.set(bg, { clearProps: "scale,borderRadius,transformOrigin" });
        }
      }
    })
      // Navbar reveal animation
      .to(navbar, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      }, "-=1.2")
      // Content container reveal
      .to(content, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, "-=1.0")
      // Content reveal animation - staggered from bottom to top
      .to(content.children, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.15,
      }, "-=0.8");

    // Animation to change classes on scroll
    const scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top -50px',
      end: 'top -100px',
      onEnter: () => {
        if (bg) {
          bg.className = 'fixed inset-0 z-0 m-[-30px] rounded-none overflow-hidden';
          bg.style.transition = 'all 1s ease-in-out';
        }
      },
      onLeave: () => {
        if (bg) {
          bg.className = 'fixed inset-0 z-0 m-[-30px] rounded-none overflow-hidden';
          bg.style.transition = 'all 1s ease-in-out';
        }
      },
      onEnterBack: () => {
        if (bg) {
          bg.className = 'fixed inset-0 z-0 m-[-30px] rounded-none overflow-hidden';
          bg.style.transition = 'all 1s ease-in-out';
        }
      },
      onLeaveBack: () => {
        if (bg) {
          updateBgClass();
          bg.style.transition = 'all 1s ease-in-out';
          // Clear specific properties instead of setting them
          bg.style.removeProperty('top');
          bg.style.removeProperty('left');
          bg.style.removeProperty('width');
          bg.style.removeProperty('height');
          bg.style.removeProperty('margin');
          bg.style.removeProperty('border-radius');
        }
      }
    });

    return () => {
      // Kill timeline first
      tl.kill();
      // Kill scroll trigger
      scrollTrigger.kill();
      // Clear all GSAP properties and restore original styles
      if (bg) {
        gsap.set(bg, { clearProps: "all" });
        bg.style.cssText = originalBgStyle;
      }
      if (content) {
        gsap.set(content, { clearProps: "all" });
        gsap.set(content.children, { clearProps: "all" });
        content.style.cssText = originalContentStyle;
      }
      if (navbar) {
        gsap.set(navbar, { clearProps: "all" });
        navbar.style.cssText = originalNavbarStyle;
      }
      // Kill any remaining ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div ref={navbarRef} className="z-50 opacity-0 fixed top-2 sm:top-6 md:top-10 left-2 sm:left-6 md:left-10 right-2 sm:right-6 md:right-10 px-3 sm:px-6 py-2 sm:py-4 transition-all duration-300">
        <div className="flex justify-between items-center gap-4">
          {/* Dynamic Color Controls */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 max-w-2xl overflow-x-auto">
            <label className="text-white text-sm font-medium whitespace-nowrap">
              {getShaderOptions()[selectedShader].name}:
            </label>
            {getCurrentColorControls().map((control) => (
              <div key={control.key} className="flex items-center gap-1">
                <span className="text-white text-xs whitespace-nowrap">{control.label}:</span>
                {control.type === 'range' ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="range"
                      min={control.min!}
                      max={control.max!}
                      step={control.step!}
                      value={control.value}
                      onChange={(e) => {
                        const shaderTypes = ['neuroNoise', 'meshGradient', 'iridescence', 'iridescence', 'metaballs'];
                        updatePendingColor(shaderTypes[selectedShader], control.key, parseFloat(e.target.value));
                      }}
                      className="w-16 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-white text-xs min-w-8">{(control.value as number).toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <input
                      type="color"
                      value={control.value as string}
                      onChange={(e) => {
                        const shaderTypes = ['neuroNoise', 'meshGradient', 'iridescence', 'iridescence', 'metaballs'];
                        updatePendingColor(shaderTypes[selectedShader], control.key, e.target.value);
                      }}
                      className="w-6 h-6 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                )}
              </div>
            ))}
            
            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={restoreDefaultColors}
                className={`px-3 py-1 text-white text-xs font-medium rounded-full transition-all duration-200 ${
                  isUsingDefaultColors() 
                    ? 'bg-orange-600/50 hover:bg-orange-600/70 cursor-not-allowed' 
                    : 'bg-orange-600 hover:bg-orange-700 cursor-pointer'
                }`}
                title={isUsingDefaultColors() ? "Already using default colors" : "Restore default colors for current shader"}
                disabled={isUsingDefaultColors()}
              >
                Default
              </button>
              <button
                onClick={resetPendingChanges}
                className={`px-3 py-1 text-white text-xs font-medium rounded-full transition-all duration-200 ${
                  hasPendingChanges() 
                    ? 'bg-gray-600 hover:bg-gray-700' 
                    : 'bg-gray-600/50 hover:bg-gray-600/70'
                }`}
                title="Reset to current colors"
                disabled={!hasPendingChanges()}
              >
                Reset
              </button>
              <button
                onClick={applyColorChanges}
                className={`px-3 py-1 text-white text-xs font-medium rounded-full transition-all duration-200 ${
                  hasPendingChanges() 
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                    : 'bg-blue-600/50 hover:bg-blue-600/70 cursor-not-allowed'
                }`}
                title="Apply color changes"
                disabled={!hasPendingChanges()}
              >
                Apply
              </button>
            </div>
          </div>
          
          {/* Shader Selector Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-white text-sm font-medium whitespace-nowrap">
                {getShaderOptions()[selectedShader].name}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 min-w-48 bg-black/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg overflow-hidden z-50">
                {getShaderOptions().map((shader, index) => (
                  <button
                    key={shader.name}
                    className={`w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-3 ${
                      selectedShader === index ? 'bg-white/20' : ''
                    }`}
                    onClick={() => {
                      setSelectedShader(index);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{shader.name}</div>
                      <div className="text-xs text-white/70">
                        {index === 0 && "Neural noise pattern"}
                        {index === 1 && "Flowing gradient mesh"}
                        {index === 2 && "Iridescent ocean waves"}
                        {index === 3 && "Orbital iridescence"}
                        {index === 4 && "Organic liquid shapes"}
                      </div>
                    </div>
                    {selectedShader === index && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-green-400"
                      >
                        <path
                          d="M9 12L11 14L15 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-screen w-full">
        <div
          ref={bgRef}
          className="fixed inset-0 z-0 m-[-40] rounded-2xl overflow-hidden"
        >
          {(() => {
            const shaderOptions = getShaderOptions();
            const ShaderComponent = shaderOptions[selectedShader].component;
            return <ShaderComponent {...shaderOptions[selectedShader].props} />;
          })()}
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div ref={contentRef} className="relative z-10 h-[calc(100vh-24px)] sm:h-[calc(100vh-32px)] md:h-[calc(100vh-48px)] m-2 sm:m-4 md:m-6 opacity-0">
          {/* Mobile: Combined title, description, and button */}
          <div className="block sm:hidden absolute top-1/4 left-0 right-0 z-20 text-center px-4">
            <h2 className="text-3xl font-bold leading-tight text-white mb-6">
              Start Earning Yield While Trading
            </h2>
            <p className="text-white/90 text-base leading-relaxed mb-8">
              Trade Your Assets While They Earn Yield. Revolutionary DeFi platform that maximizes capital efficiency through intelligent automation.
            </p>
            <div className="transform scale-75 flex justify-center">
              <LaunchAppButton
                text="Launch App"
                href={process.env.NEXT_PUBLIC_APP_URL}
              />
            </div>
          </div>

          {/* Desktop: Separate positioned elements */}
          <div className="hidden sm:block absolute top-1/3 left-6 md:left-10 z-20">
            <h2 className="max-w-4xl md:max-w-5xl text-4xl md:text-6xl lg:text-8xl font-bold leading-tight text-white">
              Start Earning Yield While Trading
            </h2>
          </div>

          <div className="hidden sm:block absolute bottom-16 md:bottom-10 left-6 md:left-10 z-20">
            <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-xl md:max-w-2xl">
              Trade Your Assets While They Earn Yield. Revolutionary DeFi platform that maximizes capital efficiency through intelligent automation.
            </p>
          </div>

          {/* Desktop: Button positioned separately */}
          <div className="hidden sm:block absolute bottom-6 md:bottom-10 right-10 z-20">
            <div className="transform scale-90 md:scale-100">
              <LaunchAppButton
                text="Launch App"
                href={process.env.NEXT_PUBLIC_APP_URL}
              />
            </div>
          </div>
        </div>

        <Feature
          label="Features"
          currentStep={1}
          totalSteps={3}
          title="Ultimate Capital Efficiency"
          description="Maximize returns by keeping your entire portfolio productive. Trade your assets while they earn yield through our revolutionary DeFi platform that leverages intelligent automation for optimal capital efficiency."
        />
      </div>

      <HowItWork />

      <DefiFlywheelSection />

      <IntegrationsMarquee />

      <CTA />

      <Footer />
    </div>
  );
}