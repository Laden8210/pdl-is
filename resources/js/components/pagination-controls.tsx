import { Button } from "@/components/ui/button";

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}) {
  if (totalPages <= 1) return null;
  
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </Button>

      {pageNumbers.map((pg) => (
        <Button
          key={pg}
          variant={pg === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(pg)}
        >
          {pg}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
