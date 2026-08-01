import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class InfoService implements OnModuleInit {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    try {
      const result = await this.dataSource.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'view_compras'
        ORDER BY ordinal_position;
      `);
      console.log('--- COLUMNS FOR view_compras ---');
      console.log(result.map(c => c.column_name).join(', '));
      console.log('------------------------------');
    } catch (err) {
      console.error('Error fetching columns:', err.message);
    }
  }
}
