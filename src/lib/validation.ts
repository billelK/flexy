// validation/transaction.ts
import { z } from "zod";

export const transactionSchema = z.object({
  operator: z.enum(["Djezzy", "Mobilis", "Ooredoo"], {
    errorMap: () => ({ message: "Please select a valid operator" }),
  }),
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  amount: z.coerce.number().min(50, "Minimum amount is 50 DA"),
  status: z.enum(["Pending", "Completed", "Failed"]),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
