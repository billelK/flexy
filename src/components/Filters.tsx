"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format} from "date-fns";
import { Transaction } from "better-sqlite3";

interface FilterData {
    phone: string;
    operator: string;
    date: Date | undefined;
}

export default function TransactionFilters({ 
  onFilter,
  handleClear
}:{ 
  onFilter: (filters: FilterData) => void 
  handleClear: () => void
}) {

  const [phone, setPhone] = useState("");
  const [operator, setOperator] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined)

  const applyFilters = () => {
    onFilter({ phone, operator, date })
    
  };

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg bg-gray-50">
      {/* Phone search */}
      <div className="flex flex-col gap-1">
        <label className="text-sm">Phone</label>
        <Input
          placeholder="Search phone..."
          value={phone}
          maxLength={10}
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/\D/g, "");
            setPhone(onlyNums);
          }}
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

      {/* Date Picker */}
      <div className="flex flex-col gap-1">
      <label className="text-sm">Date</label> 
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={`w-[180px] transition-colors ${
            date ? "border-primary hover:bg-[#C0D2D3]" : ""
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
      <Button className="bg-[#0D5256]" onClick={applyFilters}>Apply</Button>
  
      <Button
        className="hover:bg-[#C0D2D3]"
        disabled={!(operator || phone || date)}
        variant="outline"
        onClick={() => {
          setOperator("");
          setPhone("");
          setDate(undefined);
          handleClear();
        }}
      >
        Clear Filters
      </Button>
    </div>
  );
}
