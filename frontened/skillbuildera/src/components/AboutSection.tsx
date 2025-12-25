import { motion } from 'framer-motion';
import { Target, Users, Lightbulb, TrendingUp, CheckCircle } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Target,
      title: 'Industry-Aligned Training',
      description: 'Our curriculum is designed in collaboration with leading tech companies to ensure you learn skills that matter.',
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Get guidance from experienced professionals who have worked at top tech companies globally.',
    },
    {
      icon: Lightbulb,
      title: 'Hands-on Projects',
      description: 'Work on real-world projects that you can showcase in your portfolio to potential employers.',
    },
    {
      icon: TrendingUp,
      title: 'Career Support',
      description: 'Receive comprehensive career support including resume building, interview prep, and job placement assistance.',
    },
  ];

  const highlights = [
    '100% Remote & Flexible',
    '4-Week Intensive Program',
    'Industry-Recognized Certificate',
    'Real-World Project Experience',
    'Dedicated Mentor Support',
    'Portfolio Building',
  ];

  return (
    <section id="about" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="section-badge mb-4">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Empowering Future{' '}
              <span className="gradient-text">Tech Leaders</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              At SkillBuild Era, we believe that everyone deserves access to quality tech education 
              and real-world experience. Our internship programs bridge the gap between academic 
              knowledge and industry requirements.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Since our inception, we have trained over 5000 interns who are now working at leading 
              tech companies across the globe. Our 4-week intensive programs are designed to give 
              you practical skills and confidence to succeed in the tech industry.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-card border border-border hover-lift"
              >
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
