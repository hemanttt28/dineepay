"use client";

import { Check } from "lucide-react";

const plans = [
    {
        name: "Starter",
        price: "Free",
        fee: "1% transaction fee",
        features: ["0 Setup Fee", "Basic Dashboard", "Email Support"],
    },
    {
        name: "Growth",
        price: "₹999/mo",
        fee: "0.5% transaction fee",
        features: ["Priority Support", "Advanced Analytics", "Custom QR Design"],
        highlight: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        fee: "Custom pricing",
        features: ["Dedicated Account Manager", "API Access", "White Labeling"],
    },
];

export default function RevenueSection() {
    return (
        <section className="py-24 bg-[#1a0f0a]">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Simple, Transparent <span className="text-[#ff6b00]">Pricing</span>
                    </h2>
                    <p className="text-gray-400">Choose the plan that fits your canteen.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`p-8 rounded-3xl border flex flex-col ${plan.highlight
                                ? "bg-[#2C1810] border-[#ff6b00] scale-105 shadow-[0_0_40px_-10px_rgba(255,107,0,0.3)] z-10"
                                : "bg-white/5 border-white/10 hover:border-white/20"
                                }`}
                        >
                            {plan.highlight && (
                                <div className="bg-[#ff6b00] text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-4 self-center">
                                    MOST POPULAR
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="text-4xl font-black text-white mb-1">{plan.price}</div>
                            <p className="text-sm text-gray-400 mb-6">{plan.fee}</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <Check className="w-5 h-5 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.highlight
                                    ? "bg-[#ff6b00] hover:bg-[#ff8c42] text-white shadow-lg"
                                    : "bg-white/10 hover:bg-white/20 text-white"
                                    }`}
                            >
                                Choose {plan.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
