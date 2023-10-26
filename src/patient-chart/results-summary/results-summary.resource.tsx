import { openmrsFetch } from "@openmrs/esm-framework";
import useSWR from "swr";
export interface ConceptResponse {
  uuid: string;
  display: string;
  name: Name;
  datatype: Datatype;
  conceptClass: ConceptClass;
  set: boolean;
  version: any;
  retired: boolean;
  names: Name2[];
  descriptions: Description[];
  mappings: Mapping[];
  answers: any[];
  setMembers: any[];
  auditInfo: AuditInfo;
  hiNormal: number;
  hiAbsolute: number;
  hiCritical: number;
  lowNormal: number;
  lowAbsolute: number;
  lowCritical: number;
  units: string;
  allowDecimal: boolean;
  displayPrecision: any;
  attributes: any[];
  links: Link[];
  resourceVersion: string;
}

export interface Name {
  display: string;
  uuid: string;
  name: string;
  locale: string;
  localePreferred: boolean;
  conceptNameType: string;
  links: Link[];
  resourceVersion: string;
}

export interface Link {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Datatype {
  uuid: string;
  display: string;
  name: string;
  description: string;
  hl7Abbreviation: string;
  retired: boolean;
  links: Link[];
  resourceVersion: string;
}

export interface ConceptClass {
  uuid: string;
  display: string;
  name: string;
  description: string;
  retired: boolean;
  links: Link[];
  resourceVersion: string;
}

export interface Name2 {
  display: string;
  uuid: string;
  name: string;
  locale: string;
  localePreferred: boolean;
  conceptNameType?: string;
  links: Link[];
  resourceVersion: string;
}

export interface Description {
  display: string;
  uuid: string;
  description: string;
  locale: string;
  links: Link[];
  resourceVersion: string;
}

export interface Mapping {
  display: string;
  uuid: string;
  conceptReferenceTerm: ConceptReferenceTerm;
  conceptMapType: ConceptMapType;
  links: Link[];
  resourceVersion: string;
}

export interface ConceptReferenceTerm {
  uuid: string;
  display: string;
  links: Link[];
}

export interface ConceptMapType {
  uuid: string;
  display: string;
  links: Link[];
}

export interface AuditInfo {
  creator: Creator;
  dateCreated: string;
  changedBy: ChangedBy;
  dateChanged: string;
}

export interface Creator {
  uuid: string;
  display: string;
  links: Link[];
}

export interface ChangedBy {
  uuid: string;
  display: string;
  links: Link[];
}

export function useGetConceptById(conceptUuid: string) {
  const apiUrl = `/ws/rest/v1/concept/${conceptUuid}?v=full`;
  const { data, error, isLoading } = useSWR<{ data: ConceptResponse }, Error>(
    apiUrl,
    openmrsFetch
  );
  return {
    concept: data?.data,
    isLoading,
    isError: error,
  };
}
