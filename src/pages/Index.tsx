import { Navigate } from "react-router-dom";
import { isLoggedIn } from "@/services/storage.service";

const Index = () => {
  if (isLoggedIn()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/" replace />;
};

export default Index;
