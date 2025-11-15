import { ReactNode } from "react";
import { getUser } from "@/auth";
import PremiumUpgrade from "./PremiumUpgrade";

interface TierRouteGuardProps {
	children: ReactNode;
	requiredTier: "tier2" | "tier4" | "all";
	feature: "jobs" | "profile";
}

const TierRouteGuard = ({
	children,
	requiredTier,
	feature,
}: TierRouteGuardProps) => {
	const user = getUser();

	// If no user, this should be handled by the parent component
	if (!user) {
		return <>{children}</>;
	}

	// If tier2 or tier4 is required and user is not tier2/tier4, show premium upgrade
	if ((requiredTier === "tier2" || requiredTier === "tier4") && user.role !== "tier2" && user.role !== "tier4") {
		return <PremiumUpgrade feature={feature} />;
	}

	// User has access, render the protected content
	return <>{children}</>;
};

export default TierRouteGuard;
