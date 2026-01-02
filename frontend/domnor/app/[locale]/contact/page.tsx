import { Mail, Send } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen w-full  text-foreground/90 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Get in Touch
          </h1>
          <p className="text-lg  max-w-lg mx-auto">
            Have a question, a project in mind, or just want to say hello?
            I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Email Card */}
          <Link
            href="mailto:sarindararith@gmail.com"
            className="group p-8 rounded-3xl bg-secondary/10 border border-secondary/20 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Email</h3>
            <p className=" text-sm mb-4">Drop me a line anytime.</p>
            <div className="text-sm font-medium text-foreground group-hover:text-blue-400 transition-colors">
              sarindararith5540@gmail.com
            </div>
          </Link>

          {/* Telegram Card */}
          <Link
            href="https://t.me/drarith"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 rounded-3xl bg-secondary/10 border border-secondary/20 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6 text-sky-400 group-hover:scale-110 transition-transform">
              <Send size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Telegram</h3>
            <p className=" text-sm mb-4">Chat with me directly.</p>
            <div className="text-sm font-medium text-foreground group-hover:text-sky-400 transition-colors">
              @drarith
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
