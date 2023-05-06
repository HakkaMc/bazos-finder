import { pubSub, SubscriptionTrigger } from './pubSub'

export class Store {
  private static _isRefreshing = false

  static async setIsRefreshing(value: boolean) {
    this._isRefreshing = value
    await pubSub.publish(SubscriptionTrigger.IsRefreshing, value)
  }

  static get isRefreshing() {
    return this._isRefreshing
  }
}
