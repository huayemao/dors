export function getActivityCardsFromSettingValue(settingItemValue: string): any[] {

  if (!settingItemValue) return [];

  try {
    const list = typeof settingItemValue === 'string'
      ? JSON.parse(settingItemValue)
      : settingItemValue;
    return Array.isArray(list) ? list.map((e) => JSON.parse(e)) : [];
  } catch (error) {
    console.error('解析 activity_cards 配置失败:', error);
    return [];
  }
}
