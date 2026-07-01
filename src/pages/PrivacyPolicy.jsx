import { Shield, Lock, Database, Globe, Mail, Calendar } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,.10),transparent_35%)]" />

      <div className="mx-auto max-w-5xl px-6 py-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2">
            <Shield size={18} className="text-violet-400" />
            <span className="text-sm font-medium text-violet-300">
              Privacy Policy
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-black">
            AIAERA Privacy Policy
          </h1>

          <p className="mt-4 text-lg text-white/60">
            Your privacy is important to us. This policy explains how AIAERA
            collects, uses, stores, and protects your information.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
            <Calendar size={16} />
            Last Updated: July 1, 2026
          </div>
        </div>

        <div className="space-y-8">
          {/* Company */}
          <Section
            icon={<Globe size={20} />}
            title="About AIAERA"
          >
            AIAERA is an AI-powered business automation platform that helps
            businesses deploy intelligent AI assistants, automate customer
            conversations, collect leads, answer questions, and schedule
            appointments across websites and messaging platforms.
          </Section>

          {/* Data */}
          <Section
            icon={<Database size={20} />}
            title="Information We Collect"
          >
            We may collect:
            <ul className="mt-4 list-disc space-y-2 pl-6 text-white/70">
              <li>Name and email address.</li>
              <li>Business information you provide.</li>
              <li>Website URLs and uploaded documents.</li>
              <li>Chat conversations with AI assistants.</li>
              <li>Lead information submitted by visitors.</li>
              <li>Appointment booking information.</li>
              <li>Usage analytics to improve our services.</li>
            </ul>
          </Section>

          {/* Usage */}
          <Section
            icon={<Shield size={20} />}
            title="How We Use Your Information"
          >
            We use your information to provide AI chatbot services, improve AI
            responses, manage customer conversations, process appointments,
            enhance platform security, provide customer support, and improve the
            overall user experience.
          </Section>

          {/* AI */}
          <Section
            icon={<Database size={20} />}
            title="AI Processing"
          >
            Messages sent to your AI assistant may be securely processed using
            trusted AI providers to generate intelligent responses. Only the
            information necessary to provide the service is processed.
          </Section>

          {/* Security */}
          <Section
            icon={<Lock size={20} />}
            title="Data Security"
          >
            We implement industry-standard security practices to protect your
            information from unauthorized access, disclosure, alteration, or
            destruction. While no system can guarantee absolute security, we
            continuously improve our security measures.
          </Section>

          {/* Third Party */}
          <Section
            icon={<Globe size={20} />}
            title="Third-Party Services"
          >
            AIAERA may integrate with trusted third-party services including
            Meta (WhatsApp, Facebook, Instagram), Supabase, payment providers,
            and AI providers to deliver platform functionality.
          </Section>

          {/* Cookies */}
          <Section
            icon={<Shield size={20} />}
            title="Cookies"
          >
            We may use cookies and similar technologies to improve performance,
            remember preferences, maintain secure sessions, and analyze website
            usage.
          </Section>

          {/* Rights */}
          <Section
            icon={<Database size={20} />}
            title="Your Rights"
          >
            You may request access to your personal information, update your
            account details, or request deletion of your account and associated
            data where applicable.
          </Section>

          {/* Contact */}
          <Section
            icon={<Mail size={20} />}
            title="Contact Us"
          >
            If you have any questions regarding this Privacy Policy, please
            contact us at:
            <div className="mt-4 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
              <p>
                <strong>Email:</strong> support@aiaera.com
              </p>
              <p className="mt-2">
                <strong>Website:</strong> https://www.aiaera.in
              </p>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          © {new Date().getFullYear()} AIAERA. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400">
          {icon}
        </div>

        <h2 className="text-2xl font-bold">
          {title}
        </h2>
      </div>

      <div className="leading-8 text-white/70">
        {children}
      </div>
    </div>
  );
}