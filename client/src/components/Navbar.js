import React from "react";
import * as s from "../globalStyles";

const NavbarCustom = ({ accounts }) => (
    <s.Navbar>
        <s.NavbarText float="right" margin={10}>{accounts !== null && accounts[0]}</s.NavbarText>
    </s.Navbar>
);

export default NavbarCustom;