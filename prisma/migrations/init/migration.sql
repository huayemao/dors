-- 初始化Prisma迁移
-- 本迁移文件记录了我们手动对数据库进行的更改
-- 这样做是为了避免使用标准迁移命令导致的数据丢失

-- 以下是我们已经手动执行的SQL命令：
-- 1. 添加displayName字段（允许NULL）
-- ALTER TABLE File ADD COLUMN displayName VARCHAR(255) NULL;
-- 2. 将name字段的值复制到displayName字段
-- UPDATE File SET displayName = name;
-- 3. 将displayName字段设置为NOT NULL
-- ALTER TABLE File MODIFY COLUMN displayName VARCHAR(255) NOT NULL;

-- 注意：由于我们已经手动执行了这些更改，
-- 本迁移文件不包含需要执行的SQL命令
-- 它仅用于记录和版本控制