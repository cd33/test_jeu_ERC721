import styled from "styled-components";

// Used for wrapping a page component
export const Screen = styled.div`
  background-color: var(--dark-grey);
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? "pink" : "none")};
  width: 100%;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
`;

export const TextTitle = styled.p`
  color: var(--white);
  font-size: 20px;
  font-weight: 500;
`;

export const TextSubTitle = styled.p`
  color: var(--white);
  font-size: 16px;
  font-weight: 500;
`;

export const TextDescription = styled.p`
  color: var(--white);
  font-size: 14px;
  font-weight: 600;
  line-height: 5px;
  margin-bottom: 0px;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;

export const Navbar = styled.div`
  min-height: 3em;
  width: 100%;
  background-color: black;
  color: white;
`;

export const NavbarText = styled.div`
  position: relative;
  float: ${({ float }) => float ? float : "left"};
  margin: ${({ margin }) => margin ? `${margin}px` : "none"}
`;

export const ModalBackground = styled.div`
	z-index: auto;
	display: ${({ show }) => (show ? 'flex' : 'none')};
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width:100vw;
	background: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled.div`
  background: antiquewhite;
  width: 30%;
  height: auto;
  min-height: 30%;
  border-radius: 10px;
  padding: 0.75rem;
  color: rgba(0,0,139, 0.7);
  text-align: center;
  text-align-vertical: center;
`;

export const up = styled.div`
  border: 2px solid black;
  transform: rotate(-45deg);
  position: relative;
  top: 14px;
  right: 6px;
  width: 40px;
  background-color: black;
  border-radius: 25px;
`;

export const down = styled.div`
  border: 2px solid black;
  transform: rotate(45deg);
  position: relative;
  top: 10px;
  right: 6px;
  width: 40px;
  background-color: black;
  border-radius: 25px;
`;

export const Button = styled.button`
  background: ${props => props.primary ? "black" : "white"};
  color: ${props => props.primary ? "white" : "black"};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid white;
  border-radius: 3px;
`;

export const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  color: ${props => props.inputColor || "black"};
  background: papayawhip;
  border: none;
  border-radius: 3px;
`;
