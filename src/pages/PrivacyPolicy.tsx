"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-36 pb-20">
      <article className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-5xl md:text-6xl font-medium text-foreground mb-4 leading-tight">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12 text-sm font-mono uppercase tracking-wider">Last updated: March 1, 2025</p>

        {[
          {
            title: "1. Information We Collect",
            content: `We collect information you provide directly, such as your name, email address, company name, and job title when you register for Craft Summit events, create an account, or contact our sales team. We also collect usage data automatically, including IP addresses, browser type, device information, pages visited, and interaction patterns with our platform and event content.`
          },
          {
            title: "2. How We Use Your Information",
            content: `Your information is used to provide and improve our services, process event registrations, send relevant communications about Nexus products and upcoming events, personalize your experience, ensure platform security, and comply with legal obligations. We analyze aggregated usage data to improve our infrastructure and developer tools.`
          },
          {
            title: "3. Information Sharing",
            content: `We do not sell your personal information. We may share data with trusted service providers who assist in operating our platform (hosting, analytics, email delivery), event sponsors who you've explicitly opted in to hear from, and law enforcement when required by applicable law. All third-party providers are contractually bound to protect your data.`
          },
          {
            title: "4. Data Retention",
            content: `We retain your personal information for as long as your account is active or as needed to provide services. Event registration data is retained for 3 years after the event for historical reporting. You may request deletion of your data at any time by contacting privacy@craftsummit.dev.`
          },
          {
            title: "5. Your Rights",
            content: `Depending on your jurisdiction, you may have the right to access, correct, delete, or port your personal data. You can also object to or restrict certain processing activities. EU/EEA residents have rights under GDPR, and California residents have rights under CCPA. To exercise any of these rights, email privacy@craftsummit.dev.`
          },
          {
            title: "6. Cookies & Tracking",
            content: `We use essential cookies for platform functionality, analytics cookies to understand usage patterns, and marketing cookies for relevant advertising (only with your consent). You can manage cookie preferences through your browser settings or our cookie consent banner. We use Nexus Analytics, a privacy-focused analytics solution that does not use third-party cookies.`
          },
          {
            title: "7. Security",
            content: `We implement industry-standard security measures including encryption in transit (TLS 1.3) and at rest (AES-256), regular security audits, SOC 2 Type II certification, and a responsible disclosure program. Our infrastructure runs on globally distributed edge networks with automatic threat detection and DDoS protection.`
          },
          {
            title: "8. Contact Us",
            content: `For questions about this privacy policy or our data practices, contact our Data Protection Officer at privacy@craftsummit.dev or write to: Craft Summit, 440 Market Street, Suite 500, San Francisco, CA 94105, United States.`
          },
        ].map((section) => (
          <div key={section.title} className="mb-10">
            <h2 className="text-2xl font-medium text-foreground mb-4">{section.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{section.content}</p>
          </div>
        ))}
      </article>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
