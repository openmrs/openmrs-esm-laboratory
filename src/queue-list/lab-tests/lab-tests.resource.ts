import {
  FetchResponse,
  openmrsFetch,
  restBaseUrl,
  useConfig,
} from "@openmrs/esm-framework";
import useSWR from "swr";
import { EncounterResponse } from "../../patient-chart/laboratory-item/view-laboratory-item.resource";
export function useGetLabOrders(encounterUuid: string) {
  const apiUrl = `${restBaseUrl}/encounter/${encounterUuid}?v=full`;

  const { data, error, isLoading } = useSWR<{ data: EncounterResponse }, Error>(
    apiUrl,
    openmrsFetch
  );

  return {
    labOrders: data?.data ? data?.data?.orders : [],
    isLoading,
    isError: error,
  };
}
