<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TransferReason;

class TransferReasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultReasons = [
            'Court Order',
            'Medical Treatment',
            'Security Concerns',
            'Overcrowding',
            'Rehabilitation Program',
            'Family Request',
            'Legal Proceedings',
            'Administrative Transfer',
            'Behavioral Issues',
            'Health Emergency',
        ];

        foreach ($defaultReasons as $reason) {
            TransferReason::firstOrCreate(
                ['reason' => $reason],
                ['usage_count' => 0]
            );
        }
    }
}
