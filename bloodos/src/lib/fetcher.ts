
/**
 * Generic SWR fetcher utility.
 *
 * Usage:
 *   useSWR('/api/users', fetcher)
 *
 * - Throws on non-2xx responses so SWR catches it in the `error` state
 * - Returns parsed JSON body
 */
export async function fetcher<T = unknown>(url: string): Promise<T> {
    const res = await fetch(url, {
        headers: {
            // Attach auth token from cookie if present
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const error = new Error(errorBody?.message || `API Error: ${res.status} ${res.statusText}`) as Error & {
            status: number;
            info: unknown;
        };
        error.status = res.status;
        error.info = errorBody;
        throw error;
    }

    const json = await res.json();
    // Unwrap BloodOS standard response envelope: { success, data, message }
    return json.data ?? json;
}
