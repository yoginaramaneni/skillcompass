import { z } from 'zod';

export const marketDatasetRecordSchema = z.object({
  skill: z.string().min(1, 'Skill name cannot be empty'),
  mentions: z.number().min(0, 'Mentions must be >= 0'),
});

export const marketDatasetImportSchema = z.object({
  source: z.string().min(1, 'Source name is required'),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  collectedAt: z.string().min(1, 'collectedAt date is required'),
  period: z.string().min(1, 'Period is required (e.g. 2026-Q3)'),
  totalRecords: z.number().positive('totalRecords must be > 0'),
  records: z.array(marketDatasetRecordSchema).min(1, 'At least one record is required'),
}).refine((data) => {
  return data.records.every((r) => r.mentions <= data.totalRecords);
}, {
  message: 'Skill mentions cannot exceed totalRecords in the dataset',
});

export type MarketDatasetImportSchema = z.infer<typeof marketDatasetImportSchema>;
