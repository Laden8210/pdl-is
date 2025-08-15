<?php

namespace App\Http\Controllers;

use App\Models\Personnel;
use App\Models\Pdl;
use Inertia\Inertia;

class UserPDLArchiveController extends Controller
{
    public function index()
    {
        $archivedPersonnel = Personnel::onlyTrashed()
            ->with(['pdls' => function($query) {
                $query->withTrashed();
            }])
            ->get()
            ->map(function($personnel) {
                return [
                    'id' => $personnel->id,
                    'name' => $personnel->fname . ' ' . $personnel->lname,
                    'username' => $personnel->username,
                    'position' => $personnel->position,
                    'agency' => $personnel->agency,
                    'deleted_at' => $personnel->deleted_at->format('Y-m-d H:i:s'),
                    'type' => 'personnel'
                ];
            });

        $archivedPdls = Pdl::onlyTrashed()
            ->with(['personnel' => function($query) {
                $query->withTrashed();
            }])
            ->get()
            ->map(function($pdl) {
                return [
                    'id' => $pdl->id,
                    'name' => $pdl->fname . ' ' . $pdl->lname,
                    'alias' => $pdl->alias,
                    'birthdate' => $pdl->birthdate,
                    'added_by' => $pdl->personnel ? $pdl->personnel->fname . ' ' . $pdl->personnel->lname : null,
                    'deleted_at' => $pdl->deleted_at->format('Y-m-d H:i:s'),
                    'type' => 'pdl'
                ];
            });

        return Inertia::render('admin/archive/list', [
            'archivedUsers' => [
                'personnel' => $archivedPersonnel,
                'pdls' => $archivedPdls
            ]
        ]);
    }
}
