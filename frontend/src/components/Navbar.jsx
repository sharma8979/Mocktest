const { logout } = useAuth();
const navigate = navigate();

const handleLogout = () => {
  logout();
  navigate("/login");
};
