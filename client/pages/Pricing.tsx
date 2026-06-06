import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "@/lib/router-compat";

export default function Pricing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-transparent text-foreground">

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1280px] mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold">Pricing Plans</h1>
            <p className="text-lg text-[#C7C4D8] max-w-2xl mx-auto">
              Choose the perfect plan for your QR code generation needs. All plans include enterprise-grade security and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                name: "Starter",
                price: "Free",
                desc: "Perfect for getting started",
                features: ["Up to 100 QR codes/month", "Basic customization", "Standard support"],
              },
              {
                name: "Professional",
                price: "$99",
                desc: "Best for growing businesses",
                features: ["Up to 1,000 QR codes/month", "Advanced customization", "Priority support", "Analytics dashboard"],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                desc: "For large-scale operations",
                features: ["Unlimited QR codes", "Full customization", "Dedicated support", "Advanced analytics", "API access"],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-8 rounded-[24px] transition-all ${
                  plan.highlighted
                    ? "glass-card-dark border-2 border-[#4F46E5] bg-gradient-card scale-105"
                    : "glass-card-dark"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-[#C7C4D8] mb-6">{plan.desc}</p>
                <div className="text-4xl font-bold mb-8">
                  {plan.price}
                  {plan.price !== "Custom" && <span className="text-lg text-[#C7C4D8]">/mo</span>}
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="text-[#C7C4D8] flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.78 3.22a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06L5.5 9.44l6.97-6.97a.75.75 0 011.06 0z" fill="#4CD7F6"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-[12px] font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-gradient-indigo-cyan text-white hover:opacity-90"
                      : "border border-[#464555] text-[#DAE2FD] hover:bg-[rgba(23,31,51,0.60)]"
                  }`}
                  onClick={()=>navigate('/tools')}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>

          <div className="mt-16 space-y-4">
            <h2 className="text-2xl font-bold">Need a custom plan?</h2>
            <p className="text-[#C7C4D8]">Contact our sales team for enterprise solutions tailored to your needs.</p>
            <button className="px-8 py-3 rounded-[12px] bg-[#4F46E5] text-white font-semibold hover:bg-indigo-600 transition-colors"
            
            onClick={()=>navigate('/contact-us')}
            >
              Contact Sales
            </button>
          </div>
        </div>
      </main>

    </div>
  );
}
