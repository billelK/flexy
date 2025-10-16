import { Button } from "@/components/ui/button";

export function PaginationControls({ page, totalPages, onPageChange }: {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 pt-4">
      <Button
        className="bg-[#0D5256] text-white hover:bg-[#1A7768] hover:text-white"
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>

      <span className="text-sm">
        Page {page} of {totalPages}
      </span>

      <Button
        className="bg-[#0D5256] text-white hover:bg-[#1A7768] hover:text-white"
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
