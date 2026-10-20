import React from "react";
import StatCard from "../../../../components/common/StatCard";

/**
 * AdminStatCard (Admin Overview Metric Variant)
 * Clean proxy wrapper around shared StatCard.
 */
export default function AdminStatCard(props) {
  return <StatCard {...props} />;
}
