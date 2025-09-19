<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PersonnelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('personnel')->insert([
            [
                'fname' => 'John',
                'mname' => 'A.',
                'lname' => 'Doe',
                'contactnum' => '09171234567',
                'avatar' => null,
                'username' => 'johndoe',
                'password' => Hash::make('password123'),
                'position' => 'record-officer',
                'agency' => 'LGU Buenavista',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'fname' => 'Jane',
                'mname' => 'B.',
                'lname' => 'Smith',
                'contactnum' => '09179876543',
                'avatar' => null,
                'username' => 'janesmith',
                'password' => Hash::make('securepass'),
                'position' => 'admin',
                'agency' => 'LGU Buenavista',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // [
            //     'fname' => 'Alice',
            //     'mname' => 'C.',
            //     'lname' => 'Johnson',
            //     'contactnum' => '09172345678',
            //     'avatar' => null,
            //     'username' => 'alicejohnson',
            //     'password' => Hash::make('alicepass'),
            //     'position' => 'law-enforcement',
            //     'agency' => 'LGU Buenavista',
            //     'created_at' => now(),
            //     'updated_at' => now(),
            // ],


        ]);
    }
}
