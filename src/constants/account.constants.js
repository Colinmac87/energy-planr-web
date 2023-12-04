export const USER_ROLE_ADMIN = "admin";
export const USER_ROLE_MODERATOR = "moderator";
export const USER_ROLE_EDITOR = "editor";
export const USER_ROLE_VIEWER = "viewer";

export const canAdmin = (userRole) => userRole == USER_ROLE_ADMIN;

export const canModerate = (userRole) =>
  [USER_ROLE_ADMIN, USER_ROLE_MODERATOR].includes(userRole);

export const canEdit = (userRole) =>
  [USER_ROLE_ADMIN, USER_ROLE_MODERATOR, USER_ROLE_EDITOR].includes(userRole);
