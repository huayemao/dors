-- 添加displayName字段到File表
-- 这个迁移文件包含了添加displayName字段的完整SQL命令
-- 在当前环境中，这些更改已经通过手动执行SQL命令完成
-- 但这个文件可以用于在其他环境中应用相同的更改

-- 1. 首先添加允许NULL的displayName字段
ALTER TABLE File ADD COLUMN displayName VARCHAR(255) NULL;

-- 2. 将name字段的值复制到displayName字段
UPDATE File SET displayName = name;

-- 3. 最后将displayName字段设置为NOT NULL
ALTER TABLE File MODIFY COLUMN displayName VARCHAR(255) NOT NULL;