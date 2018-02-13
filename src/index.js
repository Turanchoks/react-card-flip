// @flow
import React from "react";
import { render } from "react-dom";
import "./index.css";
import styled, { keyframes } from "styled-components";

const foldAnimation = keyframes`
  from {
    transform: rotateX(0deg);
  }
  to {
    transform: rotateX(-180deg);
  }
`;
const unfoldAnimation = keyframes`
  from {
    transform: rotateX(180deg);
  }
  to {
    transform: rotateX(0deg);
  }
`;

const FlipContainer = styled.div`
  position: relative;
  perspective-origin: 50% 50%;
  perspective: 300px;
  height: 120px;
  width: 60px;
  font-size: 3em;
`;

const StyledCard = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  height: 50%;
  overflow: hidden;
  background-color: yellow;
  border: 1px solid grey;
  align-items: flex-${props => props.alignItems};
`;

const FlipCard = styled.div`
  border: 1px solid grey;
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  background-color: yellow;
  height: 60px;
  overflow: hidden;
  backface-visibility: hidden;
  top: ${({ fold }) => (fold ? "0" : "50")}%;
  align-items: flex-${({ fold }) => (fold ? "end" : "start")};
  transform-origin: ${({ fold }) => (fold ? "50% 100%" : "50% 0%")};
  transform: rotateX(${({ fold }) => (fold ? 0 : "180")}deg);
  animation: ${({ fold }) => (fold ? foldAnimation : unfoldAnimation)} 1s
    cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s 1 normal forwards;
  transform-style: preserve-3d;
`;

class Card extends React.PureComponent<
  { children: React.Node },
  { shuffle: boolean }
> {
  state = {
    shuffle: false,
    prevChildren: this.props.children,
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.children !== nextProps.children) {
      this.setState(({ shuffle }) => ({
        shuffle: !shuffle,
        prevChildren: this.props.children,
      }));
    }
  }

  render() {
    const { children } = this.props;
    const { shuffle, prevChildren } = this.state;

    const notShuffle = !shuffle;
    return (
      <FlipContainer>
        <StyledCard alignItems="end">
          <div style={{ transform: "translateY(50%)" }}>{children}</div>
        </StyledCard>
        <StyledCard alignItems="start">
          <div style={{ transform: "translateY(-50%)" }}>{prevChildren}</div>
        </StyledCard>
        <FlipCard fold={shuffle}>
          <div style={{ transform: `translateY(${shuffle ? "" : "-"}50%)` }}>
            {notShuffle ? children : prevChildren}
          </div>
        </FlipCard>
        <FlipCard fold={notShuffle}>
          <div style={{ transform: `translateY(${notShuffle ? "" : "-"}50%)` }}>
            {shuffle ? children : prevChildren}
          </div>
        </FlipCard>
      </FlipContainer>
    );
  }
}

class App extends React.Component {
  state = {
    counter: 0,
  };

  componentDidMount() {
    // setInterval(this.inc, 1000)
  }

  inc = () => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.inc}>+1</button>
        <p>{this.state.counter}</p>
        <Card>{this.state.counter}</Card>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
