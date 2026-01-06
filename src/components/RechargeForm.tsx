import React from 'react'
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


const RechargeForm = () => {
    const {onSubmit,form} = useApp();

    return (
        <Card className='h-full border-[#C0D2D3]'>
            <CardHeader>
            <CardTitle className='text-[#0D5256]'>Top Up</CardTitle>
                <p className="xl:text-sm text-[12px] text-gray-500">
                    Enter details and submit.
                </p>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pb-4 mb-4">
                
                {/* Operator */}
                <FormField
                    control={form.control}
                    name="operator"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Operator</FormLabel>
                        <FormControl>
                        <Select 
                            onValueChange={(value) => {
                            field.onChange(value);

                            // auto-fill phone prefix depending on operator
                            if (value === "Mobilis") {
                            form.setValue("phone", "06");
                            } else if (value === "Ooredoo") {
                            form.setValue("phone", "05");
                            } else if (value === "Djezzy") {
                            form.setValue("phone", "07");
                            }
                        }} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select operator" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Djezzy">Djezzy</SelectItem>
                                <SelectItem value="Mobilis">Mobilis</SelectItem>
                                <SelectItem value="Ooredoo">Ooredoo</SelectItem>
                            </SelectContent>
                        </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Amount */}
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="Enter Amount DA" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Phone */}
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                        <Input
                            {...field}
                            maxLength={10}
                            inputMode="numeric"
                            placeholder="e.g., 07XXXXXXXX"
                            onChange={(e) => {
                            // remove all non-digits
                            const onlyNums = e.target.value.replace(/\D/g, "");
                            field.onChange(onlyNums);
                            }}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />



                {/* Mode */}
                <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Mode</FormLabel>
                        <FormControl>
                        <Select 
                        onValueChange={field.onChange}
                        value={field.value}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Recharge">Recharge</SelectItem>
                                <SelectItem value="Activation">Activation</SelectItem>
                                <SelectItem value="Facture">Facture</SelectItem>
                            </SelectContent>
                        </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />


                <Button className='bg-[#0D5256]' type="submit">Top Up</Button>
                </form>
            </Form>
            </CardContent>
        </Card>
    )
}

export default RechargeForm