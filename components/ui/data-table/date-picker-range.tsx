"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type Column } from "@tanstack/react-table";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

interface DataTableDatePickerRangeFilter<TData, TValue> {
  column?: Column<TData, TValue>;
}

export function DatePickerWithRange<TData, TValue>({
  column,
}: DataTableDatePickerRangeFilter<TData, TValue>) {
  // Component state & setState
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  // Get initial value
  const dateRangeArr = column?.getFilterValue() as string[] | undefined;

  // Sync dateRange with fitler value from url params
  React.useEffect(() => {
    if (dateRangeArr && dateRangeArr.length == 2) {
      setDateRange({
        from: new Date(dateRangeArr[0]),
        to: new Date(dateRangeArr[1]),
      });
    } else {
      setDateRange(undefined);
    }
  }, [dateRangeArr, setDateRange]);

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start px-3 text-left font-normal sm:w-[250px]",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            numberOfMonths={1}
            selected={dateRange}
            onSelect={(newDateRange) => {
              // Update calendar component
              setDateRange(newDateRange);

              // Update url params
              if (newDateRange && newDateRange.from && newDateRange.to) {
                // Get from date MM-DD-YYYY (without miliseconds)
                const fromDate =
                  newDateRange.from.toISOString().split(".")[0] + "Z";
                // Get to date MM-DD-YYYY (note + 1 day to get inclusive range and without miliseconds)
                const toDate =
                  newDateRange.to.toISOString().split(".")[0] + "Z";
                // Set filter value
                column?.setFilterValue([fromDate, toDate]);
              } else {
                // Clear filter value
                column?.setFilterValue(undefined);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
