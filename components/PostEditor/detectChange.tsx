"use client";

export const detectChange = (form: HTMLFormElement) => {
  const changedFields = [];
  const formData = new FormData(form);
  const inputs = Array.from(
    form.querySelectorAll("input, select, textarea")
  ) as (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[];
  // .concat(
  //   Array.from(
  //     topE.querySelectorAll(
  //       "input[form='post_form'], select[form='post_form'], textarea[form='post_form']"
  //     )
  //   )
  // );
  inputs.forEach((el) => {
    // @ts-ignore
    const formDataValue = el.multiple
      ? // @ts-ignore
      formData.getAll(el.name).sort().join(",")
      : // @ts-ignore
      formData.get(el.name);
    // @ts-ignore
    const originalValue = el.dataset.originalValue;

    if (el.id == "id" ||
      el.name == "updated_at" ||
      (el as HTMLInputElement).disabled) {
    } else if (String(originalValue) === String(formDataValue) ||
      !(el as HTMLInputElement).name) {
      el.disabled = true;
    } else {
      // @ts-ignore
      changedFields.push(el.name);
    }
    // console.log(el.name, originalValue, formDataValue);
  });

  // console.log(changedFields);
  if (!changedFields.length) {
    inputs.forEach((el) => {
      // @ts-ignore
      el.disabled = false;
    });
    return false;
  }
  return true;
};
