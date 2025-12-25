import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqData = [
  {
    question: 'What is the duration of the internship program?',
    answer: 'All our internship programs are 4 weeks (1 month) long. This duration is designed to give you comprehensive hands-on experience while being manageable alongside your studies.',
  },
  {
    question: 'How does the phase-based batch system work?',
    answer: 'We have 3 phases each month: Phase 1 (apply by end of month, start on 1st), Phase 2 (apply 1st-10th, start on 11th), and Phase 3 (apply 11th-21st, start on 21st). This ensures you can join at convenient intervals.',
  },
  {
    question: 'Is this internship completely remote?',
    answer: 'Yes! All our internship programs are 100% remote. You can work from anywhere with a stable internet connection. We provide all necessary resources and mentorship online.',
  },
  {
    question: 'Will I receive a certificate after completion?',
    answer: 'Absolutely! Upon successful completion of your internship, you will receive an official completion certificate with a unique Employee ID that can be verified on our portal.',
  },
  {
    question: 'What is the Employee ID and how is it generated?',
    answer: 'Your unique Employee ID follows the format: [DOMAIN]-[YEAR]-P[PHASE]-[SUFFIX]. For example, MERN-25-P1-K9VX indicates a MERN Stack intern from 2025, Phase 1. This ID is used for verification purposes.',
  },
  {
    question: 'Are there any fees for the internship?',
    answer: 'The internship itself is entirely free of charge. However, to cover the expenses related to certification documentation, there is a nominal fee of ₹99 that needs to be paid.',
  },
  {
    question: 'What kind of projects will I work on?',
    answer: 'You will work on real-world projects relevant to your chosen domain. These projects are designed to build your portfolio and give you practical experience that employers value.',
  },
  {
    question: 'How can I verify my internship certificate?',
    answer: 'You can verify any certificate by visiting our Verify page and entering the Employee ID. This will display all details about the internship including dates, domain, and completion status.',
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-badge mb-4">
            <HelpCircle className="w-4 h-4 inline mr-2" />
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-5">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
