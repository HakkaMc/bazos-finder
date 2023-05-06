import { PubSub } from 'graphql-subscriptions'

export const pubSub = new PubSub()

export enum SubscriptionTrigger {
  IsRefreshing = 'IsRefreshing',
}
