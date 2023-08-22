export const USER_ROLE_ADMIN = "admin";
export const USER_ROLE_MODERATOR = "moderator";
export const USER_ROLE_VIEWER = "viewer";

export const isAdmin = (role) => role == USER_ROLE_ADMIN;

export const canModerate = (role) =>
  [USER_ROLE_ADMIN, USER_ROLE_MODERATOR].includes(role);
