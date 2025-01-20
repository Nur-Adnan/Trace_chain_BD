import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobeDemo } from "../GlobeDemo";
import "./roles.css";

function Roles() {
  let navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  // Handle navigation based on selected role
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle dropdown change
  const handleDropdownChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    if (role === "Admin") handleNavigation("/admin");
    else if (role === "Customs") handleNavigation("/customs");
    else if (role === "Importer") handleNavigation("/importer");
    else if (role === "Distributor") handleNavigation("/distributor");
    else if (role === "Retailer") handleNavigation("/retailer");
  };

  return (
    <header>
      {/* Animated Background Container */}
      <div className="animated-background w-full h-screen flex items-center justify-center">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-10 relative z-10">
          <div className="grid items-center justify-items-start gap-8 sm:gap-20 lg:grid-cols-2">
            <div className="flex flex-col">
              <h1 className="mb-4 text-4xl font-bold md:text-6xl">
                Welcome to TraceChainBD
              </h1>
              <p className="max-w-lg text-sm text-gray-500 sm:text-xl mb-4">
                Choose Your Role First!
              </p>
              <form
                name="email-form"
                method="get"
                className="relative w-full max-w-xl pb-6 md:mb-6 lg:mb-4 lg:max-w-md"
              >
                <div className="mb-5">
                  <select
                    className="h-10 w-full rounded-lg border-2 border-gray-300 px-3 text-black placeholder-gray-400 focus:outline-none focus:border-[#5160be] focus:ring-1 focus:ring-[#5160be]"
                    placeholder="Select Role"
                    value={selectedRole}
                    onChange={handleDropdownChange}
                    required
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="Admin">Admin</option>
                    <option value="Customs">Customs</option>
                    <option value="Importer">Importer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Retailer">Retailer</option>
                  </select>
                </div>
              </form>

              <div className="grid w-full max-w-2xl grid-flow-row grid-cols-3 gap-4">
                <div>
                  <h3 className="text-2xl font-bold md:text-3xl">10K+</h3>
                  <p className="text-sm text-gray-500">Customers</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold md:text-3xl">200K+</h3>
                  <p className="text-sm text-gray-500">Emails</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold md:text-3xl">500+</h3>
                  <p className="text-sm text-gray-500">Projects</p>
                </div>
              </div>
            </div>
            <div className="inline-block h-full w-full mb-24">
              <GlobeDemo />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Roles;
