/**
 * Focus trapping utility for accessibility (ARIA dialogs)
 */
export function handleModalTab(e: KeyboardEvent, modalElement: HTMLElement) {
  if (e.key !== "Tab") return;

  const focusableSelector =
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

  const focusables = Array.from(
    modalElement.querySelectorAll<HTMLElement>(focusableSelector),
  ).filter((el) => el.tabIndex >= 0);

  if (focusables.length === 0) {
    e.preventDefault();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (!first || !last) return;

  // If focus has escaped the modal, bring it back to the first focusable element
  if (
    document.activeElement !== modalElement &&
    !modalElement.contains(document.activeElement)
  ) {
    e.preventDefault();
    first.focus();
    return;
  }

  if (e.shiftKey) {
    // Shift + Tab: focus last element if currently at first
    if (document.activeElement === first) {
      last.focus();
      e.preventDefault();
    }
  } else {
    // Tab: focus first element if currently at last
    if (document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }
}
