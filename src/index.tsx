/* @refresh reload */
import { render } from 'solid-js/web';

import invariant from 'tiny-invariant';
import './index.css';
import { List } from './list';

const root = document.getElementById('root');
invariant(root, 'Unable to find #root element');

render(() => <List />, root);
