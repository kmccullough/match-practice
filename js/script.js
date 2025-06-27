const inputTermsEl = document.querySelector('#tpl-input-terms')
  .content.cloneNode(true)
  .querySelector('.input-terms');
const termsEl = document.querySelector('#tpl-terms')
  .content.cloneNode(true)
  .querySelector('.terms');
const inputTermRowTpl = document.querySelector('#tpl-input-term-row');
const termRowTpl = document.querySelector('#tpl-term-row');
const termTpl = document.querySelector('#tpl-term');
const mainEl = document.querySelector('main');
mainEl.append(inputTermsEl, termsEl);

for (let i = 0; i < 5; ++i) {
  const term = String.fromCharCode('a'.charCodeAt(0) + i);
  const match = String.fromCharCode('A'.charCodeAt(0) + i);

  const inputTermRowFragment = inputTermRowTpl.content.cloneNode(true);
  const inputTermEl =  inputTermRowFragment.querySelector('.input-term input');
  const inputMatchEl =  inputTermRowFragment.querySelector('.input-match input');
  inputTermEl.value = term;
  inputMatchEl.value = match;
  inputTermsEl.append(inputTermRowFragment);

  const termRowFragment = termRowTpl.content.cloneNode(true);
  const termRowEl = termRowFragment.querySelector('.term-row');
  const termFragment1 = termTpl.content.cloneNode(true);
  const termEl1 = termFragment1.querySelector('.term');
  termEl1.innerText = term;
  const termFragment2 = termTpl.content.cloneNode(true);
  const termEl2 = termFragment2.querySelector('.term');
  termEl2.innerText = match;
  termRowEl.append(termFragment1, termFragment2);
  termsEl.append(termRowFragment);
}
