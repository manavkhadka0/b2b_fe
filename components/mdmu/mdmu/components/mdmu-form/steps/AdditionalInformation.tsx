"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { UseFormReturn } from "react-hook-form";
import type { MDMUFormData } from "../types";
import { Checkbox } from "@/components/ui/checkbox";

interface AdditionalInformationProps {
  form: UseFormReturn<MDMUFormData>;
}

export function AdditionalInformation({ form }: AdditionalInformationProps) {
  const watchKnowAboutMdmu = form.watch("know_about_mdmu");
  const watchAlreadyUsedLogo = form.watch("already_used_logo");
  const watchInterestedInLogo = form.watch("interested_in_logo");

  return (
    <div className="space-y-6">
      {/* CIM Membership */}
      <FormField
        control={form.control}
        name="member_of_cim"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Are you a member of Chamber of Industries Morang, CIM?
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-row space-x-4"
              >
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="true" />
                  </FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="false" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage className="text-red-600" />
          </FormItem>
        )}
      />

      {/* Know about MDMU */}
      <FormField
        control={form.control}
        name="know_about_mdmu"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Do you know about the Mero Desh Merai Utpadan Campaign?
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-row space-x-4"
              >
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="true" />
                  </FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="false" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage className="text-red-600" />
          </FormItem>
        )}
      />

      {/* Already used logo - Only show if knows about MDMU */}
      {watchKnowAboutMdmu === "true" && (
        <FormField
          control={form.control}
          name="already_used_logo"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Have you already used the Logo?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="false" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
      )}

      {/* Interested in using logo - Only show if doesn't know about MDMU or hasn't used logo */}
      {(watchKnowAboutMdmu === "false" || watchAlreadyUsedLogo === "false") && (
        <FormField
          control={form.control}
          name="interested_in_logo"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Are you interested in using the logo?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="false" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
      )}

      {/* Terms and Conditions - Always visible */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <Checkbox id="terms-checkbox" />
          <div className="space-y-1 leading-none flex-1">
            <label
              htmlFor="terms-checkbox"
              className="text-sm font-medium text-gray-900 cursor-pointer"
            >
              Terms and Conditions
            </label>
            <p className="text-sm text-gray-500 mb-4">
              I have read and agree to the terms and conditions
            </p>
            <div className="space-y-3 pl-4 border-l-2 border-gray-200">
              <ol className="space-y-3 list-decimal list-inside">
                <li className="text-sm text-gray-700 leading-relaxed">
                  My first choice is domestic products.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  I fulfill my daily needs from domestic products.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  I encourage my neighbors, friends, and acquaintances to use
                  domestic products.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  With high self-esteem and pride, I will always be involved in
                  the promotion of domestic products.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Self Declaration - Only show if interested in using logo */}
      {watchInterestedInLogo === "true" && (
        <div className="pt-4 border-t border-gray-200">
          <FormField
            control={form.control}
            name="self_declaration"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Self Declaration
                    </FormLabel>
                    <p className="text-sm text-gray-500">
                      I hereby declare that our industry is participating in the
                      Domestic Product Promotional Campaign initiated by the
                      Chamber of Industries Morang (CIM) named &quot;Mero Desh
                      Merai Utpadan.&quot; We acknowledge and will utilize the
                      mnemonic logo developed by CIM for this campaign. We
                      commit to using this specified logo exclusively for the
                      promotion of domestic products. Furthermore, we ensure
                      that we will not misuse or mislead the intention of this
                      initiative in any way.
                    </p>
                  </div>
                </div>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
