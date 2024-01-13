# Migration from TypeORM in NestJS

This repository contains the migration process for transitioning from TypeORM to a different database library in a NestJS application. The migration process involves transferring the existing database operations, configurations, and models from TypeORM to the new library.

## Migration Steps

Here are the steps to migrate your project whenever there are changes in the entity:

1. **Build the new source**: Run the following command to build the new source code:

```sh
npm run build
```

2. **Generate the migration file**: After building the new source, generate the migration file. Replace `<name>` with the name of your migration:

```sh
npm run migration:generate -- -n <name>
```

3. **Run the migration**: Apply the migration to the database with the following command:

```sh
npm run migration:run
```

4. **Revert the migration (if needed)**: If you need to revert the migration, you can do so with the following command:

```sh
npm run migration:revert
```

Please replace `<name>` with the name of your migration. The name should be descriptive of the changes you're making. For example, if you're adding a new column to the users table, you might name your migration `AddColumnToUsers`.
