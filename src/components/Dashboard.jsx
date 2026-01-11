import { useAuth } from "../context/useAuth";

const Dashboard = () => {
  const { user, loading, error, logout } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", padding: 20 }}>
      <h2>Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Mobile:</strong> {user.mobile}</p>
      <p><strong>User ID:</strong> {user._id}</p>

      <button
        onClick={logout}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: 4
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
