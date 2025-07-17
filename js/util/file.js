export function filePrompt({
  accept = '*/*',
  multiple = true,
  read = files => {},
}) {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = multiple;
  input.accept = accept;
  input.addEventListener('change', e => read(e.target.files));
  input.click();
}
