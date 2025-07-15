"ues client";
import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type Stock = {
  symbol: string;
  name: string;
  logo: string;
  address: string;
  weight: string;
};

export const columns: ColumnDef<Stock>[] = [
  {
    accessorKey: "symbol",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <div className="flex items-center gap-3">
          <img src={stock.logo} alt={stock.symbol} className="w-6 h-6 rounded" />
          <div>
            <p className="font-semibold">{stock.symbol}</p>
            <p className="text-xs text-muted-foreground">{stock.name}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.address;
      return (
        <div className="flex items-center">
          <span>{address}</span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 h-5 w-5 text-muted-foreground"
            onClick={() => {
              navigator.clipboard.writeText(address);
              toast("Address copied!");
            }}
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "weight",
    header: "Weight",
    cell: ({ row }) => <div>{row.original.weight}</div>,
  },
];
