import nodemailer from 'nodemailer';
import { Intern } from '@prisma/client';
import htmlPdf from 'html-pdf-node';
import fs from 'fs';
import path from 'path';

class EmailService {
  private transporter;
  private logoBase64: string;
  private stampBase64: string;
  private msmeBase64: string;
  private signBase64: string;

  // Domain → PDF mapping
  private domainPdfMapping: Record<string, string> = {
    'data analytics': 'data-analytics.pdf',
    'data-analytics': 'data-analytics.pdf',

    'mern stack': 'mern.pdf',
    'mern stack (web development)': 'mern.pdf',
    'mern': 'mern.pdf',
    'web development': 'mern.pdf',

    'java development': 'java.pdf',
    'java': 'java.pdf',

    'data science': 'data-science.pdf',
    'data-science': 'data-science.pdf',

    'ai/ml': 'ai-ml.pdf',
    'ai-ml': 'ai-ml.pdf',
    'ai ml': 'ai-ml.pdf',

    'cyber security': 'cyber-security.pdf',
    'cyber-security': 'cyber-security.pdf',

    'python programming': 'python.pdf',
    'python': 'python.pdf',

    'ui/ux design': 'ui-ux.pdf',
    'ui/ux': 'ui-ux.pdf',
    'ui-ux': 'ui-ux.pdf',
    'ui ux design': 'ui-ux.pdf',
    'ui ux': 'ui-ux.pdf',
  };

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      socketTimeout: 30000,
    });

    this.logoBase64 = this.imageToBase64('src/assets/logo.jpeg');
    this.stampBase64 = this.imageToBase64('src/assets/official-stamp.png');
    this.msmeBase64 = this.imageToBase64('src/assets/msme.png');
    this.signBase64 = this.imageToBase64('src/assets/sign.jpeg');
  }

  private imageToBase64(relativePath: string): string {
    try {
      const filePath = path.join(process.cwd(), relativePath);
      const buffer = fs.readFileSync(filePath);
      const ext = path.extname(filePath).replace('.', '');
      return `data:image/${ext};base64,${buffer.toString('base64')}`;
    } catch {
      console.warn(`Image not found: ${relativePath}`);
      return '';
    }
  }

  // Domain specific PDF
  private getDomainPdfBuffer(domain: string): Buffer | null {
    try {
      if (!domain) return null;

      const normalized = domain
        .trim()
        .toLowerCase()
        .replace(/[-_/]+/g, ' ')
        .replace(/\s+/g, ' ');

      console.log('🔎 Domain raw:', domain);
      console.log('🔎 Domain normalized:', normalized);

      let filename = this.domainPdfMapping[normalized];

      if (!filename) {
        const found = Object.keys(this.domainPdfMapping).find((key) =>
          normalized.includes(key),
        );
        if (found) filename = this.domainPdfMapping[found];
      }

      console.log('📄 Selected filename:', filename);

      if (!filename) {
        console.warn(`No PDF found for domain: ${domain}`);
        return null;
      }

      const pdfPath = path.join(
        process.cwd(),
        'src/assets/domain-pdfs',
        filename,
      );
      const pdfBuffer = fs.readFileSync(pdfPath);
      return pdfBuffer;
    } catch (err) {
      console.warn(
        `Domain PDF not found for ${domain}:`,
        err instanceof Error ? err.message : err,
      );
      return null;
    }
  }

  // Send Offer Letter + Domain PDF
  async sendOfferLetter(intern: Intern): Promise<void> {
    // Always set duration to 28 days (4 weeks)
    const startDate = new Date(intern.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 27); // 28 days including start

    // Clone intern object with forced duration
    const internWithFixedDuration = {
      ...intern,
      startDate,
      endDate,
    };

    const offerLetterHTML = this.generateOfferLetterHTML(internWithFixedDuration);
    const simpleText = this.generateOfferLetterText(internWithFixedDuration);

    const offerLetterPdfBuffer = (await htmlPdf.generatePdf(
      { content: offerLetterHTML },
      { format: 'A4', printBackground: true },
    )) as unknown as Buffer;

    const domainPdfBuffer = this.getDomainPdfBuffer(intern.domain);

    const attachments: any[] = [
      {
        filename: `Offer-Letter-${intern.employeeId}.pdf`,
        content: offerLetterPdfBuffer,
        contentType: 'application/pdf',
      },
    ];

    if (domainPdfBuffer) {
      attachments.push({
        filename: `${intern.domain
          .replace(/\s+/g, '-')
          .toLowerCase()}-program.pdf`,
        content: domainPdfBuffer,
        contentType: 'application/pdf',
      });
    }

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: intern.email,
      subject: `🎉 Internship Offer Letter + ${intern.domain} Program - ${intern.employeeId}`,
      text: simpleText,
      attachments,
    });

    console.log(
      `Offer letter${domainPdfBuffer ? ' + domain PDF' : ''} sent to ${
        intern.email
      }`,
    );
  }

  // Send Certificate
  async sendCertificate(intern: Intern): Promise<void> {
    const certificateHTML = this.generateCertificateHTML(intern);
    const simpleText = this.generateCertificateText(intern);

    const pdfBuffer = (await htmlPdf.generatePdf(
      { content: certificateHTML },
      { format: 'A4', printBackground: true },
    )) as unknown as Buffer;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: intern.email,
      subject: `🏆 Internship Completion Certificate - ${intern.employeeId}`,
      text: simpleText,
      attachments: [
        {
          filename: `Certificate-${intern.employeeId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    console.log(`Certificate sent to ${intern.email}`);
  }

  getOfferLetterPreview(intern: Intern): string {
    return this.generateOfferLetterHTML(intern);
  }

  getCertificatePreview(intern: Intern): string {
    return this.generateCertificateHTML(intern);
  }

private generateOfferLetterHTML(intern: Intern): string {
  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Internship Offer Letter</title>

<style>
  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: "Segoe UI", Arial, sans-serif;
    color: #1f2937;
    background: #ffffff;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 40px 40px 120px 40px; /* bottom extra space */
    position: relative;
  }

  /* SHAPES */
  .top-shape {
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 120px;
    background: linear-gradient(135deg, #0ea5e9, #0369a1);
    clip-path: polygon(40% 0, 100% 0, 100% 100%);
  }

  .bottom-shape {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 300px;
    height: 160px;
    background: linear-gradient(315deg, #0ea5e9, #0369a1);
    clip-path: polygon(0 0, 60% 100%, 0 100%);
  }

  /* HEADER */
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .header img {
    width: 260px;   /* BIG LOGO */
    height: auto;
    margin-bottom: 10px;
  }

  .company-name {
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 3px;
  }

  /* INTRO */
  .intro {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  /* META */
  .meta {
    font-size: 13px;
    margin-bottom: 28px;
    line-height: 1.6;
  }

  /* CONTENT */
  .content {
    font-size: 13.5px;
    line-height: 1.75;
    text-align: justify;
  }

  .content p {
    margin-bottom: 12px;
  }

  /* CLOSING */
  .closing {
    margin-top: 30px;
    font-size: 13.5px;
  }

  /* SIGNATURE */
  .signature-block {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .sign-left {
    text-align: left;
    font-size: 13px;
  }

  .sign-left img {
    width: 140px;
    height: auto;
    margin-bottom: 6px;
  }

  .sign-left div {
    font-weight: 600;
    font-size: 13px;
    text-align: center;
  }

  .right-side {
    text-align: right;
    display: flex;
    gap: 10px;
  }

  .stamp {
    text-align: center;
  }

  .stamp img {
    width: 120px;
    height: auto;
    margin-bottom: 4px;
  }

  .stamp div {
    font-size: 12px;
    font-weight: 600;
  }

  .msme-small img {
    width: 110px;
    height: auto;
  }

  /* FOOTER: sirf contact details niche centre/right me */
  .footer {
    position: absolute;
    bottom: 25px;
    left: 60px;
    right: 60px;
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    line-height: 1.5;
  }
</style>
</head>

<body>
  <div class="page">
    <div class="top-shape"></div>

    <!-- HEADER -->
    <div class="header">
      <img src="${this.logoBase64}" alt="SkillBuildEra Logo" />
    </div>

    <!-- INTRO -->
    <div class="intro">
      DEAR, ${intern.name.toUpperCase()}
    </div>

    <!-- META -->
    <div class="meta">
      <div><strong>Intern ID:</strong> ${intern.employeeId || "-"}</div>
      <div><strong>Date:</strong> ${formatDate(new Date())}</div>
    </div>

    <!-- CONTENT -->
    <div class="content">
      <p>Dear Candidate,</p>
      <p>
        We are pleased to offer you the position of <strong>${intern.domain} Intern</strong>
        at <strong>SkillBuildEra</strong>. This internship program provides structured learning,
        hands-on practical exposure, and real-world project experience.
      </p>
      <p>
        Your internship will commence on <strong>${formatDate(intern.startDate)}</strong>
        and conclude on <strong>${formatDate(intern.endDate)}</strong>, for a duration of
        one month.
      </p>
      <p>
          During your internship, you will be expected to maintain a high standard of professionalism,
          meet assigned deadlines, and actively seek feedback from your mentors so that you can
          continuously improve your technical and communication skills.
      </p>

      <p>
        This internship is offered strictly for educational purposes and does not constitute
        an employment offer. Successful completion does not guarantee future employment.
      </p>
      <p>
        We look forward to your active participation and wish you a successful internship
        journey with SkillBuildEra.
      </p>
    </div>

    <!-- CLOSING -->
    <div class="closing">
      Warm regards,<br />
      <strong>Team SkillBuildEra</strong>
    </div>

    <!-- SIGNATURE + STAMP + MSME (content ke turant baad) -->
    <div class="signature-block">
      <!-- LEFT: SIGN -->
      <div class="sign-left">
        <img src="${this.signBase64}" alt="HR Signature" />
        <div>( HR )<br/>SkillBuildEra</div>
      </div>

      <!-- RIGHT: STAMP + MSME niche right -->
      <div class="right-side">
        <div class="stamp">
          <img src="${this.stampBase64}" alt="Official Stamp" />
          <div>Official Stamp</div>
        </div>
        <div class="msme-small">
          <img src="${this.msmeBase64}" alt="MSME Logo" />
        </div>
      </div>
    </div>

    <div class="bottom-shape"></div>

    <!-- FOOTER: sirf contact info -->
    <div class="footer">
      <div class="footer-right">
        <div>📧 skillbuildera5@gmail.com</div>
        <div>📞 +91 8679089320</div>
        <div>🌐 www.skillbuildera.com</div>
      </div>
    </div>

  </div>
</body>
</html>
`;
}





private generateCertificateHTML(intern: Intern): string {
  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Internship Certificate</title>

<style>
  @page {
    size: A4;
    margin: 10mm; /* IMPORTANT: printer safe margin */
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #ffffff;
  }

  /* A4 container */
  .page {
    width: 100%;
    height: 100%;
    background: #ffffff;
  }

  /* Main border */
  .outer-border {
    height: 100%;
    padding: 8px;
    background: linear-gradient(135deg, #06b6d4, #0891b2, #0e7490);
  }

  .inner-border {
    height: 100%;
    padding: 14px;
    background: #ffffff;
  }

  .certificate {
    min-height: calc(297mm - 20mm - 16px); 
    height: 100%;
    border: 2.5px solid rgba(14,165,233,0.4);
    padding: 22px 28px;
    text-align: center;
    position: relative;
  }

  /* Corners */
  .corner {
    position: absolute;
    width: 40px;
    height: 40px;
    border-color: #0e7490;
  }
  .tl { top: 10px; left: 10px; border-top: 4px solid; border-left: 4px solid; }
  .tr { top: 10px; right: 10px; border-top: 4px solid; border-right: 4px solid; }
  .bl { bottom: 10px; left: 10px; border-bottom: 4px solid; border-left: 4px solid; }
  .br { bottom: 10px; right: 10px; border-bottom: 4px solid; border-right: 4px solid; }

  /* Header */
  .logo {
    width: 280px;
    height: 240px;
    margin: 0 auto 16px;
    
  }
  .logo img {
    width: 100%;
    height: 100%;
  }

  .company-name {
    font-size: 26px;
    font-weight: 700;
    color: #1f2937;
  }

  .tagline {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 18px;
  }

  /* Title */
  .title {
    font-family: Georgia, serif;
    font-size: 48px;
    font-style: italic;
    color: #0e7490;
  }

  .subtitle {
    font-size: 18px;
    color: #6b7280;
    margin-bottom: 18px;
  }

  .divider {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin: 18px 0;
  }

  .divider-line {
    width: 70px;
    height: 2px;
    background: linear-gradient(to right, transparent, #0e7490, transparent);
  }

  .diamond {
    width: 9px;
    height: 9px;
    background: #0e7490;
    transform: rotate(45deg);
  }

  /* Content */
  .certify {
    font-size: 15px;
    color: #6b7280;
  }

  .name {
    font-size: 40px;
    font-weight: 700;
    font-family: Georgia, serif;
    margin: 8px 0;
    color: #1f2937;
  }

  .empid {
    font-size: 13px;
    font-family: monospace;
    color: #0e7490;
    margin-bottom: 18px;
  }

  .description {
    max-width: 680px;
    margin: 0 auto 22px;
    margin-bottom : 64px;
    font-size: 15.5px;
    line-height: 1.6;
    color: #374151;
  }

  /* Duration */
  .duration-box {
    display: inline-flex;
    gap: 26px;
    padding: 12px 26px;
    border-radius: 10px;
    background: rgba(14,165,233,0.08);
    border: 2px solid rgba(14,116,144,0.35);
    margin-bottom: 26px;
  }

  .duration-item {
    text-align: center;
  }

  .label {
    font-size: 10px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #0e7490;
  }

  .value {
    font-size: 14px;
    font-weight: 700;
    color: #1f2937;
  }

  /* Signatures */
  .signatures {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 28px;
    padding: 0 40px;
  }

  .sign {
    text-align: center;
    width: 30%;
  }

  .sign-line {
    width: 140px;
    border-bottom: 2px solid rgba(31,41,55,0.4);
    margin: 0 auto 6px;
  }

  .sign-name {
    font-size: 13px;
    font-weight: 700;
  }

  .sign-title {
    font-size: 11px;
    color: #6b7280;
  }

  /* Seal – NO BORDER */
  .seal {
    width: 200px;
    height: 180px;
    margin: 0 auto;
    background: transparent;
  }

  .seal img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  /* Footer */
  .issued {
    margin-top: 18px;
    font-size: 12px;
    color: #6b7280;
  }

  .verify {
    margin-top: 12px;
    font-size: 10px;
    color: #6b7280;
  }

  .sign-img {
    width: 120px;
    height: auto;
    margin: 0 auto 6px;
    display: block;
  }

</style>
</head>

<body>
<div class="page">
  <div class="outer-border">
    <div class="inner-border">
      <div class="certificate">

        <div class="corner tl"></div>
        <div class="corner tr"></div>
        <div class="corner bl"></div>
        <div class="corner br"></div>

        <div class="logo">
          <img src="${this.logoBase64}" />
        </div>

        <div class="company-name">SkillBuild Era</div>
        <div class="tagline">Empowering Future Tech Leaders</div>

        <div class="title">Certificate</div>
        <div class="subtitle">of Completion</div>

        <div class="divider">
          <div class="divider-line"></div>
          <div class="diamond"></div>
          <div class="divider-line"></div>
        </div>

        <div class="certify">This is to certify that</div>
        <div class="name">${intern.name}</div>
        <div class="empid">Employee ID: ${intern.employeeId}</div>

        <div class="description">
          has successfully completed the <strong>${intern.domain}</strong> Internship Program at
          SkillBuild Era from <strong>${formatDate(intern.startDate)}</strong> to
          <strong>${formatDate(intern.endDate)}</strong>, demonstrating dedication,
          professionalism, and technical competence.
        </div>

        <div class="duration-box">
          <div class="duration-item">
            <div class="label">Start</div>
            <div class="value">${formatDate(intern.startDate)}</div>
          </div>
          <div class="duration-item">
            <div class="label">End</div>
            <div class="value">${formatDate(intern.endDate)}</div>
          </div>
          <div class="duration-item">
            <div class="label">Duration</div>
            <div class="value">4 Weeks</div>
          </div>
        </div>

        <div class="signatures">
          <div class="seal">
            <img src="${this.stampBase64}" />
          </div>

          <div class="sign">
            <img src="${this.signBase64}" alt="HR Signature" class="sign-img" />
            <div class="sign-name">HR Manager</div>
            <div class="sign-title">SkillBuild Era</div>
          </div>
        </div>

        <div class="issued">
            Issued on: ${formatDate(new Date())}
        </div>

        <div class="verify">
         Verify at www.skillbuildera.com/verify/${intern.employeeId}
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>
`;
}




  // Generate simple text version of Offer Letter
  private generateOfferLetterText(intern: Intern): string {
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    };

    return `
Dear ${intern.name},

We are pleased to inform you that you have been selected for the ${intern.domain} Internship Program at SkillBuild Era. Congratulations on your selection.

This internship is designed to provide practical learning, real-world exposure, and an opportunity to enhance your skills through industry-relevant tasks and projects.

Your official Offer Letter (PDF) is attached with this email.

Internship Tasks (Mandatory):
A minimum of four tasks must be completed to be eligible for the internship certificate. The Task PDF is attached for your reference.

Important Guidelines:

Update your LinkedIn profile and share your Offer Letter

Create a LinkedIn post after completing each task

Tag skillbuildera and use #SkillBuildEra and #skillbuildera

Upload all completed tasks on GitHub

Certificates will be issued only after successful task completion and evaluation

Task submission form will be shared after the internship begins. Certificates will be released after evaluation of all submissions.

If you have any questions or need assistance, please feel free to contact us.

We wish you a productive and successful internship experience with SkillBuild Era.

📢 Official Telegram Channel
To receive all important updates, announcements, and internship-related information, please join our official Telegram channel using the link below:
👉 https://t.me/+wcN23oHH2xQ0YmFl
Stay connected for updates

Best regards,
HR Team
SkillBuild Era

Email: contact@skillbuildera.com
Contact: +91 8679089320
Website: www.skillbuildera.com
    `;
  }

  // Generate simple text version of Certificate
  private generateCertificateText(intern: Intern): string {
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    };

    return `
Dear ${intern.name},

Congratulations on successfully completing your internship with SkillBuild Era!This is to certify that ${intern.name} has successfully completed their internship at SkillBuild Era.

CERTIFICATE DETAILS:
• Employee ID: ${intern.employeeId}
• Domain: ${intern.domain}
• Duration: ${formatDate(intern.startDate)} to ${formatDate(intern.endDate)}
• Phase: ${intern.phase}

Issued on: ${formatDate(new Date())}

Best wishes for your future endeavors!

Sincerely,
HR Team
SkillBuild Era

Email: contact@skillbuildera.com
Contact: +91 8679089320
Website: www.skillbuildera.com

Note: Please find the detailed certificate attached to this email.
    `;
  }
}

export default new EmailService();