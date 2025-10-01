import { Button } from "@/components/ui/button";

export function PaginationControls({ page, totalPages, onPageChange }: {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <Button
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
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
