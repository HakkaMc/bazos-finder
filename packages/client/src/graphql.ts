import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type GetCarsCar = {
  __typename?: 'GetCarsCar';
  description?: Maybe<Scalars['String']>;
  engine?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  imgBase64: Scalars['String'];
  imgUrl: Scalars['String'];
  invalid?: Maybe<Scalars['Boolean']>;
  link: Scalars['String'];
  location: Scalars['String'];
  modified?: Maybe<Scalars['Boolean']>;
  power?: Maybe<Scalars['Float']>;
  price: Scalars['Float'];
  publishedAt: Scalars['Float'];
  tacho?: Maybe<Scalars['Float']>;
  tags?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  vendor: Scalars['String'];
  year?: Maybe<Scalars['Float']>;
};

export type GetCarsCarGallery = {
  __typename?: 'GetCarsCarGallery';
  imgBase64?: Maybe<Scalars['String']>;
  imgUrl?: Maybe<Scalars['String']>;
  previewBase64?: Maybe<Scalars['String']>;
  previewUrl?: Maybe<Scalars['String']>;
};

export type GetCarsFilter = {
  engine?: InputMaybe<Scalars['String']>;
  favourite: Scalars['Boolean'];
  powerFrom: Scalars['Float'];
  powerTo: Scalars['Float'];
  priceFrom: Scalars['Float'];
  priceTo: Scalars['Float'];
  sortBy: Scalars['String'];
  tachoTo: Scalars['Float'];
  textFilter?: InputMaybe<Scalars['String']>;
  yearFrom: Scalars['Float'];
  yearTo: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  downloadImages: Scalars['String'];
  hideCar: Scalars['String'];
  parseCarDetails: Scalars['String'];
  reinitCars: Scalars['String'];
  updateField: Scalars['String'];
};


export type MutationDownloadImagesArgs = {
  carId: Scalars['String'];
};


export type MutationHideCarArgs = {
  carId: Scalars['String'];
};


export type MutationReinitCarsArgs = {
  force: Scalars['Boolean'];
};


export type MutationUpdateFieldArgs = {
  carId: Scalars['String'];
  field: Scalars['String'];
  value: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getCar?: Maybe<GetCarsCar>;
  getCarGallery?: Maybe<Array<Maybe<GetCarsCarGallery>>>;
  getCars?: Maybe<Array<Maybe<GetCarsCar>>>;
  hello: Scalars['String'];
};


export type QueryGetCarArgs = {
  carId: Scalars['String'];
};


export type QueryGetCarGalleryArgs = {
  carId: Scalars['String'];
};


export type QueryGetCarsArgs = {
  filter?: InputMaybe<GetCarsFilter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  isRefreshing: Scalars['Boolean'];
};

export type GetCarsQueryVariables = Exact<{
  filter?: InputMaybe<GetCarsFilter>;
}>;


export type GetCarsQuery = { __typename?: 'Query', getCars?: Array<{ __typename?: 'GetCarsCar', id: string, link: string, title: string, imgUrl: string, imgBase64: string, price: number, location: string, publishedAt: number, power?: number | null, engine?: string | null, tacho?: number | null, year?: number | null, description?: string | null, favourite?: boolean | null, tags?: Array<string> | null } | null> | null };

export type GetCarQueryVariables = Exact<{
  carId: Scalars['String'];
}>;


export type GetCarQuery = { __typename?: 'Query', getCar?: { __typename?: 'GetCarsCar', id: string, link: string, title: string, imgUrl: string, imgBase64: string, price: number, location: string, publishedAt: number, power?: number | null, engine?: string | null, tacho?: number | null, year?: number | null, description?: string | null, favourite?: boolean | null, tags?: Array<string> | null } | null };

export type GetCarPreviewGalleryQueryVariables = Exact<{
  carId: Scalars['String'];
}>;


export type GetCarPreviewGalleryQuery = { __typename?: 'Query', getCarGallery?: Array<{ __typename?: 'GetCarsCarGallery', previewUrl?: string | null, previewBase64?: string | null } | null> | null };

export type GetCarGalleryQueryVariables = Exact<{
  carId: Scalars['String'];
}>;


