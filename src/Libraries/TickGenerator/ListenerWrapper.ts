import {IListener, IObserver, ISubscriptionLike} from "evg_observable/src/outLib/Types";
import {IListenerWrapper} from "./Types";
import {EState} from "./Env";
import {Observable} from "evg_observable/src/outLib/Observable";

export class ListenerWrapper implements IListenerWrapper {
    private $before: IObserver<EState>;
    private $main: IObserver<EState>;
    private $after: IObserver<EState>;
    private subscription: ISubscriptionLike<EState> | undefined;

    constructor($main: IObserver<EState>, callback: IListener<EState>) {
        this.$main = $main;
        this.$before = new Observable(EState.INIT);
        this.$after = new Observable(EState.INIT);

        const mainCallback: IListener<EState> = (value?: EState) => {
            this.$before.next(value);
            callback(value);
            this.$after.next(value);
        };

        this.subscription = this.$main.subscribe(mainCallback);
    }

    subscribeBefore(callback: IListener<EState>): ISubscriptionLike<EState> | undefined {
        if (!this.$before) return undefined;
        return this.$before.subscribe(callback);
    }

    subscribeAfter(callback: IListener<EState>): ISubscriptionLike<EState> | undefined {
        if (!this.$after) return undefined;
        return this.$after.subscribe(callback);
    }

    unsubscribe(): void {
        this.$before.unsubscribeAll();
        this.$after.unsubscribeAll();
        if (this.$before) this.$before.destroy();
        if (this.$after) this.$after.destroy();
        if (this.subscription) this.subscription.unsubscribe();
        this.$before = <any>0;
        this.$after = <any>0;
        this.subscription = <any>0;
    }
}