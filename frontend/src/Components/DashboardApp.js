import React from "react";
import ActivityLog from "./ActivityLog";
import Expenses from "./Expenses";

import Overview from "./Overview";
import Transactions from "./Transactions";
import Wallets from "./Wallets";

export default function DashboardApp() {
  return (
    <div className="app">
      
      <div className="app__grid">
        <div className="app__grid__1">
          <Wallets />
          <Expenses />
          <Transactions />
        </div>
        <div className="app__grid__2">
          <Overview />
          <ActivityLog />
        </div>
      </div>
    </div>
  );
}
