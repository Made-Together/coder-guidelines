import cacheBustingString from "~/utils/cacheBustingString";
import useSWRImmutable from "swr/immutable";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useFetch(url = "") {
	return useSWRImmutable(cacheBustingString(url), fetcher);
}
