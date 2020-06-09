import _ from 'lodash'

type AsyncListener<T> = (arg: T) => Promise<any>
type SyncListener<T> = (arg: T) => any

type Listener<T> = AsyncListener<T> | SyncListener<T>

export class EventEmitter<T> {
  listeners: Listener<T>[] = []

  subscribe = (listener: Listener<T>) => {
    this.listeners.push(listener)
  }

  unsubscribe = (listener: Listener<T>) => {
    this.listeners = _.remove(this.listeners, (l) => l === listener)
  }

  emitSequenceAsync = (data: T) => {
    return this.listeners.reduce((acc, listener) =>
      acc.then((intermediate) => Promise.resolve(listener(intermediate)))
    , Promise.resolve(data))
  }

  emitSequenceSync = (data: T) => {
    return this.listeners.reduce((acc, listener) => listener(acc) as T, data) // unsafe here
  }

  emitAsync = (data: T) => {
    return this.listeners.reduce((acc, listener) =>
      acc.then(() => Promise.resolve(listener(data)))
    , Promise.resolve())
  }

  emitSync = (data: T) => {
    this.listeners.forEach((listener) => {
      listener(data)
    })
  }

  emitParallelAsync = (data: T) => {
    return Promise.all(this.listeners.map((listener) => listener(data)))
  }

  emitParallelSync = (data: T) => {
    return this.listeners.map((listener) => listener(data))
  }
}