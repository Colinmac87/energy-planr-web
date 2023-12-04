import { useSelector } from "react-redux";

const WithRole = ({ roles, children }) => {
  const { user: currentUser } = useSelector((state) => state.account);

  if (roles.includes(currentUser.role)) return children;

  return null;
};

export default WithRole;
