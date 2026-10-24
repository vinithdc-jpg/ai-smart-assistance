export interface Member {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  totalAmount: number;
  receivedAmount: number;
  balanceAmount: number;
  status?: string;
  memberSince?: string;
}
export interface Transaction {
  id: string;
  date: string;
  dateValue: string;
  slipNo: string;
  invoiceNo: string;
  amount: number;
  amountExcludingGst?: number;
  gstAmount?: number;
  totalWithGst?: number;
  received: number;
  balance: number;
  status: "Completed" | "Partial" | "Pending";
  paymentMethod: string;
  remarks: string;
  transactionType: string;
}