export type GetCarGalleryQuery = { __typename?: 'Query', getCarGallery?: Array<{ __typename?: 'GetCarsCarGallery', imgUrl?: string | null, imgBase64?: string | null, previewUrl?: string | null, previewBase64?: string | null } | null> | null };

export type HideCarMutationVariables = Exact<{
  carId: Scalars['String'];
}>;


export type HideCarMutation = { __typename?: 'Mutation', hideCar: string };

export type ReinitCarsMutationVariables = Exact<{
  force: Scalars['Boolean'];
}>;


export type ReinitCarsMutation = { __typename?: 'Mutation', reinitCars: string };

export type ParseCarDetailsMutationVariables = Exact<{ [key: string]: never; }>;


export type ParseCarDetailsMutation = { __typename?: 'Mutation', parseCarDetails: string };

export type UpdateFieldMutationVariables = Exact<{
  carId: Scalars['String'];
  field: Scalars['String'];
  value: Scalars['String'];
}>;


export type UpdateFieldMutation = { __typename?: 'Mutation', updateField: string };

export type DownloadImagesMutationVariables = Exact<{
  carId: Scalars['String'];
}>;


export type DownloadImagesMutation = { __typename?: 'Mutation', downloadImages: string };

export type IsRefreshingSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type IsRefreshingSubscription = { __typename?: 'Subscription', isRefreshing: boolean };


export const GetCarsDocument = gql`
    query getCars($filter: GetCarsFilter) {
  getCars(filter: $filter) {
    id
    link
    title
    imgUrl
    imgBase64
    price
    location
    publishedAt
    power
    engine
    tacho
    year
    description
    favourite
    tags
  }
}
    `;

/**
 * __useGetCarsQuery__
 *
 * To run a query within a React component, call `useGetCarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCarsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetCarsQuery(baseOptions?: Apollo.QueryHookOptions<GetCarsQuery, GetCarsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCarsQuery, GetCarsQueryVariables>(GetCarsDocument, options);
      }
export function useGetCarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCarsQuery, GetCarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCarsQuery, GetCarsQueryVariables>(GetCarsDocument, options);
        }
export type GetCarsQueryHookResult = ReturnType<typeof useGetCarsQuery>;
export type GetCarsLazyQueryHookResult = ReturnType<typeof useGetCarsLazyQuery>;
export type GetCarsQueryResult = Apollo.QueryResult<GetCarsQuery, GetCarsQueryVariables>;
export const GetCarDocument = gql`
    query getCar($carId: String!) {
  getCar(carId: $carId) {
    id
    link
    title
    imgUrl
    imgBase64
    price
    location
    publishedAt
    power
    engine
    tacho
    year
    description
    favourite
    tags
  }
}
    `;

/**
 * __useGetCarQuery__
 *
 * To run a query within a React component, call `useGetCarQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCarQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCarQuery({
 *   variables: {
 *      carId: // value for 'carId'
 *   },
 * });
 */
export function useGetCarQuery(baseOptions: Apollo.QueryHookOptions<GetCarQuery, GetCarQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCarQuery, GetCarQueryVariables>(GetCarDocument, options);
      }
export function useGetCarLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCarQuery, GetCarQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCarQuery, GetCarQueryVariables>(GetCarDocument, options);
        }
export type GetCarQueryHookResult = ReturnType<typeof useGetCarQuery>;
export type GetCarLazyQueryHookResult = ReturnType<typeof useGetCarLazyQuery>;
export type GetCarQueryResult = Apollo.QueryResult<GetCarQuery, GetCarQueryVariables>;
export const GetCarPreviewGalleryDocument = gql`
    query getCarPreviewGallery($carId: String!) {
  getCarGallery(carId: $carId) {
    previewUrl
    previewBase64
  }
}
    `;

/**
 * __useGetCarPreviewGalleryQuery__
 *
 * To run a query within a React component, call `useGetCarPreviewGalleryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCarPreviewGalleryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCarPreviewGalleryQuery({
 *   variables: {
 *      carId: // value for 'carId'
 *   },
 * });
 */
export function useGetCarPreviewGalleryQuery(baseOptions: Apollo.QueryHookOptions<GetCarPreviewGalleryQuery, GetCarPreviewGalleryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCarPreviewGalleryQuery, GetCarPreviewGalleryQueryVariables>(GetCarPreviewGalleryDocument, options);
      }
export function useGetCarPreviewGalleryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCarPreviewGalleryQuery, GetCarPreviewGalleryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCarPreviewGalleryQuery, GetCarPreviewGalleryQueryVariables>(GetCarPreviewGalleryDocument, options);
        }
export type GetCarPreviewGalleryQueryHookResult = ReturnType<typeof useGetCarPreviewGalleryQuery>;
export type GetCarPreviewGalleryLazyQueryHookResult = ReturnType<typeof useGetCarPreviewGalleryLazyQuery>;
export type GetCarPreviewGalleryQueryResult = Apollo.QueryResult<GetCarPreviewGalleryQuery, GetCarPreviewGalleryQueryVariables>;
export const GetCarGalleryDocument = gql`
    query getCarGallery($carId: String!) {
  getCarGallery(carId: $carId) {
    imgUrl
    imgBase64
    previewUrl
    previewBase64
  }
}
    `;

/**
 * __useGetCarGalleryQuery__
 *
 * To run a query within a React component, call `useGetCarGalleryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCarGalleryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCarGalleryQuery({
 *   variables: {
 *      carId: // value for 'carId'
 *   },
 * });
 */
export function useGetCarGalleryQuery(baseOptions: Apollo.QueryHookOptions<GetCarGalleryQuery, GetCarGalleryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCarGalleryQuery, GetCarGalleryQueryVariables>(GetCarGalleryDocument, options);
      }
export function useGetCarGalleryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCarGalleryQuery, GetCarGalleryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCarGalleryQuery, GetCarGalleryQueryVariables>(GetCarGalleryDocument, options);
        }
export type GetCarGalleryQueryHookResult = ReturnType<typeof useGetCarGalleryQuery>;
export type GetCarGalleryLazyQueryHookResult = ReturnType<typeof useGetCarGalleryLazyQuery>;
export type GetCarGalleryQueryResult = Apollo.QueryResult<GetCarGalleryQuery, GetCarGalleryQueryVariables>;
export const HideCarDocument = gql`
    mutation hideCar($carId: String!) {
  hideCar(carId: $carId)
}
    `;
export type HideCarMutationFn = Apollo.MutationFunction<HideCarMutation, HideCarMutationVariables>;

/**
 * __useHideCarMutation__
 *
 * To run a mutation, you first call `useHideCarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHideCarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [hideCarMutation, { data, loading, error }] = useHideCarMutation({
 *   variables: {
 *      carId: // value for 'carId'
 *   },
 * });
 */
export function useHideCarMutation(baseOptions?: Apollo.MutationHookOptions<HideCarMutation, HideCarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HideCarMutation, HideCarMutationVariables>(HideCarDocument, options);
      }
export type HideCarMutationHookResult = ReturnType<typeof useHideCarMutation>;
export type HideCarMutationResult = Apollo.MutationResult<HideCarMutation>;
export type HideCarMutationOptions = Apollo.BaseMutationOptions<HideCarMutation, HideCarMutationVariables>;
export const ReinitCarsDocument = gql`
    mutation reinitCars($force: Boolean!) {
  reinitCars(force: $force)
}
    `;
export type ReinitCarsMutationFn = Apollo.MutationFunction<ReinitCarsMutation, ReinitCarsMutationVariables>;

/**
 * __useReinitCarsMutation__
 *
 * To run a mutation, you first call `useReinitCarsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReinitCarsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reinitCarsMutation, { data, loading, error }] = useReinitCarsMutation({
 *   variables: {
 *      force: // value for 'force'
 *   },
 * });
 */
export function useReinitCarsMutation(baseOptions?: Apollo.MutationHookOptions<ReinitCarsMutation, ReinitCarsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReinitCarsMutation, ReinitCarsMutationVariables>(ReinitCarsDocument, options);
      }
export type ReinitCarsMutationHookResult = ReturnType<typeof useReinitCarsMutation>;
export type ReinitCarsMutationResult = Apollo.MutationResult<ReinitCarsMutation>;
export type ReinitCarsMutationOptions = Apollo.BaseMutationOptions<ReinitCarsMutation, ReinitCarsMutationVariables>;
export const ParseCarDetailsDocument = gql`
    mutation parseCarDetails {
  parseCarDetails
}
    `;
