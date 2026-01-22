"use client";
import { Tag } from "@/types/events";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SettingsSectionProps {
    status: "Published" | "Draft" | "Cancelled";
    setStatus: (value: "Published" | "Draft" | "Cancelled") => void;
    isFeatured: boolean;
    setIsFeatured: (value: boolean) => void;
    isPopular: boolean;
    setIsPopular: (value: boolean) => void;
    tags: Tag[];
    selectedTags: number[];
    handleTagToggle: (tagId: number) => void;
}

export default function SettingsSection({
    status,
    setStatus,
    isFeatured,
    setIsFeatured,
    isPopular,
    setIsPopular,
    tags,
    selectedTags,
    handleTagToggle,
}: SettingsSectionProps) {
    return (
        <div className="space-y-6">
            {/* Status */}
            <div>
                <label
                    htmlFor="status"
                    className="block text-sm font-medium text-slate-700"
                >
                    Status
                </label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value as "Published" | "Draft" | "Cancelled")
                    }
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {/* Flags */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                    <input
                        id="is_featured"
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <label
                        htmlFor="is_featured"
                        className="text-sm font-medium text-slate-700"
                    >
                        Featured event
                    </label>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        id="is_popular"
                        type="checkbox"
                        checked={isPopular}
                        onChange={(e) => setIsPopular(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <label
                        htmlFor="is_popular"
                        className="text-sm font-medium text-slate-700"
                    >
                        Popular event
                    </label>
                </div>
            </div>

            {/* Tags */}
            <div>
                <Label className="block text-sm font-medium text-slate-700 mb-2">
                    Tags
                </Label>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                        const isSelected = selectedTags.includes(tag.id);
                        return (
                            <Badge
                                key={tag.id}
                                variant={isSelected ? "default" : "outline"}
                                className={`cursor-pointer ${isSelected
                                        ? "bg-sky-600 hover:bg-sky-700"
                                        : "hover:bg-slate-100"
                                    }`}
                                onClick={() => handleTagToggle(tag.id)}
                            >
                                {tag.name}
                            </Badge>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
