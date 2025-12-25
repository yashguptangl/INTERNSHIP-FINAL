import { useEffect } from 'react';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last Updated: December 24, 2025</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              Welcome to Skillbuild Era ("we," "us," "our," or "Company"). These Terms of Service ("Terms") govern your use of our website, mobile applications, and services (collectively, the "Platform"). By accessing, browsing, or using our Platform, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our Platform.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
            <p>
              You represent and warrant that:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>You are at least 18 years of age or have parental/guardian consent</li>
              <li>You have the legal authority to enter into binding agreements</li>
              <li>You are not a minor in your jurisdiction of residence</li>
              <li>You are not prohibited from using the Platform under applicable laws</li>
              <li>All information provided during registration is accurate and truthful</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and password. You agree to:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Provide accurate and complete information during registration</li>
              <li>Update your information promptly if changes occur</li>
              <li>Immediately notify us of any unauthorized account access</li>
              <li>Not share your credentials with third parties</li>
              <li>Accept full responsibility for all activities under your account</li>
            </ul>
            <p className="mt-4">
              We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
            </p>
          </section>

          {/* Internship Program Rules */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Internship Program Rules</h2>
            <p>
              By applying for or participating in our internship programs, you agree to:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Provide genuine and complete information in your application</li>
              <li>Maintain professional conduct throughout the internship period</li>
              <li>Comply with all company policies and guidelines</li>
              <li>Not engage in plagiarism, cheating, or dishonest practices</li>
              <li>Respect intellectual property rights of the company</li>
              <li>Maintain confidentiality of sensitive company information</li>
              <li>Attend all scheduled training sessions and meetings</li>
            </ul>
          </section>

          {/* Intellectual Property Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property Rights</h2>
            <p>
              All content on the Platform, including but not limited to text, graphics, logos, images, videos, and software, is the property of Internship Ignite Hub or its licensors and is protected by international copyright and intellectual property laws.
            </p>
            <p className="mt-4">
              You may not:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Reproduce, distribute, or transmit any content without permission</li>
              <li>Create derivative works based on our content</li>
              <li>Remove any copyright or proprietary notices</li>
              <li>Use our content for commercial purposes without authorization</li>
            </ul>
            <p className="mt-4">
              Any work products, projects, or materials created during the internship become the intellectual property of Internship Ignite Hub.
            </p>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Conduct</h2>
            <p>
              You agree not to use the Platform to:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Violate any laws, regulations, or third-party rights</li>
              <li>Harass, abuse, or threaten other users or staff</li>
              <li>Post offensive, defamatory, or discriminatory content</li>
              <li>Engage in phishing, hacking, or unauthorized access</li>
              <li>Upload malware, viruses, or malicious code</li>
              <li>Impersonate or misrepresent your identity</li>
              <li>Spam or send unsolicited communications</li>
              <li>Interfere with the Platform's functionality or security</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, INTERNSHIP IGNITE HUB SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Any indirect, incidental, special, or consequential damages</li>
              <li>Loss of profit, revenue, data, or business opportunities</li>
              <li>Damage to your computer, device, or network</li>
              <li>Third-party claims or actions arising from your use of the Platform</li>
              <li>Service interruptions, delays, or unavailability</li>
            </ul>
            <p className="mt-4">
              Our total liability shall not exceed the amount you paid for the services in the past 12 months.
            </p>
          </section>

          {/* Warranty Disclaimer */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Warranty Disclaimer</h2>
            <p>
              THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES INCLUDING:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Merchantability and fitness for a particular purpose</li>
              <li>Accuracy, completeness, or reliability of content</li>
              <li>Uninterrupted or error-free access</li>
              <li>Freedom from viruses or malicious code</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Platform immediately, without notice or liability, if you:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Violate these Terms of Service</li>
              <li>Engage in illegal or fraudulent activity</li>
              <li>Violate intellectual property rights</li>
              <li>Harass or abuse other users</li>
              <li>Damage or disrupt the Platform's integrity</li>
            </ul>
            <p className="mt-4">
              Upon termination, your right to use the Platform ceases immediately, and we may delete your account and associated data.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Internship Ignite Hub and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Your violation of these Terms</li>
              <li>Your misuse of the Platform</li>
              <li>Your violation of applicable laws</li>
              <li>Your infringement of third-party rights</li>
              <li>Content you provide or transmit</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of India, without regard to its conflict of laws principles. You irrevocably submit to the exclusive jurisdiction of the courts located in India.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Platform. Your continued use of the Platform following such modifications constitutes your acceptance of the updated Terms. We will notify you of significant changes via email or a prominent notice on the Platform.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <p>
              If you have any questions or concerns regarding these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p><strong>Skillbuild Era</strong></p>
              <p>Email: contact@skillbuildera.com</p>
              <p>Website: www.skillbuildera.com</p>
              <p>Address: Dehradun , Uttarakhand , India</p>
            </div>
          </section>

          {/* Entire Agreement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Entire Agreement</h2>
            <p>
              These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and Internship Ignite Hub regarding your use of the Platform and supersede all prior agreements and understandings.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            © 2025 Internship Ignite Hub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
