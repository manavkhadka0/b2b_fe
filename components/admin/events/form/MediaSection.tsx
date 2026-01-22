"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Event, EventImage } from "@/types/events";

interface MediaSectionProps {
    mode: "create" | "edit";
    initialData?: Partial<Event> | null;
    thumbnailFile: File | null;
    handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    eventFile: File | null;
    handleEventFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    eventImages: EventImage[];
    isImagesDialogOpen: boolean;
    setIsImagesDialogOpen: (value: boolean) => void;
    newImages: File[];
    setNewImages: (files: File[]) => void;
    imagesLoading: boolean;
    imagesError: string | null;
    setImagesError: (value: string | null) => void;
    deletingImageId: number | null;
    handleDeleteImage: (id: number) => void;
    handleAddImages: () => void;
}

export default function MediaSection({
    mode,
    initialData,
    thumbnailFile,
    handleThumbnailChange,
    eventFile,
    handleEventFileChange,
    eventImages,
    isImagesDialogOpen,
    setIsImagesDialogOpen,
    newImages,
    setNewImages,
    imagesLoading,
    imagesError,
    setImagesError,
    deletingImageId,
    handleDeleteImage,
    handleAddImages,
}: MediaSectionProps) {
    return (
        <div className="space-y-6">
            {/* File Uploads */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="thumbnail"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Thumbnail
                    </label>
                    <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="mt-1 block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                    />
                    {initialData?.thumbnail && !thumbnailFile && (
                        <p className="mt-1 text-xs text-slate-500">
                            Current thumbnail:{" "}
                            <span className="underline">existing file</span>
                        </p>
                    )}
                </div>
                <div>
                    <label
                        htmlFor="event_file"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Event File
                    </label>
                    <input
                        id="event_file"
                        type="file"
                        onChange={handleEventFileChange}
                        className="mt-1 block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                    />
                    {initialData?.event_file && !eventFile && (
                        <p className="mt-1 text-xs text-slate-500">
                            Current file: <span className="underline">existing file</span>
                        </p>
                    )}
                </div>
            </div>

            {mode === "edit" && initialData?.id && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-slate-700">
                            Event images
                        </Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setIsImagesDialogOpen(true);
                                setNewImages([]);
                                setImagesError(null);
                            }}
                        >
                            Add images
                        </Button>
                    </div>

                    {eventImages.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {eventImages.map((img) => (
                                <div
                                    key={img.id}
                                    className="relative overflow-hidden rounded-md border bg-slate-50"
                                >
                                    <img
                                        src={img.image}
                                        alt="Event image"
                                        className="h-28 w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(img.id)}
                                        disabled={deletingImageId === img.id}
                                        className="absolute right-1 top-1 rounded-full bg-white/90 px-1.5 py-0.5 text-xs font-semibold text-rose-600 shadow-sm hover:bg-white"
                                    >
                                        {deletingImageId === img.id ? "..." : "×"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500">
                            No images uploaded for this event yet.
                        </p>
                    )}

                    {imagesError && (
                        <p className="text-sm text-rose-600">{imagesError}</p>
                    )}
                </div>
            )}

            <Dialog
                open={isImagesDialogOpen}
                onOpenChange={(open) => {
                    setIsImagesDialogOpen(open);
                    if (!open) {
                        setNewImages([]);
                        setImagesError(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Add event images</DialogTitle>
                        <DialogDescription>
                            Upload one or more images for this event.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <Label htmlFor="event-new-images">Images</Label>
                        <Input
                            id="event-new-images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                const files = Array.from(e.target.files ?? []);
                                setNewImages(files);
                                setImagesError(null);
                            }}
                        />
                        <p className="text-xs text-slate-500">
                            Selected: {newImages.length || 0}
                        </p>
                        {imagesError && (
                            <p className="text-sm text-rose-600">{imagesError}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsImagesDialogOpen(false)}
                            disabled={imagesLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleAddImages}
                            disabled={imagesLoading || !initialData?.id}
                        >
                            {imagesLoading ? "Uploading..." : "Upload"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
