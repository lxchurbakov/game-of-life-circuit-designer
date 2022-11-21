import { subject } from '/src/utils/observable';
import { EventEmitter } from '/src/utils/events';

export default class ApplicationModes {
    public mode$ = subject('draw' as string);
    public onModeChange = new EventEmitter<{ before: string, after: string }>();

    public set = (after: string) => {
        const before = this.mode$.get();
        this.mode$.next(after);
        this.onModeChange.emitParallelSync({ before, after });
    };

    public get = () => {
        return this.mode$.get() as string;
    };
};
