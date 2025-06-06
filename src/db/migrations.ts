import { Kysely, Migration, MigrationProvider } from 'kysely'
import { Database } from '.'

const migrations: Record<string, Migration> = {}

export const migrationProvider: MigrationProvider = {
  async getMigrations() {
    return migrations
  },
}

migrations['001'] = {
  async up(db: Database) {
    await db.schema
      .createTable('post')
      .addColumn('uri', 'varchar', (col) => col.primaryKey())
      .addColumn('cid', 'varchar', (col) => col.notNull())
      .addColumn('replyParent', 'varchar')
      .addColumn('replyRoot', 'varchar')
      .addColumn('indexedAt', 'varchar', (col) => col.notNull())
      .execute()
    await db.schema
      .createTable('sub_state')
      .addColumn('service', 'varchar', (col) => col.primaryKey())
      .addColumn('cursor', 'integer', (col) => col.notNull())
      .execute()
  },
  async down(db: Database) {
    await db.schema.dropTable('post').execute()
    await db.schema.dropTable('sub_state').execute()
  },
}

migrations['002'] = {
  async up(db: Database) {
    await db.schema
      .alterTable('post')
      .addColumn('feed', 'varchar', (col) => col.notNull().defaultTo('dungeonsynth'))
      .execute()
  },
  async down(db: Database) {
    await db.schema
      .alterTable('post')
      .dropColumn('feed')
      .execute()
  },
}

migrations['003'] = {
  async up(db: Database) {
    await db.schema
      .alterTable('post')
      .addColumn('text', 'text')
      .execute()
  },
  async down(db: Database) {
    await db.schema
      .alterTable('post')
      .dropColumn('text')
      .execute()
  },
}