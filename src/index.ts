import Bootstrap from './core/bootstrap'
import Navigator from './core/navigator';
import GameOfLife from './core/game-of-life';
import AdvancedEvents from './core/advanced-events';
import ApplicationModes from './core/application-modes';

import ReactToolbar from './ui/react-toolbar';

import BrowsingMode from './modes/browsing-mode';
import DrawingMode from './modes/drawing-mode';
import ExecutionMode from './modes/execution-mode';
import SelectionMode from './modes/selection-mode';

document.addEventListener('DOMContentLoaded', (e) => {
	const root = document.getElementById('app');

	const bootstrap = new Bootstrap(root);
	const navigator = new Navigator(bootstrap);
	const gameOfLife = new GameOfLife(bootstrap, navigator);
	const events = new AdvancedEvents(bootstrap);
	const modes = new ApplicationModes();

	const toolbar = new ReactToolbar(bootstrap);

	const browsing = new BrowsingMode(toolbar, events, modes, gameOfLife, navigator);
	const drawing = new DrawingMode(modes, toolbar, events, gameOfLife, navigator);
	const selection = new SelectionMode(toolbar, modes, events, gameOfLife, navigator);
	const execution = new ExecutionMode(toolbar, gameOfLife, modes, events);
});
