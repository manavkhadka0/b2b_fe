"use client";
import Tiptap from "@/components/ui/tip-tap";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BasicInfoSectionProps {
    title: string;
    setTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    errors?: Record<string, string[]>;
}

export default function BasicInfoSection({
    title,
    setTitle,
    description,
    setDescription,
    errors,
}: BasicInfoSectionProps) {
    return (
        <div className="space-y-6">
            <div>
                <Label htmlFor="title" className="block text-sm font-medium text-slate-700">
                    Event title
                </Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                    required
                    className="mt-1"
                />
                {errors?.title && (
                    <p className="mt-1 text-xs text-rose-600">{errors.title.join(", ")}</p>
                )}
            </div>

            <div>
                <Label className="block text-sm font-medium text-slate-700 mb-2">
                    Event description
                </Label>
                <Tiptap
                    value={description}
                    onChange={setDescription}
                    placeholder="Enter event description..."
                    toolbar="noImage"
                    minHeight="350px"
                    className="border border-slate-200"
                />
                {errors?.description && (
                    <p className="mt-1 text-xs text-rose-600">{errors.description.join(", ")}</p>
                )}
            </div>
        </div>
    );
}
