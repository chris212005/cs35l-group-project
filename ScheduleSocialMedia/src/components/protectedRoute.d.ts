// ProtectedRoute.d.ts
import { ReactNode } from "react";

declare function ProtectedRoute(props: {
  children?: ReactNode;
}): JSX.Element;

export default ProtectedRoute;