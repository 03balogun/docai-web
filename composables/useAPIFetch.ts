import {useFetch} from "#app"
import {FetchContext, FetchResponse} from "ofetch";
import {useAuthStore} from "~/store/auth";

type useFetchType = typeof useFetch

// wrap useFetch with configuration needed to talk to our API
export const useAPIFetch = <ResT, ErrorT>(path: string, options: any = {}) => {
    const config = useRuntimeConfig()

    // modify options as needed
    options.baseURL = config.public.API_BASE_URL

    // add auth token to headers
    const token = useAuthStore().token
    if (token) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    }

    return useFetch<ResT, ErrorT>(path, {
        ...options,
        onResponseError(context: FetchContext & { response: FetchResponse<{}> }): Promise<void> | void {
            if (context.response.status === 401) {
                // sign out user
                 useAuthStore().signOut();
            }
        }
    })
}
