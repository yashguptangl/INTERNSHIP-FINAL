import { Intern } from '@/types/internship';
import { formatDate } from '@/data/internshipData';

interface CertificateTemplateProps {
  intern: Intern;
}

const CertificateTemplate = ({ intern }: CertificateTemplateProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-card" id="certificate">
      {/* Outer Border */}
      <div className="p-3 bg-gradient-to-r from-primary via-accent to-primary">
        <div className="p-2 bg-card">
          <div className="p-8 border-4 border-primary/30 relative">
            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary" />

            {/* Content */}
            <div className="text-center py-8">
              {/* Logo */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-20 h-20 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-bold text-4xl">T</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-1">SkillBuild Era</h1>
              <p className="text-muted-foreground text-sm tracking-widest uppercase mb-8">
                Empowering Future Tech Leaders
              </p>

              {/* Certificate Title */}
              <div className="mb-8">
                <h2 className="text-5xl font-serif italic gradient-text inline-block mb-2">
                  Certificate
                </h2>
                <p className="text-xl text-muted-foreground">of Completion</p>
              </div>

              {/* Decorative Line */}
              <div className="flex items-center justify-center gap-4 my-8">
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent to-primary" />
                <div className="w-3 h-3 rotate-45 bg-primary" />
                <div className="w-24 h-0.5 bg-gradient-to-l from-transparent to-primary" />
              </div>

              {/* Main Content */}
              <p className="text-lg text-muted-foreground mb-4">This is to certify that</p>
              
              <h3 className="text-4xl font-bold text-foreground mb-4 font-serif">
                {intern.name}
              </h3>

              <p className="text-sm font-mono text-primary mb-6">
                Employee ID: {intern.employeeId}
              </p>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
                has successfully completed the <strong className="text-foreground">{intern.domain}</strong> internship 
                program at SkillBuild Era, demonstrating exceptional dedication, technical 
                proficiency, and professional growth.
              </p>

              {/* Duration Box */}
              <div className="inline-flex items-center gap-8 px-8 py-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-8">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Start Date</p>
                  <p className="font-semibold text-foreground">{formatDate(intern.startDate)}</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">End Date</p>
                  <p className="font-semibold text-foreground">{formatDate(intern.endDate)}</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Duration</p>
                  <p className="font-semibold text-foreground">4 Weeks</p>
                </div>
              </div>

              {/* Decorative Line */}
              <div className="flex items-center justify-center gap-4 my-8">
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent to-primary" />
                <div className="w-3 h-3 rotate-45 bg-primary" />
                <div className="w-24 h-0.5 bg-gradient-to-l from-transparent to-primary" />
              </div>

              {/* Signatures */}
              <div className="flex items-end justify-around mt-12">
                <div className="text-center">
                  <div className="w-40 border-b-2 border-foreground/20 mb-2" />
                  <p className="font-semibold text-foreground">Program Director</p>
                  <p className="text-sm text-muted-foreground">SkillBuild Era</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 border-2 border-primary/30 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-xs text-muted-foreground">Official Seal</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-40 border-b-2 border-foreground/20 mb-2" />
                  <p className="font-semibold text-foreground">HR Manager</p>
                  <p className="text-sm text-muted-foreground">SkillBuild Era</p>
                </div>
              </div>

              {/* Date */}
              <p className="mt-8 text-sm text-muted-foreground">
                Issued on: {formatDate(new Date())}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Note */}
      <div className="text-center py-4 text-xs text-muted-foreground">
        <p>Verify this certificate at: www.technosolutions.com/verify/{intern.employeeId}</p>
      </div>
    </div>
  );
};

export default CertificateTemplate;
