# Prisma 迁移指南

本项目已设置Prisma迁移系统来管理数据库结构变化。以下是使用指南：

## 迁移文件说明

- `init/`: 初始化迁移，记录了数据库的初始状态
- `add_displayname_to_file/`: 添加displayName字段到File表的迁移
  - `migration.sql`: 包含添加displayName字段的SQL命令
  - `down.sql`: 包含回滚迁移的SQL命令
  - `schema.prisma.orig`: 迁移前的schema状态
- `migration_lock.toml`: 记录已应用的迁移

## 注意事项

由于我们已经手动执行了添加displayName字段的SQL命令，这些迁移文件主要用于：

1. **版本控制**: 记录数据库结构的变化历史
2. **环境同步**: 在其他环境中应用相同的更改
3. **标准化工作流**: 为将来的数据库更改提供标准流程

## 常用命令

### 检查迁移状态
```bash
npx prisma migrate status
```

### 应用新的迁移
```bash
npx prisma migrate deploy
```

### 创建新的迁移
```bash
npx prisma migrate dev --name migration_name
```

### 生成Prisma Client
```bash
npx prisma generate
```

### 查看数据库数据
```bash
npx prisma studio
```

## 重要提示

- 直接修改数据库结构后，应同步更新schema.prisma文件
- 创建新的迁移前，确保schema.prisma文件与数据库结构匹配
- 在生产环境中，使用`migrate deploy`而不是`migrate dev`
- 迁移文件应提交到版本控制系统中