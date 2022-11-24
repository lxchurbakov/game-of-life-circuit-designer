import _ from 'lodash';

type AsyncListener<T> = (arg: T) => Promise<any>;
type SyncListener<T> = (arg: T) => any;

type Listener<T> = AsyncListener<T> | SyncListener<T>;

export class EventEmitter<T> {
	listeners: { listener: Listener<T>, priority: number }[] = [];

	subscribe = (listener: Listener<T>, priority: number = 0) => {
		this.listeners.push({ listener ,priority });
	};

	unsubscribe = (listener: Listener<T>) => {
		this.listeners = _.remove(this.listeners, (l) => l.listener === listener);
	};

	get = () => this.listeners.sort((a, b) => a.priority - b.priority).map((l) => l.listener);

	emitSequenceAsync = (data: T) => {
		return this.get().reduce((acc, listener) =>
			acc.then((intermediate) => Promise.resolve(listener(intermediate)))
			, Promise.resolve(data));
	};

	emitSequenceSync = (data: T) => {
		return this.get().reduce((acc, listener) => listener(acc) as T, data); // unsafe here
	};

	emitAsync = (data: T) => {
		return this.get().reduce((acc, listener) =>
			acc.then(() => Promise.resolve(listener(data)))
			, Promise.resolve());
	};

	emitSync = (data: T) => {
		this.get().forEach((listener) => {
			listener(data);
		});
	};

	emitParallelAsync = (data: T) => {
		return Promise.all(this.get().map((listener) => listener(data)));
	};

	emitParallelSync = (data: T) => {
		return this.get().map((listener) => listener(data));
	};
};
