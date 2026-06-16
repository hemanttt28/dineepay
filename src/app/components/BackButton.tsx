"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({ href = "back" }: { href?: string }) {
    const router = useRouter();

    const handleBack = () => {
        if (href === "back") {
            router.back();
        } else {
            router.push(href);
        }
    };

    return (
        <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#ff6b00] transition-colors font-medium mb-6 group"
        >
            <div className="p-2 rounded-full bg-gray-100 group-hover:bg-orange-50 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </div>
            Back
        </button>
    );
}
