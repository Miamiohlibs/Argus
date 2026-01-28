export function addCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getProjectPurposes(): string[] {
  // get the list of allowed project purposes from .env
  // if it includes "Other", remove "Other" from the list
  // then alphabetize the list and append Other at the end
  try {
    if (process.env.NEXT_PUBLIC_PROJECT_PURPOSES) {
      console.log(process.env.NEXT_PUBLIC_PROJECT_PURPOSES);
      const purposes = JSON.parse(process.env.NEXT_PUBLIC_PROJECT_PURPOSES);
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
      `Error reading environment var NEXT_PUBLIC_PROJECT_PURPOSES; invalid JSON array? Error: ${err}`
    );
    return ['Bad options'];
  }
}

export function getSubjects(): string[] {
  // get the list of allowed project subjects from .env
  // if it includes "Other" or "None", remove "Other" from the list
  // then alphabetize the list and append Other at the end
  try {
    if (process.env.NEXT_PUBLIC_SUBJECT_LIST) {
      console.log(process.env.NEXT_PUBLIC_SUBJECT_LIST);
      const subjects = JSON.parse(process.env.NEXT_PUBLIC_SUBJECT_LIST);
      const otherIndex = subjects.indexOf('Other');
      if (otherIndex >= 0) {
        subjects.splice(otherIndex);
      }
      const noneIndex = subjects.indexOf('None');
      if (otherIndex >= 0) {
        subjects.splice(noneIndex);
      }
      subjects.sort();
      subjects.push('Other');
      return subjects;
    }
    return ['Other'];
  } catch (err) {
    console.log(
      `Error reading environment var NEXT_PUBLIC_SUBJECT_LIST; invalid JSON array? Error: ${err}`
    );
    return ['Bad options'];
  }
}
