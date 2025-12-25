import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Users, Award, Briefcase, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const stats = [
    { icon: Users, value: '1000+', label: 'Interns Trained' },
    { icon: Award, value: '20+', label: 'Partner Companies' },
  ];

  // Compute the batch label before returning JSX
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString('default', { month: 'long' });
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleString('default', { month: 'long' });
  const batchLabel = day <= 20 ? month : nextMonth;

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm mb-6 sm:mb-8"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="whitespace-nowrap">Applications Open for {batchLabel} Batch</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-4 sm:mb-6"
          >
            Launch Your{' '}
            <span className="relative inline-block">
              <span className="gradient-text">Tech Career</span>
              <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 4 150 2 298 8" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
                    <stop stopColor="hsl(220, 90%, 56%)" />
                    <stop offset="1" stopColor="hsl(172, 66%, 50%)" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{' '}
            Today
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 px-2"
          >
            Join SkillBuild Era' industry-leading internship programs. Gain real-world experience, 
            mentorship from experts, and kickstart your journey in tech.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4 sm:px-0"
          >
            <a href="#programs" className="w-full sm:w-auto">
              <Button variant="gradient" size="lg" className="group w-full sm:w-auto">
                Explore Programs
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto px-2 sm:px-0"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-row xs:flex-col items-center gap-3 xs:gap-0 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border border-border shadow-card"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl gradient-bg flex items-center justify-center xs:mb-3 flex-shrink-0">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <div className="flex flex-col xs:items-center">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground xs:mb-1">{stat.value}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-secondary"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
