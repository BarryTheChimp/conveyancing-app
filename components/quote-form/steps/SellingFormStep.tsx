"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import type { QuoteFormData } from "../schemas";
import { tenureOptions } from "../schemas/buying.schema";

export function SellingFormStep() {
  const { control, watch } = useFormContext<QuoteFormData>();

  const hasMortgage = watch("selling.hasMortgage");

  return (
    <div className="space-y-6">
      {/* Property Price */}
      <FormField
        control={control}
        name="selling.propertyPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Asking Price</FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  £
                </span>
                <Input
                  type="number"
                  placeholder="350000"
                  className="pl-7"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                />
              </div>
            </FormControl>
            <FormDescription>
              The price you're selling or expecting to sell for
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Property Address */}
      <FormField
        control={control}
        name="selling.propertyAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Address</FormLabel>
            <FormControl>
              <Input placeholder="123 High Street, London" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Postcode */}
      <FormField
        control={control}
        name="selling.propertyPostcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postcode</FormLabel>
            <FormControl>
              <Input placeholder="SW1A 1AA" className="uppercase" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tenure */}
      <FormField
        control={control}
        name="selling.tenure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tenure</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select tenure" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tenureOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Mortgage section */}
      <FormField
        control={control}
        name="selling.hasMortgage"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Outstanding Mortgage</FormLabel>
              <FormDescription>
                Do you have a mortgage to pay off on this property?
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {hasMortgage && (
        <FormField
          control={control}
          name="selling.mortgageLender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mortgage Lender</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Nationwide, Barclays" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Number of sellers */}
      <FormField
        control={control}
        name="selling.numberOfSellers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Sellers</FormLabel>
            <Select
              onValueChange={(val) => field.onChange(parseInt(val))}
              value={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              How many people are currently named on the title?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
