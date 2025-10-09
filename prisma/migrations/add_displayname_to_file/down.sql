-- 回滚添加displayName字段的迁移
-- 这个文件包含了撤销add_displayname_to_file迁移的SQL命令
-- 注意：在生产环境中执行此操作会导致所有displayName数据丢失

-- 从File表中删除displayName字段
ALTER TABLE File DROP COLUMN displayName;