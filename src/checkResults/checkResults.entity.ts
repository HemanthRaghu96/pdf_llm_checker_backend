import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import type { RuleCheckResponse } from "../checkResults/ICheckResults";

@Entity("check_results")
export class CheckResults {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("text")
  pdf_text!: string;

  @Column("simple-array")
  rules!: string[];

  @Column("jsonb")
  results!: RuleCheckResponse[];

  @CreateDateColumn()
  created_at!: Date;
}
