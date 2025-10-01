// validation/transaction.ts
import { z } from "zod";

export const transactionSchema = z.object({
  operator: z.enum(["Djezzy", "Mobilis", "Ooredoo"], {
    errorMap: () => ({ message: "Please select a valid operator" }),
  }),
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  amount: z.coerce.number().min(50, "Minimum amount is 50 DA"),
  status: z.enum(["Pending", "Completed", "Failed"]),
}).refine((data) => {
    if (data.operator === "Djezzy")  return data.phone.startsWith("07");
    if (data.operator === "Mobilis") return data.phone.startsWith("06");
    if (data.operator === "Ooredoo") return data.phone.startsWith("05");
    return false;
  }, { message: "Phone prefix does not match the selected operator", path: ["phone"] }
);
       

export type TransactionInput = z.infer<typeof transactionSchema>;
