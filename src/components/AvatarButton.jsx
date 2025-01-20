import { useEffect } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import Wallet from "./Wallet";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  MenuDivider,
} from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { magic } from "../utils/Magic";
import useAuth from "../hooks/userAuth";

function AvatarButton({ setRole }) {
  const navigate = useNavigate();
  const { isConnected, account } = useAuth();
  console.log(isConnected + " " + account);

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <Menu>
      {isConnected && account != null ? (
        <>
          <MenuButton
            as={Button}
            colorScheme="blue"
            rightIcon={<IoIosArrowDropdownCircle />}
          >
            {account.substring(0, 5) +
              "..." +
              account.substring(37, 42)}
          </MenuButton>
        </>
      ) : (
        <Wallet />
      )}

      <MenuList>
        <MenuItem icon={<CgProfile />} onClick={handleProfile}>
          Profile
        </MenuItem>
        <MenuDivider />
        <MenuItem
          icon={<RiLogoutBoxRFill />}
          onClick={async () => {
            await magic.user.logout();
            setRole("");
            window.location.reload();
          }}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default AvatarButton;
