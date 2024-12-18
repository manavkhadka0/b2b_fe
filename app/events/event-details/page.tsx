"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaMapMarkerAlt, FaPhoneAlt, FaRegClock } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import {
  FaEnvelope,
  FaGlobe,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EventPage = () => {
  return (
    <div className="min-h-screen  p-6 container mx-auto">
      {/* Header Section */}
      <div
        className="relative w-full h-80 bg-no-repeat bg-center bg-cover mb-6 rounded-lg"
        style={{ backgroundImage: "url('/event.svg')" }}
      ></div>

      <div className="absolute inset-5 flex items-center justify-center ">
        <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-md p-6 max-w-4xl w-full">
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold">
              Nepali Business Networking Meetup
            </h1>
            <div className="flex items-center text-gray-600 space-x-2">
              <FaMapMarkerAlt />
              <p>Gograha Bazaar-6, Biratnagar, Nepal</p>
            </div>
            <div className="flex items-center text-gray-600 space-x-2">
              <FaPhoneAlt />
              <p>01-525252, +977 9800000000</p>
            </div>
            <div className="flex items-center text-gray-600 space-x-2">
              <BsCalendar2Date />
              <p>Fri, Dec 10 2024</p>
            </div>
            <div className="flex items-center text-gray-600 space-x-2">
              <FaRegClock />
              <p>3 PM Onwards</p>
            </div>
            <p className="text-gray-600">
              <strong>175 Peoples Enrolled</strong>
            </p>
          </div>

          {/* Right Side */}
          <div className="sm:w-1/3 flex flex-col items-center space-y-4">
            <p className="text-gray-500">In Association with</p>
            <div className="text-3xl font-bold text-blue-600">
              B2B birat bazaar
            </div>
            <Link href={"/events/create-event"}>
              <button className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700">
                Apply Now →
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
        {/* Left Section */}
        <div className="md:col-span-2 space-y-10">
          {/* Event Description */}
          <div className="bg-white rounded-lg   ">
            <h2 className="text-xl font-bold mb-4">About the Event</h2>
            <p className="text-gray-600 leading-relaxed">
              Business Network Tech Meetup, one of the largest tech events in
              Morang, brings professionals, entrepreneurs, and business leaders
              together. Hosted by B2B Bazaar, the event will be held on Friday,
              December 10, 2024, at Gograha Bazaar-6, Biratnagar, Nepal. With
              over 175 participants already enrolled, the event promises a
              vibrant gathering of like-minded individuals eager to share ideas
              and opportunities for growth.
            </p>
            <br />
            <p className="text-gray-600 leading-relaxed">
              This meetup allows attendees to pitch their business ideas,
              connect with investors, and showcase their work. In addition,
              industry experts will share insights into market trends, growth
              strategies, and solutions for business needs.
            </p>
          </div>
          <h2 className="text-xl font-bold mb-4">
            Event Agenda and Responsibilities
          </h2>
          <div className="bg-white rounded-lg p-6 shadow ">
            <Table>
              <TableCaption>Event Agenda and Responsibilities</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Time</TableHead>
                  <TableHead>Topic to be discuss</TableHead>
                  <TableHead className="text-right">Speakers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">9:30-12:30 pm</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-gray-600">
                      <p className="font-bold">WELCOME AND INTRODUCTIONS</p>
                      <div className="ml-3">
                        <li>Opening remarks</li>
                        <li>Brief introductions of each attendee</li>
                      </div>
                    </ul>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    Alexander Aronowitz
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">9:30-12:30 pm</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-gray-600">
                      <p className="font-bold">WELCOME AND INTRODUCTIONS</p>
                      <div className="ml-3">
                        <li>Opening remarks</li>
                        <li>Brief introductions of each attendee</li>
                      </div>
                    </ul>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    Alexander Aronowitz
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">9:30-12:30 pm</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-gray-600">
                      <p className="font-bold">WELCOME AND INTRODUCTIONS</p>
                      <div className="ml-3">
                        <li>Opening remarks</li>
                        <li>Brief introductions of each attendee</li>
                      </div>
                    </ul>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    Alexander Aronowitz
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">9:30-12:30 pm</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-gray-600">
                      <p className="font-bold">WELCOME AND INTRODUCTIONS</p>
                      <div className="ml-3">
                        <li>Opening remarks</li>
                        <li>Brief introductions of each attendee</li>
                      </div>
                    </ul>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    Alexander Aronowitz
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">9:30-12:30 pm</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-gray-600">
                      <p className="font-bold">WELCOME AND INTRODUCTIONS</p>
                      <div className="ml-3">
                        <li>Opening remarks</li>
                        <li>Brief introductions of each attendee</li>
                      </div>
                    </ul>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    Alexander Aronowitz
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">9:30-12:30 pm</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-gray-600">
                      <p className="font-bold">WELCOME AND INTRODUCTIONS</p>
                      <div className="ml-3">
                        <li>Opening remarks</li>
                        <li>Brief introductions of each attendee</li>
                      </div>
                    </ul>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    Alexander Aronowitz
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">9:30-12:30 pm</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-gray-600">
                      <p className="font-bold">WELCOME AND INTRODUCTIONS</p>
                      <div className="ml-3">
                        <li>Opening remarks</li>
                        <li>Brief introductions of each attendee</li>
                      </div>
                    </ul>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    Alexander Aronowitz
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Organizer Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <span className="text-red-600">🎖️</span>
              <span>Event Organizer</span>
            </h3>
            <p className="text-gray-800 font-semibold">
              Chamber of Industries, Morang
            </p>
            <p className="text-gray-500">Biratnagar, Morang</p>

            <div className="mt-4 space-y-2 text-gray-600">
              <p>
                <FaPhoneAlt className="inline mr-2" /> +977 9800000000,
                01-525252
              </p>
              <p>
                <FaEnvelope className="inline mr-2" /> chamberofmorang@gmail.com
              </p>
              <p>
                <FaGlobe className="inline mr-2" /> www.cim.org.np
              </p>
            </div>

            <div className="flex space-x-4 mt-4 text-blue-500">
              <FaFacebook className="cursor-pointer" />
              <FaTwitter className="cursor-pointer" />
              <FaLinkedin className="cursor-pointer" />
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-white rounded-lg ">
            <h3 className="text-lg font-bold mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {["Technology", "Health and Wellness", "Travel"].map(
                (tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-10">
        {/* Title */}
        <div className="text-2xl font-bold mb-6">Event Photos and Videos</div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large Main Image */}
          <div className="md:col-span-2 rounded-lg overflow-hidden">
            <Image
              src="/image.png" // Replace with your image path
              alt="Main Event"
              layout="responsive"
              width={700}
              height={450}
              className="object-cover"
            />
          </div>

          {/* Small Images */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden">
              <Image
                src="/image1.png" // Replace with your image path
                alt="Event Discussion"
                layout="responsive"
                width={350}
                height={250}
                className="object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden">
              <Image
                src="/image2.png" // Replace with your image path
                alt="Event Collaboration"
                layout="responsive"
                width={350}
                height={250}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className=" container mx-auto mt-10">
        <div className="text-2xl font-bold mb-6">Explore Similar Events</div>
      </div>
    </div>
  );
};

export default EventPage;
