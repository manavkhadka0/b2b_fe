"use client";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import { Input } from "@/components/ui/input";
import { toLatinNumerals } from "@/lib/nepali-date";

interface DateLocationSectionProps {
    startDateBs: string;
    handleStartDateChange: (args: { bsDate: string; adDate: string }) => void;
    startDateAd: string;
    endDateBs: string;
    handleEndDateChange: (args: { bsDate: string; adDate: string }) => void;
    endDateAd: string;
    location: string;
    setLocation: (value: string) => void;
    order: number;
    setOrder: (value: number) => void;
    calendarKey: number;
    contactPerson: string;
    setContactPerson: (value: string) => void;
    contactNumber: string;
    setContactNumber: (value: string) => void;
}

export default function DateLocationSection({
    startDateBs,
    handleStartDateChange,
    startDateAd,
    endDateBs,
    handleEndDateChange,
    endDateAd,
    location,
    setLocation,
    order,
    setOrder,
    calendarKey,
    contactPerson,
    setContactPerson,
    contactNumber,
    setContactNumber,
}: DateLocationSectionProps) {
    return (
        <div className="space-y-6">
            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="start_date"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Start date (BS)
                    </label>
                    <div className="relative">
                        <Calendar
                            key={`start-${calendarKey}`}
                            language="ne"
                            dateFormat="YYYY-MM-DD"
                            className="mt-1 w-full"
                            inputClassName="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            placeholder="YYYY-MM-DD"
                            value={startDateBs}
                            onChange={handleStartDateChange}
                            theme="deepdark"
                            defaultDate={toLatinNumerals(startDateBs) || undefined}
                            hideDefaultValue={!startDateBs}
                        />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                        BS: {startDateBs || "Not set"} | AD: {startDateAd || "Not set"}
                    </p>
                </div>
                <div>
                    <label
                        htmlFor="end_date"
                        className="block text-sm font-medium text-slate-700"
                    >
                        End date (BS)
                    </label>
                    <div className="relative">
                        <Calendar
                            key={`end-${calendarKey}`}
                            language="ne"
                            dateFormat="YYYY-MM-DD"
                            className="mt-1 w-full"
                            inputClassName="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            placeholder="YYYY-MM-DD"
                            value={endDateBs}
                            onChange={handleEndDateChange}
                            theme="deepdark"
                            defaultDate={toLatinNumerals(endDateBs) || undefined}
                            hideDefaultValue={!endDateBs}
                        />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                        BS: {endDateBs || "Not set"} | AD: {endDateAd || "Not set"}
                    </p>
                </div>
            </div>

            {/* Location & Order */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="location"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Location
                    </label>
                    <Input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter location"
                        className="mt-1"
                    />
                </div>
                <div>
                    <label
                        htmlFor="order"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Order
                    </label>
                    <Input
                        id="order"
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(Number(e.target.value))}
                        placeholder="0"
                        className="mt-1"
                    />
                </div>
            </div>

            {/* Contact Information */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="contact_person"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Contact person
                    </label>
                    <Input
                        id="contact_person"
                        type="text"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder="Enter contact person name"
                        className="mt-1"
                    />
                </div>
                <div>
                    <label
                        htmlFor="contact_number"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Contact number
                    </label>
                    <Input
                        id="contact_number"
                        type="text"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="Enter contact number"
                        className="mt-1"
                    />
                </div>
            </div>
        </div>
    );
}
