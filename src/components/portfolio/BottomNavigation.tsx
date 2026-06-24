"use client";

import { useEffect, useState } from "react";
import { Home, Map, FolderKanban, BookOpen, Mail } from "lucide-react";

export default function BottomNavigation() {
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const sections = ["hero", "career-journey", "room-of-requirement", "pensieve", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -60% 0px", // triggers when section is in the middle of viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          if (id === "hero") setActiveTab("home");
          else if (id === "career-journey") setActiveTab("journey");
          else if (id === "room-of-requirement") setActiveTab("projects");
          else if (id === "pensieve") setActiveTab("knowledge");
          else if (id === "contact") setActiveTab("contact");
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "home", label: "Home", sectionId: "hero", icon: <Home size={18} /> },
    { id: "journey", label: "Journey", sectionId: "career-journey", icon: <Map size={18} /> },
    { id: "projects", label: "Projects", sectionId: "room-of-requirement", icon: <FolderKanban size={18} /> },
    { id: "knowledge", label: "Knowledge", sectionId: "pensieve", icon: <BookOpen size={18} /> },
    { id: "contact", label: "Contact", sectionId: "contact", icon: <Mail size={18} /> },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md bg-portfolio-bgSec/75 backdrop-blur-lg border border-portfolio-card/65 p-2 rounded-full shadow-[0_10px_35px_-5px_rgba(0,0,0,0.6)] flex justify-around items-center transition-all duration-350">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.sectionId)}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-full transition-all duration-300 ${
              isActive
                ? "text-portfolio-gold bg-portfolio-gold/10 scale-105"
                : "text-portfolio-textSec/70 hover:text-white hover:bg-portfolio-card/25"
            }`}
          >
            {item.icon}
            <span className="text-[9px] font-mono tracking-wider font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
