import { Kysely, sql } from 'kysely'

import { DB } from '../gen-types'

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('partner')
    .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('name', 'varchar(255)', col => col.notNull().unique())
    .addColumn('phone_number', 'varchar(128)', col => col.unique())
    .addColumn('email', 'varchar(255)', col => col.notNull().unique())
    .addColumn('password', 'varchar(255)', col => col.notNull())
    .addColumn('public_key', 'varchar(255)')
    .execute()

  await db.schema
    .createTable('partner_tier')
    .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('name', 'varchar(255)', col => col.notNull().unique())
    .addColumn('plan', sql`enum('base', 'growth', 'scale', 'enterprise_a', 'enterprise_b', 'enterprise_c')`, col =>
      col.notNull(),
    )
    .addColumn('addon', 'varchar(255)')
    .execute()

  await db.schema
    .createTable('partner_subscription')
    .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('partner_id', 'integer', col => col.references('partner.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint('partner_subscription_partner_id_foreign', ['partner_id'], 'partner', ['id'], cb =>
      cb.onDelete('cascade'),
    )
    .addColumn('partner_tier_id', 'integer', col => col.references('partner_tier.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint(
      'partner_subscription_partner_tier_id_foreign',
      ['partner_tier_id'],
      'partner_tier',
      ['id'],
      cb => cb.onDelete('cascade'),
    )
    .addColumn('start_date', 'timestamp')
    .addColumn('end_date', 'timestamp')
    .addCheckConstraint(
      'partner_subscription_start_date_end_date_constraint',
      sql`start_date <= end_date OR start_date IS NULL OR end_date IS NULL`,
    )
    .execute()

  await db.schema
    .createTable('user')
    .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('partner_id', 'integer', col => col.references('partner.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint('user_partner_id_foreign', ['partner_id'], 'partner', ['id'], cb => cb.onDelete('cascade'))
    .addColumn('name', 'varchar(255)', col => col.notNull())
    .addColumn('date_of_birth', 'date')
    .addColumn('phone_number', 'varchar(128)')
    .addColumn('email', 'varchar(255)')
    .addColumn('password', 'varchar(255)')
    .addColumn('role', sql`enum('super_admin', 'admin', 'editor', 'viewer')`, col => col.defaultTo('viewer').notNull())
    .addUniqueConstraint('user_partner_id_phone_number_unique', ['partner_id', 'phone_number'])
    .addUniqueConstraint('user_partner_id_email_unique', ['partner_id', 'email'])
    .addCheckConstraint('user_phone_number_or_email_constraint', sql`phone_number IS NOT NULL OR email IS NOT NULL`)
    .execute()

  await db.schema
    .createTable('user_tier')
    .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('name', 'varchar(255)', col => col.notNull().unique())
    .addColumn('points_required', 'integer')
    .addColumn('points_multiplier', 'decimal(8, 2)', col => col.defaultTo(1.0))
    .execute()

  await db.schema
    .createTable('user_subscription')
    .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('user_id', 'integer', col => col.references('user.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint('user_subscription_user_id_foreign', ['user_id'], 'user', ['id'], cb =>
      cb.onDelete('cascade'),
    )
    .addColumn('user_tier_id', 'integer', col => col.references('user_tier.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint('user_subscription_user_tier_id_foreign', ['user_tier_id'], 'user_tier', ['id'], cb =>
      cb.onDelete('cascade'),
    )
    .addColumn('start_date', 'timestamp')
    .addColumn('end_date', 'timestamp')
    .addCheckConstraint(
      'user_subscription_start_date_end_date_constraint',
      sql`start_date <= end_date OR start_date IS NULL OR end_date IS NULL`,
    )
    .execute()

  await db.schema
    .createTable('user_action')
    .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('name', 'varchar(255)', col => col.notNull().unique())
    .addColumn(
      'category',
      sql`enum('points_earned', 'points_spent', 'discount_percent_earned', 'discount_percent_spent', 'discount_value_earned', 'discount_value_spent')`,
      col => col.notNull(),
    )
    .execute()

  await db.schema
    .createTable('reward')
    .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('name', 'varchar(255)', col => col.notNull().unique())
    .addColumn('type', sql`enum('points', 'discount_percent', 'discount_value')`, col => col.notNull())
    .addColumn('value', 'decimal(8, 2)', col => col.notNull())
    .execute()

  await db.schema
    .createTable('coupon')
    .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('code', 'varchar(255)', col => col.notNull().unique())
    .addColumn('partner_id', 'integer', col => col.references('partner.id').onDelete('cascade'))
    .addForeignKeyConstraint('coupon_partner_id_foreign', ['partner_id'], 'partner', ['id'], cb =>
      cb.onDelete('cascade'),
    )
    .addColumn('user_id', 'integer', col => col.references('user.id').onDelete('cascade'))
    .addForeignKeyConstraint('coupon_user_id_foreign', ['user_id'], 'user', ['id'], cb => cb.onDelete('cascade'))
    .addColumn('reward_id', 'integer', col => col.references('reward.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint('coupon_reward_id_foreign', ['reward_id'], 'reward', ['id'], cb => cb.onDelete('cascade'))
    .addColumn('usage_count', 'integer')
    .addColumn('max_usage', 'integer')
    .addColumn('valid_from', 'timestamp')
    .addColumn('valid_to', 'timestamp')
    .addCheckConstraint(
      'coupon_usage_count_max_usage_constraint',
      sql`usage_count <= max_usage OR usage_count IS NULL OR max_usage IS NULL`,
    )
    .addCheckConstraint(
      'coupon_valid_from_valid_to_constraint',
      sql`valid_from <= valid_to OR valid_from IS NULL OR valid_to IS NULL`,
    )
    .execute()

  await db.schema
    .createTable('user_stat')
    .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('user_id', 'integer', col => col.references('user.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint('user_stat_user_id_foreign', ['user_id'], 'user', ['id'], cb => cb.onDelete('cascade'))
    .addColumn('points_earned', 'integer')
    .addColumn('points_spent', 'integer')
    .addCheckConstraint(
      'user_stat_points_earned_points_spent_constraint',
      sql`points_spent <= points_earned OR points_spent IS NULL OR points_earned IS NULL`,
    )
    .execute()

  await db.schema
    .createTable('user_transaction')
    .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('user_id', 'integer', col => col.references('user.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint('user_transaction_user_id_foreign', ['user_id'], 'user', ['id'], cb =>
      cb.onDelete('cascade'),
    )
    .addColumn('user_action_id', 'integer', col => col.references('user_action.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint('user_transaction_user_action_id_foreign', ['user_action_id'], 'user_action', ['id'], cb =>
      cb.onDelete('cascade'),
    )
    .execute()

  await db.schema
    .createTable('user_transaction_coupon')
    .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('user_transaction_id', 'integer', col =>
      col.references('user_transaction.id').notNull().onDelete('cascade'),
    )
    .addForeignKeyConstraint(
      'user_transaction_coupon_user_transaction_id_foreign',
      ['user_transaction_id'],
      'user_transaction',
      ['id'],
      cb => cb.onDelete('cascade'),
    )
    .addColumn('coupon_id', 'integer', col => col.references('coupon.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint('user_transaction_coupon_coupon_id_foreign', ['coupon_id'], 'coupon', ['id'], cb =>
      cb.onDelete('cascade'),
    )
    .addColumn('coupon_type', sql`enum('earned', 'spent')`, col => col.notNull())
    .execute()

  await db.schema
    .createTable('campaign')
    .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('partner_id', 'integer', col => col.references('partner.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint('campaign_partner_id_foreign', ['partner_id'], 'partner', ['id'], cb =>
      cb.onDelete('cascade'),
    )
    .addColumn('user_action_id', 'integer', col => col.references('user_action.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint('campaign_user_action_id_foreign', ['user_action_id'], 'user_action', ['id'], cb =>
      cb.onDelete('cascade'),
    )
    .addColumn('coupon_id', 'integer', col => col.references('coupon.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint('campaign_coupon_id_foreign', ['coupon_id'], 'coupon', ['id'], cb =>
      cb.onDelete('cascade'),
    )
    .execute()

  await db.schema
    .createTable('referral')
    .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
    .addColumn('referrer_id', 'integer', col => col.references('user.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint('referral_referrer_id_foreign', ['referrer_id'], 'user', ['id'], cb =>
      cb.onDelete('cascade'),
    )
    .addColumn('referred_id', 'integer', col => col.references('user.id').notNull().onDelete('cascade'))
    .addForeignKeyConstraint('referral_referred_id_foreign', ['referred_id'], 'user', ['id'], cb =>
      cb.onDelete('cascade'),
    )
    .addColumn('referrer_coupon_id', 'integer', col => col.references('coupon.id').onDelete('cascade'))
    .addForeignKeyConstraint('referral_referrer_coupon_id_foreign', ['referrer_coupon_id'], 'coupon', ['id'], cb =>
      cb.onDelete('cascade'),
    )
    .addColumn('referred_coupon_id', 'integer', col => col.references('coupon.id').onDelete('cascade'))
    .addForeignKeyConstraint('referral_referred_coupon_id_foreign', ['referred_coupon_id'], 'coupon', ['id'], cb =>
      cb.onDelete('cascade'),
    )
    .addColumn('referrer_coupon_usage_date', 'timestamp')
    .addColumn('referred_coupon_usage_date', 'timestamp')
    .execute()
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('referral').execute()
  await db.schema.dropTable('campaign').execute()
  await db.schema.dropTable('user_transaction_coupon').execute()
  await db.schema.dropTable('user_transaction').execute()
  await db.schema.dropTable('user_stat').execute()
  await db.schema.dropTable('coupon').execute()
  await db.schema.dropTable('reward').execute()
  await db.schema.dropTable('user_action').execute()
  await db.schema.dropTable('user_subscription').execute()
  await db.schema.dropTable('user_tier').execute()
  await db.schema.dropTable('user').execute()
  await db.schema.dropTable('partner_subscription').execute()
  await db.schema.dropTable('partner_tier').execute()
  await db.schema.dropTable('partner').execute()
}
