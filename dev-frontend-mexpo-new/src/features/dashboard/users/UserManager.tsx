"use client";

import { useState } from "react";
import { Loader2, FileSpreadsheet } from "lucide-react";

import SearchBar from "@/shared/components/form/SearchBar";
import { DataPagination } from "@/shared/components/ui/DataPagination";
import { useAuthStore } from "@/stores/auth.store";
import {
  getUsers,
  bulkImportUsers,
  UserListItem,
  BulkUserItem,
} from "@/services/user.service";
import { useList } from "@/shared/hooks/useList";
import RoleBadge from "@/shared/components/ui/RoleBadge";
import SortMenu from "@/shared/components/ui/SortMenu";
import PageHeader from "@/shared/components/ui/PageHeader";
import PageShell from "@/shared/components/ui/PageShell";
import Badge from "@/shared/components/ui/Badge";
import Button from "@/shared/components/button/Button";
import BulkImportModal, { BulkColumnDef } from "@/shared/components/ui/BulkImportModal";

const USER_IMPORT_COLUMNS: BulkColumnDef[] = [
  { key: "full_name", label: "Nama Lengkap", required: true, placeholder: "Nama lengkap pengguna" },
  { key: "email", label: "Email", required: true, type: "email", placeholder: "email@contoh.com" },
  { key: "phone", label: "No Telepon", placeholder: "08123456789" },
  { key: "organization", label: "Instansi/Organisasi", placeholder: "SMK Telkom Malang" },
  { key: "role", label: "Role", type: "select", options: ["USER", "COMMITTEE", "TENANT", "SUPERADMIN"] },
];

const USER_SAMPLE_DATA = [
  {
    "Nama Lengkap": "Budi Santoso",
    "Email": "budi.santoso@example.com",
    "No Telepon": "081234567890",
    "Instansi/Organisasi": "SMK Telkom Malang",
    "Role": "USER",
  },
  {
    "Nama Lengkap": "Siti Nurhaliza",
    "Email": "siti.nur@example.com",
    "No Telepon": "089876543210",
    "Instansi/Organisasi": "Universitas Brawijaya",
    "Role": "USER",
  },
];

export default function UserManager() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "SUPERADMIN";

  const [status, setStatus] = useState("Aktif");
  const [isImportOpen, setIsImportOpen] = useState(false);

  const list = useList<UserListItem>(
    (q) => getUsers(q),
    [isSuperAdmin],
    10,
    { is_active: "true" }
  );

  const handleStatusFilter = (val: string) => {
    setStatus(val);
    list.applyFilter("is_active", val === "Aktif" ? "true" : "false");
  };

  if (!isSuperAdmin) {
    return (
      <PageShell className="py-12 text-center">
        <p className="text-gray-500">Halaman ini khusus Super Admin.</p>
      </PageShell>
    );
  }

  return (
    <PageShell className="py-8">
      <PageHeader
        title="Manajemen User"
        subtitle="Kelola semua akun pengguna."
        action={
          <Button
            variant="primary"
            onClick={() => setIsImportOpen(true)}
            className="gap-2 text-xs"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Import Excel
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
        <div className="flex-1 min-w-[200px]">
          <SearchBar search={list.search} setSearch={list.applySearch} placeholder="Cari nama / email..." />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Status:</span>
          {["Aktif", "Non-aktif"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => handleStatusFilter(v)}
              className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                status === v
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <SortMenu
          options={[
            { key: "full_name", label: "Nama" },
            { key: "email", label: "Email" },
            { key: "created_at", label: "Terdaftar" },
          ]}
          sortBy={list.sortBy}
          sortDir={list.sortDir}
          onChange={list.applySort}
        />
      </div>

      {list.loading && list.items.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-secondary" />
        </div>
      ) : list.items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center text-sm text-gray-400">
          Tidak ada pengguna yang cocok dengan pencarian / filter.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Nama</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Telepon</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {list.items.map((u) => (
                  <tr key={u.uuid} className="hover:bg-gray-50/50">
                    <td className="px-5 py-2.5 font-medium text-gray-900">
                      {u.full_name}
                    </td>
                    <td className="px-5 py-2.5">{u.email}</td>
                    <td className="px-5 py-2.5">{u.phone || "-"}</td>
                    <td className="px-5 py-2.5">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-5 py-2.5">
                      {u.is_active ? (
                        <Badge tone="success">Aktif</Badge>
                      ) : (
                        <Badge tone="danger">Non-aktif</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <DataPagination
              currentPage={list.page}
              totalPages={list.totalPages}
              itemsPerPage={list.pageSize}
              totalItems={list.total}
              onPageChange={list.setPage}
              onItemsPerPageChange={(size) => {
                list.setPageSize(size);
                list.setPage(1);
              }}
            />
          </div>
        </>
      )}

      <BulkImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Massal Pengguna"
        description="Unggah file spreadsheet (Excel / CSV) untuk menambahkan banyak pengguna sekaligus."
        templateFilename="template_import_pengguna.xlsx"
        columns={USER_IMPORT_COLUMNS}
        sampleData={USER_SAMPLE_DATA}
        onConfirm={async (rows) => {
          const items: BulkUserItem[] = rows.map((r) => ({
            full_name: String(r.full_name || ""),
            email: String(r.email || ""),
            phone: r.phone ? String(r.phone) : undefined,
            organization: r.organization ? String(r.organization) : undefined,
            role: r.role ? String(r.role) : undefined,
          }));
          return await bulkImportUsers(items);
        }}
        onSuccess={() => {
          list.refetch();
        }}
      />
    </PageShell>
  );
}
