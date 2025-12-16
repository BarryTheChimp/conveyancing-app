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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import type { QuoteFormData } from "../schemas";
import {
  purchaseTypeOptions,
  tenureOptions,
  propertyTypeOptions,
} from "../schemas/buying.schema";

export function BuyingFormStep() {
  const { control, watch } = useFormContext<QuoteFormData>();

  const purchaseType = watch("buying.purchaseType");
  const hasMortgage = watch("buying.hasMortgage");
  const isSharedOwnership = watch("buying.isSharedOwnership");

  return (
    <div className="space-y-6">
      {/* Property Price */}
      <FormField
        control={control}
        name="buying.propertyPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Price</FormLabel>
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
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Property Address */}
      <FormField
        control={control}
        name="buying.propertyAddress"
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
        name="buying.propertyPostcode"
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

      {/* Property Type & Tenure - side by side */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="buying.propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {propertyTypeOptions.map((option) => (
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

        <FormField
          control={control}
          name="buying.tenure"
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
      </div>

      {/* Purchase Type */}
      <FormField
        control={control}
        name="buying.purchaseType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Purchase Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select purchase type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {purchaseTypeOptions.map((option) => (
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

      {/* Auction Date - conditional */}
      {purchaseType === "auction" && (
        <FormField
          control={control}
          name="buying.auctionDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Auction Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The date of the auction you're bidding in
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Checkboxes row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="buying.isFirstTimeBuyer"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>First Time Buyer</FormLabel>
                <FormDescription>
                  You may qualify for stamp duty relief
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="buying.isBuyToLet"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Buy to Let</FormLabel>
                <FormDescription>
                  This is an investment property
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Mortgage section */}
      <FormField
        control={control}
        name="buying.hasMortgage"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Purchasing with a Mortgage</FormLabel>
              <FormDescription>
                Are you using a mortgage to fund this purchase?
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {hasMortgage && (
        <FormField
          control={control}
          name="buying.mortgageLender"
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

      {/* Additional options */}
      <div className="space-y-4">
        <FormField
          control={control}
          name="buying.isUsingHelpToBuy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Using Help to Buy</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="buying.isSharedOwnership"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Shared Ownership</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {isSharedOwnership && (
          <FormField
            control={control}
            name="buying.sharedOwnershipPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Share Percentage</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      min={25}
                      max={75}
                      placeholder="40"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || undefined)
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      %
                    </span>
                  </div>
                </FormControl>
                <FormDescription>
                  The percentage share you are purchasing (25-75%)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="buying.hasGiftedDeposit"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Gifted Deposit</FormLabel>
                <FormDescription>
                  Part of your deposit is a gift from family
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Number of buyers */}
      <FormField
        control={control}
        name="buying.numberOfBuyers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Buyers</FormLabel>
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
              How many people will be named on the title?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
