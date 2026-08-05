import logger from '@/lib/logger';
export function getCallNumberFromInstance(instance: any) {
  logger.debug(
    `getting call number from instance: ${JSON.stringify(instance)}`,
  );
  let callNumber;
  const type_2 = instance.sub_container?.type_2 as string;
  const indicator_2 = instance.sub_container?.indicator_2 ?? null;
  const type = instance.sub_container?.top_container?._resolved?.type as string;
  const indicator =
    instance.sub_container?.top_container?._resolved?.indicator ?? null;
  if (type && indicator) {
    logger.debug(
      `examining type: ${type}, indicator: ${indicator} for call number`,
    );
    const capitalType = type.charAt(0).toUpperCase() + type.slice(1);
    callNumber = `${capitalType} ${indicator}`;
    if (type_2 && indicator_2 && !indicator_2.match(/data_value_missing/)) {
      // if empty, indicator_2 sometimes set as data_value_missing...
      const capitalType2 = type_2.charAt(0).toUpperCase() + type_2.slice(1);
      callNumber += `, ${capitalType2} ${indicator_2}`;
    }
  } else {
    callNumber =
      instance.sub_container?.top_container?._resolved?.display_string ??
      instance.sub_container?.top_container?._resolved.indicator;
  }
  return callNumber;
}
