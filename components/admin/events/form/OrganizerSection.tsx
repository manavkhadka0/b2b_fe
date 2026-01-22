"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { EventOrganizer } from "@/types/events";

interface OrganizerSectionProps {
    selectedOrganizer: number | null;
    setSelectedOrganizer: (value: number | null) => void;
    organizers: EventOrganizer[];
    loadingOrganizers: boolean;
    isCreateOrganizerOpen: boolean;
    setIsCreateOrganizerOpen: (value: boolean) => void;
    newOrganizerName: string;
    setNewOrganizerName: (value: string) => void;
    newOrganizerEmail: string;
    setNewOrganizerEmail: (value: string) => void;
    newOrganizerPhone: string;
    setNewOrganizerPhone: (value: string) => void;
    newOrganizerAddress: string;
    setNewOrganizerAddress: (value: string) => void;
    setNewOrganizerLogo: (value: File | null) => void;
    handleCreateOrganizer: () => void;
    creatingOrganizer: boolean;
}

export default function OrganizerSection({
    selectedOrganizer,
    setSelectedOrganizer,
    organizers,
    loadingOrganizers,
    isCreateOrganizerOpen,
    setIsCreateOrganizerOpen,
    newOrganizerName,
    setNewOrganizerName,
    newOrganizerEmail,
    setNewOrganizerEmail,
    newOrganizerPhone,
    setNewOrganizerPhone,
    newOrganizerAddress,
    setNewOrganizerAddress,
    setNewOrganizerLogo,
    handleCreateOrganizer,
    creatingOrganizer,
}: OrganizerSectionProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Organizer
            </label>
            <div className="flex gap-2">
                <Select
                    value={selectedOrganizer?.toString() ?? "__none__"}
                    onValueChange={(value) => {
                        if (value === "__none__") {
                            setSelectedOrganizer(null);
                            return;
                        }
                        setSelectedOrganizer(Number(value));
                    }}
                >
                    <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select an organizer" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {loadingOrganizers ? (
                            <SelectItem value="loading" disabled>
                                Loading...
                            </SelectItem>
                        ) : (
                            organizers.map((org) => (
                                <SelectItem key={org.id} value={org.id.toString()}>
                                    {org.name}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
                <Dialog
                    open={isCreateOrganizerOpen}
                    onOpenChange={setIsCreateOrganizerOpen}
                >
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="default">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create Event Organizer</DialogTitle>
                            <DialogDescription>
                                Add a new event organizer to the system.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="org-name">Name *</Label>
                                <Input
                                    id="org-name"
                                    value={newOrganizerName}
                                    onChange={(e) => setNewOrganizerName(e.target.value)}
                                    placeholder="Organizer name"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="org-email">Email</Label>
                                <Input
                                    id="org-email"
                                    type="email"
                                    value={newOrganizerEmail}
                                    onChange={(e) => setNewOrganizerEmail(e.target.value)}
                                    placeholder="organizer@example.com"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="org-phone">Phone</Label>
                                <Input
                                    id="org-phone"
                                    value={newOrganizerPhone}
                                    onChange={(e) => setNewOrganizerPhone(e.target.value)}
                                    placeholder="+1234567890"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="org-address">Address</Label>
                                <Input
                                    id="org-address"
                                    value={newOrganizerAddress}
                                    onChange={(e) => setNewOrganizerAddress(e.target.value)}
                                    placeholder="Organizer address"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="org-logo">Logo</Label>
                                <Input
                                    id="org-logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setNewOrganizerLogo(e.target.files?.[0] || null)
                                    }
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOrganizerOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCreateOrganizer}
                                disabled={creatingOrganizer || !newOrganizerName.trim()}
                            >
                                {creatingOrganizer ? "Creating..." : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
