"use client";

import { useMemo, useState } from "react";
import {
  TrendingUp,
  Receipt,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  CreditCard,
  QrCode,
  Banknote,
  PackageCheck,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Event } from "@/entities/event/event.entity";
import { useApiQuery } from "@/lib/hooks/useApi";
import { keys } from "@/lib/query-keys";
import { getTransactions, Transaction } from "@/services/transaction.service";
import { getProducts } from "@/services/product.service";
import { TenantProduct } from "@/entities/event/tenant.entity";
import LoadingState from "@/shared/components/ui/LoadingState";
import { CHART_PRIMARY, CHART_SUCCESS } from "@/shared/data/chart-colors";

interface TenantSalesOverviewProps {
  event: Event;
  tenantId: string;
  onNavigateToTab?: (tabId: string) => void;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatShortDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export default function TenantSalesOverview({
  event,
  tenantId,
  onNavigateToTab,
}: TenantSalesOverviewProps) {
  const [chartType, setChartType] = useState<"revenue" | "volume">("revenue");

  // Fetch transactions and products
  const { data: txns, isLoading: loadingTxns } = useApiQuery<Transaction[]>(
    keys.transactions.all(tenantId),
    () => getTransactions(tenantId),
  );

  const { data: products } = useApiQuery<TenantProduct[]>(
    keys.products.all(tenantId),
    () => getProducts(tenantId),
  );

  // Computed metrics
  const stats = useMemo(() => {
    const list = txns ?? [];
    const paidList = list.filter((t) => t.paid);

    const totalRevenue = paidList.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalTransactions = list.length;
    const paidTransactions = paidList.length;
    const aov = paidTransactions > 0 ? Math.round(totalRevenue / paidTransactions) : 0;

    let totalItemsSold = 0;
    const productSalesMap: Record<string, { name: string; qty: number; revenue: number }> = {};

    list.forEach((t) => {
      (t.tenantTransactionDetails ?? []).forEach((d) => {
        const qty = d.quantity || 0;
        const price = d.purchase_price || 0;
        totalItemsSold += qty;

        const prodName = d.product?.name || "Produk";
        if (!productSalesMap[prodName]) {
          productSalesMap[prodName] = { name: prodName, qty: 0, revenue: 0 };
        }
        productSalesMap[prodName].qty += qty;
        productSalesMap[prodName].revenue += qty * price;
      });
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // Payment method breakdown
    const methods = {
      CASH: paidList.filter((t) => t.payment_method === "CASH").length,
      QRIS: paidList.filter((t) => t.payment_method === "QRIS").length,
      TRANSFER: paidList.filter((t) => t.payment_method === "TRANSFER").length,
    };

    // Chart daily grouping
    const dailyMap: Record<string, { date: string; revenue: number; count: number; rawDate: string }> = {};

    // Sort transactions oldest to newest for chart progression
    const sorted = [...paidList].sort(
      (a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
    );

    sorted.forEach((t) => {
      const dayKey = formatShortDate(t.transaction_date);
      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = {
          date: dayKey,
          revenue: 0,
          count: 0,
          rawDate: t.transaction_date,
        };
      }
      dailyMap[dayKey].revenue += t.amount || 0;
      dailyMap[dayKey].count += 1;
    });

    const chartData = Object.values(dailyMap);

    return {
      totalRevenue,
      totalTransactions,
      paidTransactions,
      aov,
      totalItemsSold,
      topProducts,
      methods,
      chartData,
      recent: list.slice(0, 5),
    };
  }, [txns]);

  if (loadingTxns) {
    return <LoadingState type="skeleton-card" count={4} />;
  }

  return (
    <div className="space-y-6">
      {/* ── Top Header Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 p-5 sm:p-6 rounded-2xl border border-blue-100 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-secondary text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Dashboard Penjualan Booth
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Ringkasan Penjualan &amp; Performa
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Pantau arus kas, omzet kasir POS, dan tren produk terlaris booth Anda di event {event.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateToTab?.("pos")}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>+ Catat Transaksi (POS)</span>
          </button>
        </div>
      </div>

      {/* ── 4 Main Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omzet */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Omzet (Pendapatan)
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-secondary flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-secondary" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {formatIDR(stats.totalRevenue)}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dari {stats.paidTransactions} transaksi berhasil</span>
          </div>
        </div>

        {/* Total Transaksi */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Transaksi
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {stats.totalTransactions} <span className="text-sm font-semibold text-gray-400">Order</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <span>{stats.totalTransactions - stats.paidTransactions} transaksi belum lunas</span>
          </div>
        </div>

        {/* Rata-Rata Order (AOV) */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Rata-Rata Order (AOV)
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {formatIDR(stats.aov)}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <span>Rata-rata belanja per pembeli</span>
          </div>
        </div>

        {/* Item Terjual */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Produk Terjual
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {stats.totalItemsSold} <span className="text-sm font-semibold text-gray-400">Item</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <span>Dari {(products ?? []).length} katalog produk terdaftar</span>
          </div>
        </div>
      </div>

      {/* ── Sales Trend Chart & Payment Methods Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart Column (8 cols) */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Grafik Tren Penjualan
              </h3>
              <p className="text-xs text-gray-400">
                Aktivitas transaksi harian di kasir booth Anda.
              </p>
            </div>

            {/* Toggle Revenue vs Volume */}
            <div className="inline-flex rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setChartType("revenue")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartType === "revenue"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Omzet (Rp)
              </button>
              <button
                type="button"
                onClick={() => setChartType("volume")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartType === "volume"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Volume (Order)
              </button>
            </div>
          </div>

          {stats.chartData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-100 rounded-xl text-gray-400">
              <Receipt className="w-10 h-10 mb-2 text-gray-300" />
              <p className="text-sm font-medium text-gray-600">Belum ada data penjualan tercatat.</p>
              <p className="text-xs text-gray-400 mt-1">
                Gunakan tab Transaksi (POS) untuk mencatat penjualan kasir pertama Anda.
              </p>
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "revenue" ? (
                  <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tenantRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_PRIMARY} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={CHART_PRIMARY} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} tickMargin={8} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      tickFormatter={(v) => (v >= 1000000 ? `${v / 1000000}jt` : v >= 1000 ? `${v / 1000}rb` : `${v}`)}
                    />
                    <Tooltip
                      formatter={(val: any) => [formatIDR(Number(val) || 0), "Pendapatan"]}
                      labelFormatter={(label) => `Tanggal: ${label}`}
                      contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={CHART_PRIMARY}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#tenantRevenueGrad)"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} fontSize={11} allowDecimals={false} />
                    <Tooltip
                      formatter={(val: any) => [`${val} Transaksi`, "Jumlah"]}
                      contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                    />
                    <Bar dataKey="count" fill={CHART_SUCCESS} radius={[6, 6, 0, 0]} maxBarSize={45} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Payment Methods & Breakdown (4 cols) */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Metode Pembayaran
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Distribusi metode bayar yang digunakan pembeli.
            </p>

            <div className="space-y-3.5">
              {/* Tunai / Cash */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/80 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Tunai (Cash)</p>
                    <p className="text-[11px] text-gray-400">Pembayaran langsung</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900">{stats.methods.CASH} Order</span>
                </div>
              </div>

              {/* QRIS */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/80 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-secondary flex items-center justify-center shrink-0">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">QRIS</p>
                    <p className="text-[11px] text-gray-400">Scan dompet digital</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900">{stats.methods.QRIS} Order</span>
                </div>
              </div>

              {/* Transfer */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/80 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Transfer Bank</p>
                    <p className="text-[11px] text-gray-400">Transfer rekening</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900">{stats.methods.TRANSFER} Order</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={() => onNavigateToTab?.("pos")}
              className="w-full text-center text-xs font-semibold text-secondary hover:text-brand-700 py-1 transition-colors cursor-pointer"
            >
              Lihat Detail di Tab Transaksi →
            </button>
          </div>
        </div>
      </div>

      {/* ── Top Selling Products & Recent Transactions Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Products (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Produk Terlaris</h3>
              <p className="text-xs text-gray-400">Item paling diminati pembeli.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab?.("produk")}
              className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
            >
              Kelola Produk
            </button>
          </div>

          {stats.topProducts.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">
              Belum ada data produk terjual.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map((p, idx) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-secondary text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {formatIDR(p.revenue)} omzet
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">
                    {p.qty} Terjual
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions Table (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Transaksi Terbaru</h3>
              <p className="text-xs text-gray-400">5 transaksi terakhir yang tercatat.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab?.("pos")}
              className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
            >
              Semua Transaksi
            </button>
          </div>

          {stats.recent.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">
              Belum ada riwayat transaksi.
            </p>
          ) : (
            <div className="divide-y divide-gray-100 overflow-x-auto">
              {stats.recent.map((t) => (
                <div key={t.uuid} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 truncate">
                      {t.tenantTransactionDetails?.[0]?.product?.name || "Item Transaksi"}
                      {(t.tenantTransactionDetails?.length || 0) > 1 &&
                        ` +${(t.tenantTransactionDetails?.length || 1) - 1} item lainnya`}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatShortDate(t.transaction_date)}
                      </span>
                      <span>•</span>
                      <span>Metode: {t.payment_method}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-gray-900 text-sm">
                      {formatIDR(t.amount)}
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.paid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {t.paid ? "Lunas" : "Belum Lunas"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

