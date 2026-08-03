import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getSummary(empresaId: number) {
    // 1. Total de usuarios activos en la empresa
    const totalUsers = await this.dataSource.query(
      `SELECT count(*)::int as count FROM public.usuarios WHERE empresa_id = $1 AND active = true`,
      [empresaId],
    );

    // 2. Facturación de hoy (Suma de total) y conteo de facturas
    const todayStats = await this.dataSource.query(
      `SELECT 
        coalesce(sum(total), 0)::float as total_billing,
        count(*)::int as total_invoices
       FROM public.view_salidas 
       WHERE empresa_id = $1 
         AND fecha::date = current_date
         AND (anulado IS NULL OR LOWER(anulado::text) NOT IN ('s', 'si', 'true', '1'))`,
      [empresaId],
    );

    return {
      totalUsers: totalUsers[0]?.count || 0,
      todayBilling: todayStats[0]?.total_billing || 0,
      todayInvoices: todayStats[0]?.total_invoices || 0,
    };
  }
}
