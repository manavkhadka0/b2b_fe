"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";

type FormValues = {
  name: string;
  phone_number: string;
  email: string;
  message: string;
};

export default function ContactForm() {
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<FormValues | null>(null);
  
  const formSchema = z.object({
    name: z.string().min(2, t("contact.name") + " " + t("common.error")),
    phone_number: z
      .string()
      .regex(/^\+?[0-9]{10,15}$/, t("contact.phoneNumber") + " " + t("common.error"))
      .min(1, t("contact.phoneNumber") + " " + t("common.error")),
    email: z.string().email(t("contact.email") + " " + t("common.error")),
    message: z.string().min(1, t("contact.message") + " " + t("common.error")),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      email: "",
      message: "",
    },
  });

  const submitContact = async (data: FormValues) => {
    setLoading(true); // Start loading
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.phone_number?.[0] ||
          t("contact.sendError");
        toast.error(errorMessage, {
          description: t("contact.sendErrorDesc"),
        });
      } else {
        toast(t("contact.messageSent"), {
          description: t("contact.messageSentDesc"),
        });
        form.reset();
      }
    } catch (err) {
      toast.error(t("contact.sendError"), {
        description: t("contact.sendErrorDesc"),
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!user && !token && !authLoading) {
      setPendingData(data);
      setAuthDialogOpen(true);
      return;
    }

    await submitContact(data);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("contact.enterName")}
                    className="p-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.phoneNumber")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("contact.enterPhone")}
                    className="p-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("contact.enterEmail")}
                    className="p-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.message")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("contact.enterMessage")}
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="py-9">
            <Button
              type="submit"
              className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-transform hover:scale-105"
              disabled={loading}
            >
              {loading ? t("contact.sending") : t("contact.send")} →
            </Button>
          </div>
        </form>
      </Form>
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={(open) => {
          setAuthDialogOpen(open);
          if (!open) {
            setPendingData(null);
          }
        }}
        initialMode="login"
        onAuthenticated={async () => {
          if (!pendingData) return;
          const dataToSubmit = pendingData;
          setPendingData(null);
          await submitContact(dataToSubmit);
        }}
      />
    </div>
  );
}
