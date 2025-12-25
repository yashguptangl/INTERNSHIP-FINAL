import { motion } from 'framer-motion';
import InternshipCard from './InternshipCard';
import { internshipPrograms } from '@/data/internshipData';
import { Calendar } from 'lucide-react';

const ProgramsSection = () => {
  return (
    <section id="programs" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-badge mb-4">
            Internship Programs
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Path to{' '}
            <span className="gradient-text">Success</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive internship programs designed to give you hands-on experience
            in the most in-demand tech domains.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internshipPrograms.map((program, index) => (
            <InternshipCard key={program.id} program={program} index={index} />
          ))}
        </div>

        {/* Phase Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-2xl bg-card border border-border shadow-card"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">
              Internship Batch Schedule
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-secondary border border-border">
              <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                P1
              </div>
              <h4 className="font-semibold text-foreground mb-2">Phase 1</h4>
              <p className="text-sm text-muted-foreground">
                Apply by end of month → Start on 1st
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-secondary border border-border">
              <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                P2
              </div>
              <h4 className="font-semibold text-foreground mb-2">Phase 2</h4>
              <p className="text-sm text-muted-foreground">
                Apply 1st-10th → Start on 11th
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-secondary border border-border">
              <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                P3
              </div>
              <h4 className="font-semibold text-foreground mb-2">Phase 3</h4>
              <p className="text-sm text-muted-foreground">
                Apply 11th-21st → Start on 21st
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramsSection;
