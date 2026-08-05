export function getCallNumberFromInstance(instance: any) {
  let callNumber;
  const type_2 = instance.sub_container?.type_2 as string;
  const indicator_2 = instance.sub_container?.indicator_2 ?? null;
  const type = instance.sub_container?.top_container?._resolved?.type as string;
  const indicator =
    instance.sub_container?.top_container?._resolved?.indicator ?? null;
  if (type && indicator && indicator_2) {
    const capitalType = type.charAt(0).toUpperCase() + type.slice(1);
    const capitalType2 = type_2.charAt(0).toUpperCase() + type_2.slice(1);
    callNumber = `${capitalType} ${indicator}`;
    if (type_2 && indicator_2) {
      const capitalType2 = type_2.charAt(0).toUpperCase() + type_2.slice(1);
      callNumber += `, ${capitalType2} ${indicator_2}`;
    }
    return callNumber;
  }
}
