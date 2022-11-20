import Bootstrap from './bootstrap'
import GameOfLife from './game-of-life';

import AdvancedEvents from './advanced-events';

import ReactToolbar from './react-toolbar';

import ApplicationModes from './application-modes';
import BrowsingMode from './browsing-mode';
import DrawingMode from './drawing-mode';
import ExecutionMode from './execution-mode';
import SelectionMode from './selection-mode';

document.addEventListener('DOMContentLoaded', (e) => {
	const root = document.getElementById('app');

	const bootstrap = new Bootstrap(root);
	const gameOfLife = new GameOfLife(bootstrap);

	const events = new AdvancedEvents(bootstrap);

	const toolbar = new ReactToolbar(bootstrap);

	const modes = new ApplicationModes();
	const browsing = new BrowsingMode(toolbar, events, modes, gameOfLife);
	const drawing = new DrawingMode(modes, toolbar, events, gameOfLife, browsing);
	const selection = new SelectionMode(toolbar, modes, events, gameOfLife);
	const execution = new ExecutionMode(toolbar, gameOfLife, modes, events);
});
