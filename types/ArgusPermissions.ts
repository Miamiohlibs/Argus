export interface ArgusPermissions {
  isBasicUser?: boolean;
  isEditorOrAbove?: boolean;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  canPrint?: boolean;
  canEdit?: boolean; // requires projectId
  isOwner?: boolean; // requires projectId
  isCoEditor?: boolean; // requires projectId
  nonOwnerEditor?: boolean; // requires projectId
}
