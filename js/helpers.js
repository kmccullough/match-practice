import { expands } from './helper/expands.js';
import { linkTo } from './helper/link-to.js';
import { helpers } from './service/helpers.js';

helpers
  .register('[data-link-to]', linkTo)
  .register('[data-expands]', expands);