export type ParseCarDetailsMutationFn = Apollo.MutationFunction<ParseCarDetailsMutation, ParseCarDetailsMutationVariables>;

/**
 * __useParseCarDetailsMutation__
 *
 * To run a mutation, you first call `useParseCarDetailsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useParseCarDetailsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [parseCarDetailsMutation, { data, loading, error }] = useParseCarDetailsMutation({
 *   variables: {
 *   },
 * });
 */
export function useParseCarDetailsMutation(baseOptions?: Apollo.MutationHookOptions<ParseCarDetailsMutation, ParseCarDetailsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ParseCarDetailsMutation, ParseCarDetailsMutationVariables>(ParseCarDetailsDocument, options);
      }
export type ParseCarDetailsMutationHookResult = ReturnType<typeof useParseCarDetailsMutation>;
export type ParseCarDetailsMutationResult = Apollo.MutationResult<ParseCarDetailsMutation>;
export type ParseCarDetailsMutationOptions = Apollo.BaseMutationOptions<ParseCarDetailsMutation, ParseCarDetailsMutationVariables>;
export const UpdateFieldDocument = gql`
    mutation updateField($carId: String!, $field: String!, $value: String!) {
  updateField(carId: $carId, field: $field, value: $value)
}
    `;
export type UpdateFieldMutationFn = Apollo.MutationFunction<UpdateFieldMutation, UpdateFieldMutationVariables>;

/**
 * __useUpdateFieldMutation__
 *
 * To run a mutation, you first call `useUpdateFieldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFieldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFieldMutation, { data, loading, error }] = useUpdateFieldMutation({
 *   variables: {
 *      carId: // value for 'carId'
 *      field: // value for 'field'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useUpdateFieldMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFieldMutation, UpdateFieldMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFieldMutation, UpdateFieldMutationVariables>(UpdateFieldDocument, options);
      }
export type UpdateFieldMutationHookResult = ReturnType<typeof useUpdateFieldMutation>;
export type UpdateFieldMutationResult = Apollo.MutationResult<UpdateFieldMutation>;
export type UpdateFieldMutationOptions = Apollo.BaseMutationOptions<UpdateFieldMutation, UpdateFieldMutationVariables>;
export const DownloadImagesDocument = gql`
    mutation downloadImages($carId: String!) {
  downloadImages(carId: $carId)
}
    `;
export type DownloadImagesMutationFn = Apollo.MutationFunction<DownloadImagesMutation, DownloadImagesMutationVariables>;

/**
 * __useDownloadImagesMutation__
 *
 * To run a mutation, you first call `useDownloadImagesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDownloadImagesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [downloadImagesMutation, { data, loading, error }] = useDownloadImagesMutation({
 *   variables: {
 *      carId: // value for 'carId'
 *   },
 * });
 */
export function useDownloadImagesMutation(baseOptions?: Apollo.MutationHookOptions<DownloadImagesMutation, DownloadImagesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DownloadImagesMutation, DownloadImagesMutationVariables>(DownloadImagesDocument, options);
      }
export type DownloadImagesMutationHookResult = ReturnType<typeof useDownloadImagesMutation>;
export type DownloadImagesMutationResult = Apollo.MutationResult<DownloadImagesMutation>;
export type DownloadImagesMutationOptions = Apollo.BaseMutationOptions<DownloadImagesMutation, DownloadImagesMutationVariables>;
export const IsRefreshingDocument = gql`
    subscription isRefreshing {
  isRefreshing
}
    `;

/**
 * __useIsRefreshingSubscription__
 *
 * To run a query within a React component, call `useIsRefreshingSubscription` and pass it any options that fit your needs.
 * When your component renders, `useIsRefreshingSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsRefreshingSubscription({
 *   variables: {
 *   },
 * });
 */
export function useIsRefreshingSubscription(baseOptions?: Apollo.SubscriptionHookOptions<IsRefreshingSubscription, IsRefreshingSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<IsRefreshingSubscription, IsRefreshingSubscriptionVariables>(IsRefreshingDocument, options);
      }
export type IsRefreshingSubscriptionHookResult = ReturnType<typeof useIsRefreshingSubscription>;
export type IsRefreshingSubscriptionResult = Apollo.SubscriptionResult<IsRefreshingSubscription>;