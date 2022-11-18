import { subject } from '../utils/observable';

export default class ApplicationModes {
    public mode$ = subject('draw');

    public set = (mode) => {
        this.mode$.next(mode);
    };

    public get = () => {
        return this.mode$.get();
    };
};
