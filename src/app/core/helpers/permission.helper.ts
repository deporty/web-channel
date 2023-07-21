export function hasPermission(
  identifier: string,
  resourcesPermissions: string[]
) {
  let response = false;

  if (identifier) {
    const index = resourcesPermissions.indexOf(identifier);
    response = index >= 0;
  }
  return response;
}
