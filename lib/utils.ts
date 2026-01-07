export function addCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getProjectPurposes(): string[] {
  // get the list of allowed project purposes from .env
  // if it includes "Other", remove "Other" from the list
  // then alphabetize the list and append Other at the end
  try {
    if (process.env.SCHEMA_PROJECT_PURPOSES) {
      const purposes = JSON.parse(process.env.SCHEMA_PROJECT_PURPOSES);
      const otherIndex = purposes.indexOf('Other');
      if (otherIndex >= 0) {
        purposes.splice(otherIndex);
      }
      purposes.sort();
      purposes.push('Other');
      return purposes;
    }
    return ['Other'];
  } catch (err) {
    console.log(
      `Error reading environment var SCHEMA_PROJECT_PURPOSES; invalid JSON array? Error: ${err}`
    );
    return ['Other'];
  }
}
