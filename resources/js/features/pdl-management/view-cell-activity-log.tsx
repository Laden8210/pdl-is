import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Cells } from '@/types';

export function ViewCellActivityLog({ cell }: { cell: Cells }) {
    const handleViewLog = () => {
        router.get('/admin/pdl-management/cell-activity-log', {
            cell_id: cell.cell_id,
        });
    };

    return (
        <Button variant="outline" size="sm" onClick={handleViewLog}>
            View Cell Log
        </Button>
    );
}
