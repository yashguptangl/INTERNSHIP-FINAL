import { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: December 24, 2025</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              Skillbuild Era ("Company," "we," "us," "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile applications, and services (collectively, the "Platform").
            </p>
            <p className="mt-4">
              Please read this Privacy Policy carefully. If you do not agree with our practices, please do not use our Platform. Your use of the Platform signifies your acceptance of this Privacy Policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">A. Information You Provide Directly</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Registration Information:</strong> Name, email address, phone number, date of birth, address, educational background</li>
              <li><strong>Application Information:</strong> Resume, cover letter, educational qualifications, work experience, skills assessment responses</li>
              <li><strong>Account Information:</strong> Username, password, profile picture, bio, preferences</li>
              <li><strong>Communication Data:</strong> Messages, feedback, inquiries, support requests</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">B. Information Collected Automatically</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, interactions with features</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Location Data:</strong> General geographic location (city/region level)</li>
              <li><strong>Cookies and Tracking:</strong> Session cookies, persistent cookies, web beacons, pixel tags</li>
              <li><strong>Log Data:</strong> Server logs containing access times, referrer URLs, error messages</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">C. Third-Party Information</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Information from educational institutions or employers for verification</li>
              <li>Data from social media platforms if you link your accounts</li>
              <li>Publicly available information for background verification</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p>
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Account creation, management, and authentication</li>
              <li>Processing internship applications and enrollment</li>
              <li>Delivering training content and educational materials</li>
              <li>Evaluating your performance and providing feedback</li>
              <li>Issuing certificates and official documents</li>
              <li>Sending notifications about program updates and deadlines</li>
              <li>Responding to your inquiries and providing customer support</li>
              <li>Conducting surveys and gathering feedback</li>
              <li>Improving our Platform's functionality and user experience</li>
              <li>Detecting, preventing, and addressing fraud and security issues</li>
              <li>Complying with legal obligations and enforcement of agreements</li>
              <li>Marketing and promotional communications (with your consent)</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Share Your Information</h2>
            <p>
              We do not sell your personal information. However, we may share your information in the following circumstances:
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">A. With Service Providers</h3>
            <p>
              Third parties who assist us in operating the Platform, including cloud hosting providers, email service providers, payment processors, and analytics platforms. These providers are contractually obligated to use your information only as necessary.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">B. For Legal Compliance</h3>
            <p>
              When required by law, court order, or government request. We will provide notice when legally permissible.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">C. Business Transfers</h3>
            <p>
              If we merge with, are acquired by, or sell substantially all assets to another company, your information will be transferred as part of that transaction.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">D. With Your Consent</h3>
            <p>
              We may share your information with third parties if you explicitly consent to such sharing.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">E. Aggregated Data</h3>
            <p>
              We may share anonymized, aggregated data that cannot identify you personally for research, marketing, and analytics purposes.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p>
              We implement comprehensive security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Industry-standard encryption (SSL/TLS) for data transmission</li>
              <li>Secure password hashing and storage protocols</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and role-based permissions</li>
              <li>Firewalls and intrusion detection systems</li>
              <li>Data backup and disaster recovery procedures</li>
              <li>Restricted access to personal information</li>
              <li>Employee confidentiality agreements</li>
            </ul>
            <p className="mt-4">
              While we strive to protect your information, no security system is completely impenetrable. We cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Maintain your account and provide services</li>
              <li>Fulfill the purposes for which data was collected</li>
              <li>Comply with legal and regulatory obligations</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p className="mt-4">
              When information is no longer needed, we securely delete or anonymize it. You may request deletion of your account and associated data at any time, subject to legal retention requirements.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>
            <p>
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your information</li>
              <li><strong>Portability:</strong> Obtain your information in a structured format</li>
              <li><strong>Objection:</strong> Object to processing of your information</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at privacy@ignite-hub.com. We will respond within 30 days.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Maintain user sessions and remember preferences</li>
              <li>Analyze Platform usage and performance</li>
              <li>Personalize your experience</li>
              <li>Detect and prevent fraud</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings. Disabling cookies may limit Platform functionality.
            </p>
            <p className="mt-4">
              <strong>Types of Cookies:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Essential:</strong> Required for basic functionality</li>
              <li><strong>Performance:</strong> Analyze usage patterns</li>
              <li><strong>Functional:</strong> Remember user preferences</li>
              <li><strong>Marketing:</strong> Track advertising performance (with consent)</li>
            </ul>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Links and Services</h2>
            <p>
              Our Platform may contain links to third-party websites and services. We are not responsible for their privacy practices. We recommend reviewing their privacy policies before providing your information. This Privacy Policy applies only to our Platform.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p>
              Our Platform is not intended for individuals under 18 years of age. We do not knowingly collect information from minors without parental/guardian consent. If we discover we have collected information from a minor without proper consent, we will delete it immediately. Parents or guardians suspecting unauthorized data collection should contact us.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. International Data Transfers</h2>
            <p>
              Your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have different data protection laws. By using our Platform, you consent to such transfers. We implement safeguards to ensure appropriate protection.
            </p>
          </section>

          {/* California Privacy Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. California Privacy Rights (CCPA)</h2>
            <p>
              If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Right to know what personal information is collected</li>
              <li>Right to know whether personal information is sold or disclosed</li>
              <li>Right to delete personal information collected</li>
              <li>Right to opt-out of the sale or sharing of personal information</li>
              <li>Right to non-discrimination for exercising CCPA rights</li>
            </ul>
            <p className="mt-4">
              Submit requests to privacy@ignite-hub.com with the subject "CCPA Request."
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy to reflect changes in our practices, technology, legal requirements, or other factors. The updated version will be effective immediately upon posting. Your continued use of the Platform constitutes acceptance of the updated policy. For significant changes, we will provide notice via email or prominent platform notification.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
              <p><strong>Skillbuild Era</strong></p>
              <p>Email: contact@skillbuildera.com</p>
              <p>Website: www.skillbuildera.com</p>
              <p>Address: Dehradun , Uttarakhand , India</p>
            </div>
          </section>

          {/* Data Protection Authority */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Data Protection Authority</h2>
            <p>
              If you believe we have violated your privacy rights, you have the right to lodge a complaint with your local data protection authority. We encourage you to contact us first to resolve any concerns.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            © 2025 Skillbuild Era. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
