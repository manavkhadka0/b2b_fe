"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

interface MDMU {
  id: number;
  name_of_company: string;
  address_province: string;
  address_district: string;
  contact_name: string;
  contact_number: string;
  product_market: string;
  created_at: string;
}

export function MDMUList() {
  const [registrations, setRegistrations] = useState<MDMU[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get(
          "https://cim.baliyoventures.com/api/mdmu/mero-desh-merai-utpadan/"
        );
        setRegistrations(response.data.results);
      } catch (error) {
        console.error("Failed to fetch registrations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Market Type</TableHead>
              <TableHead>Registration Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell>{reg.name_of_company}</TableCell>
                <TableCell>{reg.address_province}</TableCell>
                <TableCell>{reg.address_district}</TableCell>
                <TableCell>{reg.contact_name}</TableCell>
                <TableCell>{reg.contact_number}</TableCell>
                <TableCell>{reg.product_market}</TableCell>
                <TableCell>
                  {new Date(reg.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
