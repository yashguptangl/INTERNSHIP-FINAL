import { Intern } from '@/types/internship';
import { formatDate } from '@/data/internshipData';

interface OfferLetterTemplateProps {
  intern: Intern;
}

const OfferLetterTemplate = ({ intern }: OfferLetterTemplateProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-card p-8 print:p-12" id="offer-letter">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-primary pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl gradient-bg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl">T</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">SkillBuild Era</h1>
            <p className="text-sm text-muted-foreground">Empowering Future Tech Leaders</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Date: {formatDate(new Date())}</p>
          <p className="text-sm font-mono text-primary font-semibold">Ref: OL-{intern.employeeId}</p>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text inline-block">INTERNSHIP OFFER LETTER</h2>
      </div>

      {/* Content */}
      <div className="space-y-6 text-foreground">
        <p>Dear <strong>{intern.name}</strong>,</p>

        <p className="leading-relaxed">
          We are pleased to inform you that you have been selected for the <strong>{intern.domain}</strong> internship 
          program at <strong>SkillBuild Era</strong>. We were impressed by your application and are excited to 
          welcome you to our team.
        </p>

        {/* Details Box */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-6 my-8">
          <h3 className="font-bold text-lg text-foreground mb-4">Internship Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Employee ID:</span>
              <p className="font-mono font-bold text-primary">{intern.employeeId}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Domain:</span>
              <p className="font-semibold">{intern.domain}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Start Date:</span>
              <p className="font-semibold">{formatDate(intern.startDate)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">End Date:</span>
              <p className="font-semibold">{formatDate(intern.endDate)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <p className="font-semibold">4 Weeks</p>
            </div>
            <div>
              <span className="text-muted-foreground">Mode:</span>
              <p className="font-semibold">Remote</p>
            </div>
            <div>
              <span className="text-muted-foreground">Phase:</span>
              <p className="font-semibold">Phase {intern.phase}</p>
            </div>
          </div>
        </div>

        <p className="leading-relaxed">
          During this internship, you will have the opportunity to work on real-world projects, 
          receive mentorship from industry experts, and develop skills that are in high demand 
          in the tech industry.
        </p>

        
        <p className="leading-relaxed">
          We look forward to having you on board and wish you all the best for your internship journey!
        </p>

        {/* Signature */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="mb-8">Best Regards,</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-bold text-foreground text-lg">HR Team</p>
              <p className="text-muted-foreground">SkillBuild Era</p>
              <p className="text-sm text-muted-foreground">careers@skillbuildera.com</p>
            </div>
            <div className="text-right">
              <div className="w-24 h-24 border-2 border-primary/30 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Official Seal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        <p>This is a computer-generated document and does not require a physical signature.</p>
        <p className="mt-1">SkillBuild Era | 123 Tech Park, Bangalore | www.skillbuildera.com</p>
      </div>
    </div>
  );
};

export default OfferLetterTemplate;
