/*
* This file was generated by a tool.x
* Rerun sql-ts to regenerate this file.
*/
import { ReportConfig } from './models-extra';

export interface AccessRequest {
  'approved'?: boolean | null;
  'createdTime'?: Date;
  'entityId'?: string | null;
  'id': string;
  'message'?: string | null;
  'note'?: string | null;
  'permissionGroupId'?: string | null;
  'processedBy'?: string | null;
  'processedDate'?: Date | null;
  'projectId'?: string | null;
  'userId'?: string | null;
}
export interface AdminPanelSession {
  'accessPolicy': any;
  'accessToken': string;
  'accessTokenExpiry': string;
  'email': string;
  'id': string;
  'refreshToken': string;
}
export interface Analytics {
  'answerEntityMRow'?: string | null;
  'answerMRow'?: string | null;
  'dataElementCode'?: string | null;
  'dataElementMRow'?: string | null;
  'dataGroupCode'?: string | null;
  'date'?: Date | null;
  'dayPeriod'?: string | null;
  'entityCode'?: string | null;
  'entityMRow'?: string | null;
  'entityName'?: string | null;
  'eventId'?: string | null;
  'monthPeriod'?: string | null;
  'questionMRow'?: string | null;
  'surveyMRow'?: string | null;
  'surveyResponseMRow'?: string | null;
  'type'?: string | null;
  'value'?: string | null;
  'weekPeriod'?: string | null;
  'yearPeriod'?: string | null;
}
export interface AncestorDescendantRelation {
  'ancestorId': string;
  'descendantId': string;
  'entityHierarchyId': string;
  'generationalDistance': number;
  'id': string;
}
export interface Answer {
  'id': string;
  'mRow'?: string;
  'questionId': string;
  'surveyResponseId': string;
  'text'?: string | null;
  'type': string;
}
export interface ApiClient {
  'id': string;
  'secretKeyHash': string;
  'userAccountId'?: string | null;
  'username': string;
}
export interface ApiRequestLog {
  'api': string;
  'endpoint': string;
  'id': string;
  'metadata'?: any | null;
  'method'?: string | null;
  'query'?: any | null;
  'refreshToken'?: string | null;
  'requestTime'?: Date | null;
  'userId'?: string | null;
  'version': number;
}
export interface Clinic {
  'categoryCode'?: string | null;
  'code': string;
  'countryId': string;
  'geographicalAreaId': string;
  'id': string;
  'name': string;
  'type'?: string | null;
  'typeName'?: string | null;
}
export interface Comment {
  'createdTime'?: Date;
  'id': string;
  'lastModifiedTime'?: Date;
  'text': string;
  'userId'?: string | null;
}
export interface Country {
  'code': string;
  'id': string;
  'name': string;
}
export interface Dashboard {
  'code': string;
  'id': string;
  'name': string;
  'rootEntityCode': string;
  'sortOrder'?: number | null;
}
export interface DashboardItem {
  'code': string;
  'config'?: any;
  'id': string;
  'legacy'?: boolean;
  'reportCode'?: string | null;
}
export interface DashboardRelation {
  'childId': string;
  'dashboardId': string;
  'entityTypes': any;
  'id': string;
  'permissionGroups': string[];
  'projectCodes': string[];
  'sortOrder'?: number | null;
}
export interface DataElement {
  'code': string;
  'config'?: any;
  'id': string;
  'mRow'?: string;
  'permissionGroups'?: string[];
  'serviceType': ServiceType;
}
export interface DataElementDataGroup {
  'dataElementId': string;
  'dataGroupId': string;
  'id': string;
}
export interface DataElementDataService {
  'countryCode': string;
  'dataElementCode': string;
  'id': string;
  'serviceConfig'?: any;
  'serviceType': ServiceType;
}
export interface DataGroup {
  'code': string;
  'config'?: any;
  'id': string;
  'serviceType': ServiceType;
}
export interface DataServiceEntity {
  'config': any;
  'entityCode': string;
  'id': string;
}
export interface DataServiceSyncGroup {
  'code': string;
  'config': any;
  'dataGroupCode': string;
  'id': string;
  'serviceType': ServiceType;
  'syncCursor'?: string | null;
  'syncStatus'?: SyncGroupSyncStatus | null;
}
export interface DataTable {
  'code': string;
  'config'?: any;
  'description'?: string | null;
  'id': string;
  'permissionGroups'?: string[];
  'type': DataTableType;
}
export interface DhisInstance {
  'code': string;
  'config': any;
  'id': string;
  'readonly': boolean;
}
export interface DhisSyncLog {
  'data'?: string | null;
  'deleted'?: number | null;
  'dhisReference'?: string | null;
  'errorList'?: string | null;
  'id': string;
  'ignored'?: number | null;
  'imported'?: number | null;
  'recordId': string;
  'recordType': string;
  'updated'?: number | null;
}
export interface DhisSyncQueue {
  'badRequestCount'?: number | null;
  'changeTime'?: number | null;
  'details'?: string | null;
  'id': string;
  'isDeadLetter'?: boolean | null;
  'isDeleted'?: boolean | null;
  'priority'?: number | null;
  'recordId': string;
  'recordType': string;
  'type': string;
}
export interface Disaster {
  'countryCode': string;
  'description'?: string | null;
  'id': string;
  'name': string;
  'type': DisasterType;
}
export interface DisasterEvent {
  'date': Date;
  'disasterId': string;
  'id': string;
  'organisationUnitCode': string;
  'type': DisasterEventType;
}
export interface Entity {
  'attributes'?: any | null;
  'bounds'?: any | null;
  'code': string;
  'countryCode'?: string | null;
  'id': string;
  'imageUrl'?: string | null;
  'mRow'?: string;
  'metadata'?: any | null;
  'name': string;
  'parentId'?: string | null;
  'point'?: any | null;
  'region'?: any | null;
  'type'?: EntityType | null;
}
export interface EntityHierarchy {
  'canonicalTypes'?: string[] | null;
  'id': string;
  'name': string;
}
export interface EntityRelation {
  'childId': string;
  'entityHierarchyId': string;
  'id': string;
  'parentId': string;
}
export interface ErrorLog {
  'apiRequestLogId'?: string | null;
  'errorTime'?: Date | null;
  'id': string;
  'message'?: string | null;
  'type'?: string | null;
}
export interface ExternalDatabaseConnection {
  'code': string;
  'description'?: string | null;
  'id': string;
  'name': string;
  'permissionGroups'?: string[];
}
export interface FeedItem {
  'countryId'?: string | null;
  'creationDate'?: Date | null;
  'geographicalAreaId'?: string | null;
  'id': string;
  'permissionGroupId'?: string | null;
  'recordId'?: string | null;
  'templateVariables'?: Object | null;
  'type'?: string | null;
  'userId'?: string | null;
}
export interface GeographicalArea {
  'code'?: string | null;
  'countryId': string;
  'id': string;
  'levelCode': string;
  'levelName': string;
  'name': string;
  'parentId'?: string | null;
}
export interface Indicator {
  'builder': string;
  'code': string;
  'config'?: any;
  'id': string;
}
export interface LegacyReport {
  'code': string;
  'dataBuilder'?: string | null;
  'dataBuilderConfig'?: any | null;
  'dataServices'?: any | null;
  'id': string;
}
export interface LesmisSession {
  'accessPolicy': any;
  'accessToken': string;
  'accessTokenExpiry': string;
  'email': string;
  'id': string;
  'refreshToken': string;
}
export interface MapOverlay {
  'code': string;
  'config'?: any;
  'countryCodes'?: string[] | null;
  'dataServices'?: any | null;
  'id'?: string;
  'legacy'?: boolean;
  'linkedMeasures'?: string[] | null;
  'name': string;
  'permissionGroup': string;
  'projectCodes'?: string[] | null;
  'reportCode'?: string | null;
}
export interface MapOverlayGroup {
  'code': string;
  'id': string;
  'name': string;
}
export interface MapOverlayGroupRelation {
  'childId': string;
  'childType': string;
  'id': string;
  'mapOverlayGroupId': string;
  'sortOrder'?: number | null;
}
export interface MeditrakDevice {
  'appVersion'?: string | null;
  'config'?: any | null;
  'id': string;
  'installId': string;
  'platform'?: string | null;
  'userId': string;
}
export interface MeditrakSyncQueue {
  'changeTime'?: number | null;
  'id': string;
  'recordId': string;
  'recordType': string;
  'type': string;
}
export interface Ms1SyncLog {
  'count'?: number | null;
  'data'?: string | null;
  'endpoint'?: string | null;
  'errorList'?: string | null;
  'id': string;
  'recordId': string;
  'recordType': string;
}
export interface Ms1SyncQueue {
  'badRequestCount'?: number | null;
  'changeTime'?: number | null;
  'details'?: string | null;
  'id': string;
  'isDeadLetter'?: boolean | null;
  'isDeleted'?: boolean | null;
  'priority'?: number | null;
  'recordId': string;
  'recordType': string;
  'type': string;
}
export interface OneTimeLogin {
  'creationDate'?: Date | null;
  'id': string;
  'token': string;
  'useDate'?: Date | null;
  'userId': string;
}
export interface Option {
  'attributes'?: any | null;
  'id': string;
  'label'?: string | null;
  'optionSetId': string;
  'sortOrder'?: number | null;
  'value': string;
}
export interface OptionSet {
  'id': string;
  'name': string;
}
export interface PermissionGroup {
  'id': string;
  'name': string;
  'parentId'?: string | null;
}
export interface PermissionsBasedMeditrakSyncQueue {
  'changeTime'?: number | null;
  'countryIds'?: string[] | null;
  'entityType'?: EntityType | null;
  'id'?: string | null;
  'permissionGroups'?: string[] | null;
  'recordId'?: string | null;
  'recordType'?: string | null;
  'type'?: string | null;
}
export interface Project {
  'code': string;
  'config'?: any | null;
  'dashboardGroupName'?: string | null;
  'defaultMeasure'?: string | null;
  'description'?: string | null;
  'entityHierarchyId'?: string | null;
  'entityId'?: string | null;
  'id': string;
  'imageUrl'?: string | null;
  'logoUrl'?: string | null;
  'permissionGroups'?: string[] | null;
  'sortOrder'?: number | null;
}
export interface PsssSession {
  'accessPolicy': any;
  'accessToken': string;
  'accessTokenExpiry': string;
  'email': string;
  'id': string;
  'refreshToken': string;
}
export interface Question {
  'code'?: string | null;
  'dataElementId'?: string | null;
  'detail'?: string | null;
  'hook'?: string | null;
  'id': string;
  'mRow'?: string;
  'name'?: string | null;
  'optionSetId'?: string | null;
  'options'?: string[] | null;
  'text': string;
  'type': string;
}
export interface RefreshToken {
  'device'?: string | null;
  'expiry'?: number | null;
  'id': string;
  'meditrakDeviceId'?: string | null;
  'token': string;
  'userId': string;
}
export interface Report {
  'code': string;
  'config': ReportConfig;
  'id': string;
  'permissionGroupId': string;
}
export interface Setting {
  'id': string;
  'key': string;
  'value'?: string | null;
}
export interface SupersetInstance {
  'code': string;
  'config': any;
  'id': string;
}
export interface Survey {
  'canRepeat'?: boolean | null;
  'code': string;
  'countryIds'?: string[] | null;
  'dataGroupId'?: string | null;
  'id': string;
  'integrationMetadata'?: any | null;
  'mRow'?: string;
  'name': string;
  'periodGranularity'?: PeriodGranularity | null;
  'permissionGroupId'?: string | null;
  'requiresApproval'?: boolean | null;
  'surveyGroupId'?: string | null;
}
export interface SurveyGroup {
  'id': string;
  'name': string;
}
export interface SurveyResponse {
  'approvalStatus'?: ApprovalStatus | null;
  'assessorName': string;
  'dataTime'?: Date | null;
  'endTime': Date;
  'entityId': string;
  'id': string;
  'mRow'?: string;
  'metadata'?: string | null;
  'outdated'?: boolean | null;
  'startTime': Date;
  'surveyId': string;
  'timezone'?: string | null;
  'userId': string;
}
export interface SurveyResponseComment {
  'commentId': string;
  'id': string;
  'surveyResponseId': string;
}
export interface SurveyScreen {
  'id': string;
  'screenNumber': number;
  'surveyId': string;
}
export interface SurveyScreenComponent {
  'answersEnablingFollowUp'?: string[] | null;
  'componentNumber': number;
  'config'?: string | null;
  'detailLabel'?: string | null;
  'id': string;
  'isFollowUp'?: boolean | null;
  'questionId': string;
  'questionLabel'?: string | null;
  'screenId': string;
  'validationCriteria'?: string | null;
  'visibilityCriteria'?: string | null;
}
export interface SyncGroupLog {
  'id': string;
  'logMessage': string;
  'serviceType': ServiceType;
  'syncGroupCode': string;
  'timestamp'?: Date | null;
}
export interface UserAccount {
  'creationDate'?: Date | null;
  'email': string;
  'employer'?: string | null;
  'firstName'?: string | null;
  'gender'?: string | null;
  'id': string;
  'lastName'?: string | null;
  'mobileNumber'?: string | null;
  'passwordHash': string;
  'passwordSalt': string;
  'position'?: string | null;
  'primaryPlatform'?: PrimaryPlatform | null;
  'profileImage'?: string | null;
  'verifiedEmail'?: VerifiedEmail | null;
}
export interface UserEntityPermission {
  'entityId'?: string | null;
  'id': string;
  'permissionGroupId'?: string | null;
  'userId'?: string | null;
}
export interface UserFavouriteDashboardItem {
  'dashboardItemId': string;
  'id': string;
  'userId': string;
}
export interface UserSession {
  'accessTokenExpiry'?: string;
  'accessPolicy'?: any | null;
  'accessToken'?: string | null;
  'id': string;
  'refreshToken': string;
  'userName': string;
}
export enum VerifiedEmail {
  'unverified' = 'unverified',
  'new_user' = 'new_user',
  'verified' = 'verified',
}
export enum SyncGroupSyncStatus {
  'IDLE' = 'IDLE',
  'SYNCING' = 'SYNCING',
  'ERROR' = 'ERROR',
}
export enum ServiceType {
  'dhis' = 'dhis',
  'tupaia' = 'tupaia',
  'indicator' = 'indicator',
  'weather' = 'weather',
  'kobo' = 'kobo',
  'data-lake' = 'data-lake',
  'superset' = 'superset',
}
export enum PrimaryPlatform {
  'tupaia' = 'tupaia',
  'lesmis' = 'lesmis',
}
export enum PeriodGranularity {
  'yearly' = 'yearly',
  'quarterly' = 'quarterly',
  'monthly' = 'monthly',
  'weekly' = 'weekly',
  'daily' = 'daily',
}
export enum EntityType {
  'world' = 'world',
  'project' = 'project',
  'country' = 'country',
  'district' = 'district',
  'sub_district' = 'sub_district',
  'facility' = 'facility',
  'village' = 'village',
  'case' = 'case',
  'case_contact' = 'case_contact',
  'disaster' = 'disaster',
  'school' = 'school',
  'catchment' = 'catchment',
  'sub_catchment' = 'sub_catchment',
  'field_station' = 'field_station',
  'city' = 'city',
  'individual' = 'individual',
  'sub_facility' = 'sub_facility',
  'postcode' = 'postcode',
  'household' = 'household',
  'larval_habitat' = 'larval_habitat',
  'local_government' = 'local_government',
  'medical_area' = 'medical_area',
  'nursing_zone' = 'nursing_zone',
  'fetp_graduate' = 'fetp_graduate',
  'incident' = 'incident',
  'incident_reported' = 'incident_reported',
  'fiji_aspen_facility' = 'fiji_aspen_facility',
  'wish_sub_district' = 'wish_sub_district',
}
export enum DisasterType {
  'cyclone' = 'cyclone',
  'eruption' = 'eruption',
  'earthquake' = 'earthquake',
  'tsunami' = 'tsunami',
  'flood' = 'flood',
}
export enum DisasterEventType {
  'start' = 'start',
  'end' = 'end',
  'resolve' = 'resolve',
}
export enum DataTableType {
  'internal' = 'internal',
}
export enum DataSourceType {
  'dataElement' = 'dataElement',
  'dataGroup' = 'dataGroup',
}
export enum ApprovalStatus {
  'not_required' = 'not_required',
  'pending' = 'pending',
  'rejected' = 'rejected',
  'approved' = 'approved',
}