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
   const [date, setDate] = useState<Date | undefined>(undefined)

  const applyFilters = () => {
    console.log({ phone, operator, date });
    
    onFilter({ phone, operator, date });

    console.log({ phone, operator, date });
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
          className={`w-[180px] transition-colors ${
            phone ? "border-primary bg-primary/10" : ""
          }`}
        />
      </div>

      {/* Operator filter */}
      <div className="flex flex-col gap-1">
        <label className="text-sm">Operator</label>
        <Select value={operator} onValueChange={setOperator}>
          <SelectTrigger className={`w-[180px] transition-colors ${
            operator ? "border-primary bg-primary/10" : ""
          }`}>
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
      <label className="text-sm">Date</label> 
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={`w-[180px] transition-colors ${
            date ? "border-primary bg-primary/10" : ""
          }`}>
            {date ? format(date, "dd/MM/yyyy") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0 z-[9999] relative bg-background w-auto">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
      {/* Apply button */}
      <Button onClick={applyFilters}>Apply</Button>
      {(operator || phone || date) && (
      <Button
        variant="outline"
        onClick={() => {
          setOperator("");
          setPhone("");
          setDate(undefined);
        }}
      >
        Clear Filters
      </Button>
    )}
    </div>
  );
}
