"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, set } from "date-fns";

export default function TransactionFilters({ onFilter }: { onFilter: (filters: any) => void }) {
  const [phone, setPhone] = useState("");
  const [operator, setOperator] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const applyFilters = () => {
    onFilter({ phone, operator, dateRange });
    setPhone("");
    setOperator("");
    setDateRange({})
  };

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg bg-muted/20">
      {/* Phone search */}
      <div className="flex flex-col gap-1">
        <label className="text-sm">Phone</label>
        <Input
          placeholder="Search phone..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-[180px]"
        />
      </div>

      {/* Operator filter */}
      <div className="flex flex-col gap-1">
        <label className="text-sm">Operator</label>
        <Select value={operator} onValueChange={setOperator}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All operators" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Djezzy">Djezzy</SelectItem>
            <SelectItem value="Mobilis">Mobilis</SelectItem>
            <SelectItem value="Ooredoo">Ooredoo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range */}
      <div className="flex flex-col gap-1">
        <label className="text-sm">Date Range</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[220px]">
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy")
                )
              ) : (
                "Pick a date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Apply button */}
      <Button onClick={applyFilters}>Apply</Button>
    </div>
  );
}
