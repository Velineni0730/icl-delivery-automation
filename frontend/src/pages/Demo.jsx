import React, { useState, useRef } from "react";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
import physicalSheet from "../assets/sample.png";
import uploadDash from "../assets/uploadDash.png";
import reviewEdit from "../assets/reviewEdit.png";
import excelSync from "../assets/excelSync.png";
import uploadLogs from "../assets/uploadLogs.png";

export default function Demo() {
  const [activeStep, setActiveStep] = useState(null);
  const stepRefs = useRef({});

  const scrollToWorkflow = () => {
    document.getElementById("workflow-section").scrollIntoView({ behavior: "smooth" });
  };
  const startAutoDemo = () => {
    if (activeStep !== null) return; 
    
    let current = 1;
    setActiveStep(current);
  
    stepRefs.current[current]?.scrollIntoView({ behavior: "smooth", block: "center" });

    const interval = setInterval(() => {
      current += 1;
      
      if (current > 5) {
        clearInterval(interval);
        setActiveStep(null); 
      } else {
        setActiveStep(current);
        stepRefs.current[current]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 4500); 
  };

  const workflowSteps = [
    {
      id: 1,
      icon: "📄",
      title: "1. The Raw Sheet",
      desc: "It starts with your standard physical delivery run sheet. Hand-written numbers, messy signatures, and varying weights. What used to take hours is now just the starting line.",
      img: physicalSheet,
      glow: "bg-emerald-500",
    },
    {
      id: 2,
      icon: "📸",
      title: "2. One-Click Upload",
      desc: "Open the web app on any device. Snap a photo of the sheet directly from your phone. The interface is clean, distraction-free, and instantly ready for processing.",
      img: uploadDash,
      glow: "bg-teal-500",
    },
    {
      id: 3,
      icon: "✨",
      title: "3. AI Extraction",
      desc: "Our Gemini AI engine instantly reads the AWB, pieces, and weight. It auto-calculates charges on the fly. Review everything on a clean digital sheet before confirming.",
      img: reviewEdit,
      glow: "bg-cyan-500",
    },
    {
      id: 4,
      icon: "📊",
      title: "4. Excel Sync",
      desc: "Hit confirm, and the data is piped instantly via Microsoft Graph into your master Excel sheet. Formatted perfectly, calculated flawlessly, and ready for accounting.",
      img: excelSync,
      glow: "bg-emerald-400",
    },
    {
      id: 5,
      icon: "🗄️",
      title: "5. Transparent Logs",
      desc: "Never lose track of a sheet. The system automatically logs every upload by date, showing total shipments, amounts, and sync status, keeping you 100% organized.",
      img: uploadLogs,
      glow: "bg-teal-400",
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#09090b] text-slate-200 font-sans selection:bg-emerald-500/30">
      
      <div className="fixed -top-[20%] -left-[10%] h-[60vw] w-[60vw] md:h-[50vw] md:w-[50vw] rounded-full bg-emerald-600/10 blur-[100px] md:blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="fixed top-[40%] -right-[10%] h-[50vw] w-[50vw] md:h-[40vw] md:w-[40vw] rounded-full bg-teal-600/10 blur-[100px] md:blur-[130px] mix-blend-screen pointer-events-none" />
      <div className="fixed -bottom-[20%] left-[20%] h-[60vw] w-[60vw] md:h-[50vw] md:w-[50vw] rounded-full bg-cyan-600/10 blur-[100px] md:blur-[120px] mix-blend-screen pointer-events-none" />

      <div className={`fixed inset-0 z-40 bg-[#09090b]/90 backdrop-blur-md transition-opacity duration-1000 pointer-events-none ${
        activeStep !== null ? "opacity-100" : "opacity-0"
      }`} />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 sm:px-6 text-center">
        
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 md:px-5 md:py-2 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
          <span className="text-xs md:text-sm font-medium tracking-wide text-emerald-200">
            AI Powered Courier Automation
          </span>
        </div>

        <h1 className="mt-6 md:mt-8 text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl">
          Automate Your <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Delivery Sheets
          </span>
        </h1>

        <p className="mt-6 md:mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-slate-400">
          Transform messy physical run sheets into organized Excel data in seconds. 
          Powered by advanced AI OCR, built for speed, designed for absolute simplicity.
        </p>

        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row w-full sm:w-auto flex-wrap justify-center gap-4 md:gap-5">
          <button 
            onClick={startAutoDemo}
            className={`group flex items-center justify-center w-full sm:w-auto gap-3 rounded-2xl px-6 md:px-8 py-4 font-semibold text-white transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] ${
              activeStep !== null 
                ? "bg-emerald-800 scale-95 cursor-not-allowed" 
                : "bg-emerald-600 hover:scale-105 hover:bg-emerald-500"
            }`}
          >
            {activeStep !== null ? (
              <span className="animate-pulse flex items-center gap-2">Running Demo...</span>
            ) : (
              <>
                <Play size={18} className="fill-white" />
                Launch Live Demo
              </>
            )}
          </button>
          
          <button 
            onClick={scrollToWorkflow}
            className="group flex items-center justify-center w-full sm:w-auto gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 md:px-8 py-4 font-medium text-slate-300 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:text-white"
          >
            See How It Works
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </section>

      <section id="workflow-section" className={`relative mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-32 transition-all duration-700 ${activeStep !== null ? "z-50" : "z-10"}`}>
        
        <div className={`text-center mb-16 md:mb-24 transition-opacity duration-700 ${activeStep !== null ? "opacity-0" : "opacity-100"}`}>
          <p className="text-emerald-400 font-semibold uppercase tracking-[0.2em] drop-shadow-md text-sm md:text-base">
            The Workflow
          </p>
          <h2 className="mt-3 md:mt-4 text-3xl md:text-5xl font-bold text-white">
            From Paper to Pixel
          </h2>
        </div>

        <div className="relative mt-10 md:mt-20">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-emerald-500/80 via-teal-500/50 to-transparent md:block shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>

          {workflowSteps.map((step, index) => {
            const isEven = index % 2 === 0;
            const isActive = activeStep === step.id;
            const isDemoRunning = activeStep !== null;
            const isPortrait = step.id === 1; 

            return (
              <div 
                key={step.id} 
                ref={(el) => (stepRefs.current[step.id] = el)}
                className={`relative scroll-m-24 md:scroll-m-32 mb-24 md:mb-40 flex flex-col items-center justify-between gap-8 md:gap-12 transition-all duration-1000 ${
                  isEven ? "md:flex-row flex-col" : "md:flex-row-reverse flex-col-reverse"
                } ${isActive ? "z-50 opacity-100" : isDemoRunning ? "z-10 opacity-10 blur-sm scale-95 pointer-events-none" : "z-10 opacity-100"}`}
              >
                
                <div className={`absolute left-1/2 top-1/2 hidden h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#09090b] md:block z-10 transition-all duration-700 ${
                  isActive ? `${step.glow} shadow-[0_0_30px_#34d399] scale-150` : isDemoRunning ? "bg-emerald-900" : step.glow
                }`}></div>
                
                <div className={`w-full md:w-[45%] flex flex-col justify-center transition-all duration-1000 ease-out origin-center ${isActive ? "z-20" : ""}`}>
                  <div className={`rounded-3xl border p-6 md:p-8 backdrop-blur-xl transition-all duration-1000 ${
                    isActive 
                      ? "bg-transparent border-transparent" 
                      : "bg-white/5 border-white/10 shadow-2xl"
                  }`}>
                    <span className={`text-4xl md:text-5xl block transition-all duration-500 ${isActive ? "h-0 opacity-0 mb-0" : "mb-4 md:mb-6 opacity-100 h-auto"}`}>
                      {step.icon}
                    </span>
                    
                    <h3 className={`font-bold transition-all duration-1000 ${
                      isActive ? "text-3xl md:text-4xl lg:text-5xl text-emerald-300 drop-shadow-lg mb-4 md:mb-6" : "text-2xl lg:text-3xl text-white mb-0"
                    }`}>
                      {step.title}
                    </h3>
                    
                    <p className={`transition-all duration-1000 ${
                      isActive ? "text-lg md:text-xl lg:text-2xl text-emerald-50 leading-relaxed font-medium" : "text-sm md:text-base mt-3 md:mt-4 text-slate-400"
                    }`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
                
                <div className={`w-full md:w-[45%] group perspective transition-all duration-1000 flex justify-center ${isActive ? "z-20" : ""}`}>
                  <div className={`relative w-full rounded-[1.5rem] md:rounded-[2rem] border bg-[#09090b] p-1.5 md:p-2 transition-all duration-1000 ${
                    isActive ? "border-emerald-500/50 shadow-[0_0_80px_rgba(16,185,129,0.3)] scale-105 md:scale-[1.15]" : "border-white/10 shadow-2xl scale-100"
                  }`}>
                    {isActive && (
                      <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-40 blur-2xl transition duration-1000 animate-pulse"></div>
                    )}
                    
                    <div className="relative overflow-hidden rounded-[1.2rem] md:rounded-[1.5rem] w-full bg-[#09090b]">
                      <img 
                        src={step.img} 
                        alt={step.title} 
                        className={`relative w-full object-cover object-center opacity-100 transition-transform duration-1000 ease-out ${
                          isActive ? "scale-105" : "scale-100"
                        } ${
                          isPortrait 
                            ? "aspect-[3/4]" 
                            : "aspect-[4/3] lg:aspect-[16/10]" 
                        }`} 
                      />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-20 md:pb-32 pt-10">
        <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4">
          {[
            { number: "99%", title: "OCR Accuracy" },
            { number: "<2s", title: "Avg. Processing" },
            { number: "100%", title: "Autosave Data" },
            { number: "24/7", title: "Cloud Active" },
          ].map((item, index) => (
            <div
              key={index}
              className="group rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 p-4 md:p-8 text-center backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:bg-white/10 hover:border-emerald-500/40 shadow-lg"
            >
              <h3 className="text-3xl md:text-5xl font-black bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {item.number}
              </h3>
              <p className="mt-2 md:mt-4 text-slate-400 font-medium tracking-wide uppercase text-xs md:text-sm">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-emerald-500/20 bg-emerald-900/10 p-8 md:p-14 text-center backdrop-blur-2xl shadow-[0_0_80px_rgba(16,185,129,0.05)]">
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] md:h-[400px] md:w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-[100px] md:blur-[120px]" />
          
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
              Stop Typing. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Start Scanning.
              </span>
            </h2>
            <p className="mx-auto mt-4 md:mt-6 max-w-2xl text-sm md:text-lg text-slate-400">
              Join the future of courier management. Process your delivery sheets in a fraction of the time with zero errors.
            </p>
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-5">
              <button 
                onClick={startAutoDemo}
                className="w-full sm:w-auto rounded-2xl bg-emerald-600 px-8 md:px-10 py-4 font-semibold text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] transition duration-300 hover:scale-105 hover:bg-emerald-500"
              >
                Launch Demo Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 bg-[#09090b]/50 backdrop-blur-lg py-10 md:py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 text-center md:flex-row">
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              ICL Automation
            </h3>
            <p className="mt-2 text-slate-500 text-xs md:text-sm">
              Engineered with React · Express · MongoDB · Gemini OCR
            </p>
          </div>
          <div className="flex gap-6 md:gap-8 text-sm md:text-base text-slate-400">
            <a href="https://github.com/Velineni0730/icl-delivery-automation" className="transition hover:text-emerald-400">GitHub</a>
          </div>
        </div>
        <div className="mt-8 md:mt-10 text-center text-xs md:text-sm text-slate-600 px-4">
          © {new Date().getFullYear()} Bharat Velineni. All rights reserved.
        </div>
      </footer>

    </div>
  );
}