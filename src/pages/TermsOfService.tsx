"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-36 pb-20">
      <article className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-5xl md:text-6xl font-medium text-foreground mb-4 leading-tight">Terms of Service</h1>
        <p className="text-muted-foreground mb-12 text-sm font-mono uppercase tracking-wider">Effective date: March 1, 2025</p>

        {[
          {
            title: "1. Acceptance of Terms",
            content: `By accessing or using the Nexus platform, attending Craft Summit events, or registering for any Nexus services, you agree to be bound by these Terms of Service. If you are using Nexus on behalf of an organization, you represent that you have authority to bind that organization to these terms.`
          },
          {
            title: "2. Description of Services",
            content: `Nexus provides a cloud platform for building, deploying, and scaling web applications. Our services include frontend hosting, serverless functions, edge computing, AI integrations, database management, and developer collaboration tools. Service availability and feature sets may vary by plan tier.`
          },
          {
            title: "3. User Accounts",
            content: `You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials and for all activities under your account. Notify us immediately at security@craftsummit.dev if you suspect unauthorized access. We reserve the right to suspend accounts that violate these terms.`
          },
          {
            title: "4. Acceptable Use",
            content: `You agree not to use Nexus services for any unlawful purpose, to distribute malware or conduct phishing attacks, to mine cryptocurrency, to host content that infringes intellectual property rights, or to interfere with the platform's operation. We reserve the right to remove content or suspend accounts that violate this policy without prior notice.`
          },
          {
            title: "5. Payment & Billing",
            content: `Paid plans are billed monthly or annually in advance. Usage-based charges (bandwidth, serverless invocations, storage) are billed in arrears. All fees are non-refundable except as required by law. We may change pricing with 30 days' notice. Overdue payments may result in service suspension after a 14-day grace period.`
          },
          {
            title: "6. Intellectual Property",
            content: `You retain all rights to the content and applications you deploy on Nexus. We retain all rights to the Nexus platform, branding, documentation, and tools. You grant us a limited license to host, cache, and serve your content as necessary to provide our services. Open-source components are governed by their respective licenses.`
          },
          {
            title: "7. Service Level Agreement",
            content: `Nexus commits to 99.99% uptime for Pro and Enterprise plans. If we fail to meet this target in any calendar month, affected customers are eligible for service credits. Credits are calculated as a percentage of that month's fees proportional to the downtime experienced. Scheduled maintenance windows are excluded from SLA calculations.`
          },
          {
            title: "8. Limitation of Liability",
            content: `To the maximum extent permitted by law, Nexus shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability for any claim arising from these terms shall not exceed the amount you paid us in the 12 months preceding the claim. This limitation applies regardless of the theory of liability.`
          },
          {
            title: "9. Termination",
            content: `Either party may terminate this agreement at any time. Upon termination, your right to use the services ceases immediately. We will retain your data for 30 days post-termination to allow for export. After 30 days, all data will be permanently deleted from our systems and backups.`
          },
          {
            title: "10. Governing Law",
            content: `These terms are governed by the laws of the State of California, United States, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration in San Francisco, CA under the rules of the American Arbitration Association. Each party bears its own attorney's fees.`
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

export default TermsOfService;
